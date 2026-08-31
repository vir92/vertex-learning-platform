#!/usr/bin/env node
/**
 * Offline video ingestion for Vertex intelligent search.
 *
 * Reads sanity/scripts/videos.ndjson (a JSON map of lesson slug -> YouTube video
 * metadata), fetches each video's transcript from YouTube, splits it into
 * ~TARGET_SECONDS timestamped chunks, and upserts one `videoChunk` document per
 * chunk in Sanity. Existing chunks for a lesson are replaced (delete + create)
 * so the script is idempotent per run.
 *
 * Usage:
 *   node sanity/scripts/ingest-video-chunks.js [--dry-run] [--slug <lesson-slug>] [--limit <n>]
 *
 * Requires SANITY_API_READ_TOKEN (write access) in the environment.
 * Rate limited; safe to re-run for a single lesson with --slug.
 */

const fs = require('node:fs')
const path = require('node:path')

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? undefined : args[i + 1]
}
const DRY_RUN = args.includes('--dry-run')
const ONLY_SLUG = flag('slug')
const LIMIT = flag('limit') ? parseInt(flag('limit'), 10) : Infinity

const TARGET_SECONDS = 45
const MIN_SECONDS = 20

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_READ_TOKEN'
  )
  process.exit(1)
}

const videosPath = path.join(__dirname, '..', '..', 'sanity', 'scripts', 'videos.ndjson')
if (!fs.existsSync(videosPath)) {
  console.error(`Videos file not found: ${videosPath}`)
  process.exit(1)
}

const videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'))

/* ---------------------------------------------------------------- */
/* YouTube transcript fetching                                       */
/* ---------------------------------------------------------------- */

const UA_IPHONE =
  'com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X)'

async function fetchWithTimeout(url, options = {}, timeoutMs = 30_000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** Fetch a video's caption track as [{startSeconds, endSeconds, text}] events. */
async function fetchTranscript(videoId) {
  // 1. Watch page -> INNERTUBE_API_KEY
  const watchRes = await fetchWithTimeout(
    `https://www.youtube.com/watch?v=${videoId}&hl=en`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Language': 'en-US,en;q=0.9' } }
  )
  if (!watchRes.ok) throw new Error(`watch page HTTP ${watchRes.status}`)
  const watchHtml = await watchRes.text()
  const keyMatch = watchHtml.match(/"INNERTUBE_API_KEY":"([^"]+)"/)
  if (!keyMatch) throw new Error('no INNERTUBE_API_KEY in watch page')

  // 2. InnerTube IOS player -> captionTracks[].baseUrl (unsigned, fetchable)
  const playerRes = await fetchWithTimeout(
    `https://www.youtube.com/youtubei/v1/player?key=${keyMatch[1]}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': UA_IPHONE },
      body: JSON.stringify({
        context: {
          client: { clientName: 'IOS', clientVersion: '20.10.4', deviceModel: 'iPhone16,2', hl: 'en' },
        },
        videoId,
      }),
    }
  )
  if (!playerRes.ok) throw new Error(`player HTTP ${playerRes.status}`)
  const player = await playerRes.json()
  const status = player?.playabilityStatus?.status
  if (status !== 'OK') throw new Error(`playability ${status}`)
  const tracks =
    player?.captions?.playerCaptionsTracklistRenderer?.captionTracks || []
  // Prefer manual English captions over ASR
  const track =
    tracks.find((t) => t.languageCode === 'en' && t.kind !== 'asr') ||
    tracks.find((t) => t.languageCode === 'en') ||
    tracks[0]
  if (!track) throw new Error('no caption tracks')

  // 3. json3 transcript
  const captionRes = await fetchWithTimeout(`${track.baseUrl}&fmt=json3`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })
  if (!captionRes.ok) throw new Error(`timedtext HTTP ${captionRes.status}`)
  const body = await captionRes.text()
  if (!body.startsWith('{')) throw new Error('timedtext returned non-JSON (empty?)')
  const data = JSON.parse(body)

  const chapters = parseChapters(player, data)
  const events = []
  for (const event of data.events || []) {
    if (!event.segs) continue
    const text = event.segs.map((s) => s.utf8 || '').join('').replace(/\s+/g, ' ').trim()
    if (!text || text === '\n') continue
    events.push({
      startMs: event.tStartMs,
      endMs: event.tStartMs + (event.dDurationMs || 0),
      text,
    })
  }
  if (events.length === 0) throw new Error('transcript had no text events')
  return { events, chapters }
}

/** Extract chapter markers from either description timestamps or chapter chapters array. */
function parseChapters(player, data) {
  const markers = []
  const chapters = data?.chapters || player?.chapters?.playerChaptersRenderer?.chapters
  if (Array.isArray(chapters)) {
    for (const ch of chapters) {
      const title = ch?.chapterRenderer?.title?.simpleText || ch?.title?.simpleText
      const startMs = ch?.chapterRenderer?.timeRangeStartMillis ?? ch?.timeRangeStartMillis
      if (title && typeof startMs === 'number') markers.push({ title, startMs })
    }
  }
  return markers.sort((a, b) => a.startMs - b.startMs)
}

/** Group transcript events into ~45s chunks aligned to natural sentence breaks. */
function chunkTranscript(events, chapters) {
  const chunks = []
  let current = null
  const flush = () => {
    if (current && current.text.trim()) chunks.push(current)
    current = null
  }
  const chapterAt = (ms) => {
    let title
    for (const ch of chapters) {
      if (ch.startMs <= ms) title = ch.title
      else break
    }
    return title
  }
  for (const ev of events) {
    if (!current) {
      current = {
        startMs: ev.startMs,
        endMs: ev.endMs,
        text: ev.text,
        chapter: chapterAt(ev.startMs),
      }
      continue
    }
    const currentDur = (current.endMs - current.startMs) / 1000
    const wouldDur = (ev.endMs - current.startMs) / 1000
    // Start a new chunk when adding this event would exceed target and the
    // current chunk is already substantial, or when a new chapter starts.
    const newChapter = chapterAt(ev.startMs) && chapterAt(ev.startMs) !== current.chapter
    if (
      (wouldDur > TARGET_SECONDS && currentDur >= MIN_SECONDS) ||
      newChapter
    ) {
      flush()
      current = {
        startMs: ev.startMs,
        endMs: ev.endMs,
        text: ev.text,
        chapter: chapterAt(ev.startMs),
      }
    } else {
      current.endMs = ev.endMs
      current.text += ` ${ev.text}`
    }
  }
  flush()
  return chunks
}

/* ---------------------------------------------------------------- */
/* Sanity mutations                                                  */
/* ---------------------------------------------------------------- */

const API_VERSION = '2026-02-01'

async function fetchExistingChunkIds(lessonId) {
  // Note: the plain HTTP query API supports parameters only via query-string
  // interpolation; lesson IDs are generated (lesson.<slug>) so inlining is safe.
  const query = encodeURIComponent(
    `*[_type == "videoChunk" && lesson._ref == "${lessonId}"]._id`
  )
  const res = await fetchWithTimeout(
    `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error(`query HTTP ${res.status}`)
  const body = await res.json()
  return (body.result || []).map((id) => id)
}

async function mutate(mutations) {
  const res = await fetchWithTimeout(
    `https://${projectId}.api.sanity.io/v${API_VERSION}/data/mutate/${dataset}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations }),
    },
    60_000
  )
  if (!res.ok) throw new Error(`mutate HTTP ${res.status}: ${await res.text()}`)
  return res.json()
}

/* ---------------------------------------------------------------- */
/* Main                                                              */
/* ---------------------------------------------------------------- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const slugs = Object.keys(videos).filter((s) => !ONLY_SLUG || s === ONLY_SLUG).slice(0, LIMIT === Infinity ? undefined : LIMIT)
  console.log(`Ingesting ${slugs.length} lesson(s)${DRY_RUN ? ' (dry run)' : ''}`)

  let ingested = 0
  let skipped = 0
  let failed = 0

  for (const slug of slugs) {
    const meta = videos[slug]
    const videoId = meta.id
    const duration = meta.duration
    process.stdout.write(`[${slug}] `)
    try {
      const { events, chapters } = await fetchTranscript(videoId)
      const chunks = chunkTranscript(events, chapters)
      const lessonId = `lesson.${slug}`
      if (DRY_RUN) {
        console.log(
          `dry-run: ${events.length} events -> ${chunks.length} chunks (${Math.round(chunks[0]?.startMs / 1000 || 0)}s..${Math.round(chunks[chunks.length - 1]?.endMs / 1000 || 0)}s / video ${duration}s)`
        )
        skipped++
        continue
      }
      // Replace existing chunks for this lesson in one transaction
      const existingIds = await fetchExistingChunkIds(lessonId)
      const mutations = []
      for (const id of existingIds) mutations.push({ delete: { id } })
      chunks.forEach((chunk, index) => {
        mutations.push({
          create: {
            _type: 'videoChunk',
            lesson: { _type: 'reference', _ref: lessonId },
            videoId,
            chunkIndex: index,
            start: Math.round(chunk.startMs / 1000),
            end: Math.round(chunk.endMs / 1000),
            text: chunk.text.replace(/\s+/g, ' ').trim(),
            chapter: chunk.chapter || undefined,
          },
        })
      })
      await mutate(mutations)
      ingested++
      console.log(`ok: ${chunks.length} chunks (${existingIds.length} replaced)`)
    } catch (err) {
      failed++
      console.log(`FAILED: ${err.message}`)
    }
    await sleep(400) // be polite to YouTube
  }

  console.log(`\nDone: ${ingested} ingested, ${skipped} skipped, ${failed} failed`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
