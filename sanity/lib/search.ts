import { stegaClean } from '@sanity/client/stega'

import { executeGroqQuery, getMcpClient, type MCPClient } from './mcp'
import { readClient } from './read-client'
import { runAgentSearch } from './search-agent'

export interface SearchOptions {
  query: string
  type?: 'all' | 'video' | 'lesson'
  sort?: 'relevant' | 'duration_asc' | 'duration_desc' | 'newest' | 'alphabetical'
  limit?: number
  offset?: number
  useMcp?: boolean
}

export type SearchEngine = 'agent' | 'mcp' | 'local'

export interface SearchSegment {
  chunkId: string
  text: string
  start: number
  end: number
  chapter?: string
  lessonSlug?: string
  lessonTitle?: string
  freePreview?: boolean
  videoUrl?: string
  courseTitle?: string
  courseSlug?: string
  summary?: string
  steps?: number
  finishReason?: string
}

export interface SearchResultItem {
  id: string
  _id: string
  title: string
  slug: string
  type: 'video' | 'lesson'
  description?: string
  summary?: string
  duration?: number
  durationFormatted?: string
  formattedDuration?: string
  videoUrl?: string
  thumbnailUrl?: string
  freePreview?: boolean
  keyPoints?: string[]
  proTip?: string
  moduleTitle?: string
  moduleIndex?: number
  lessonIndex?: number
  lessonNumber?: string
  lessonBadge?: string
  course?: {
    _id: string
    title: string
    slug: string
    coverImageUrl?: string
    category?: {
      title?: string
      slug?: string
    }
  }
}

export interface MatchedCourse {
  _id: string
  title: string
  slug: string
  summary?: string
  level?: string
  coverImageUrl?: string
  coverImageAlt?: string
  category?: {
    _id?: string
    title?: string
    slug?: string
  }
  instructor?: {
    _id?: string
    name?: string
    slug?: string
    title?: string
    photoUrl?: string
  }
  lessonCount?: number
  moduleCount?: number
  totalDuration?: number
  matchCount?: number
}

export interface SearchFacets {
  all: number
  video: number
  lesson: number
}

export interface SearchResponse {
  query: string
  engine: SearchEngine
  totalCount: number
  courseCount: number
  facets: SearchFacets
  results: SearchResultItem[]
  segments?: SearchSegment[]
  answer?: string
  steps?: number
  matchedCourses: MatchedCourse[]
  executionTimeMs: number
  error?: string
}

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 100

interface RawCourse {
  _id: string
  title: string
  slug: string
  summary?: string
  level?: string
  coverImageUrl?: string
  coverImageAlt?: string
  category?: {
    _id?: string
    title?: string
    slug?: string
  }
  instructor?: {
    _id?: string
    name?: string
    slug?: string
    title?: string
    photoUrl?: string
  }
  modules?: Array<{
    _key: string
    title: string
    summary?: string
    lessons?: Array<{
      _id: string
      slug?: string
    }>
  }>
}

interface RawLesson {
  _id: string
  _createdAt: string
  _score?: number
  title: string
  slug: string
  duration?: number
  freePreview?: boolean
  videoUrl?: string
  thumbnailUrl?: string
  notes?: unknown[]
  keyPoints?: string[]
  proTip?: string
  course?: RawCourse
}

interface ScoredLesson {
  item: SearchResultItem
  courseObj?: RawCourse
  score: number
  createdAt: string
  hasVideo: boolean
}

/* ------------------------------------------------------------------ */
/* GROQ projections & query builders                                   */
/* ------------------------------------------------------------------ */

const LESSON_SEARCH_PROJECTION = `
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  duration,
  freePreview,
  videoUrl,
  "thumbnailUrl": thumbnail.asset->url,
  notes,
  keyPoints,
  proTip,
  "course": *[_type == "course" && references(^._id)][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    "coverImageUrl": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    "category": category->{ _id, title, "slug": slug.current },
    "instructor": instructor->{ _id, name, "slug": slug.current, title, "photoUrl": photo.asset->url },
    "modules": modules[] {
      _key,
      title,
      summary,
      "lessons": lessons[]-> {
        _id,
        "slug": slug.current
      }
    }
  }
`

const ALL_LESSONS_GROQ = `
  *[_type == "lesson" && defined(slug.current)] {
    ${LESSON_SEARCH_PROJECTION}
  }
`

/** Escapes a string for inline use as a GROQ string literal. */
function groqString(value: string): string {
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
  return `"${escaped}"`
}

/**
 * Intelligent search query for the Sanity Context MCP `groq_query` tool.
 *
 * Hybrid scoring: keyword matching (BM25 via `text::query`) combined with
 * semantic ranking (`text::semanticSimilarity`, requires dataset embeddings).
 * When `semantic` is false the query degrades to keyword-only scoring.
 */
function buildMcpSearchGroq(query: string, semantic: boolean): string {
  const q = groqString(query)
  const scoreExpr = semantic
    ? `[title, keyPoints[], proTip] match text::query(${q}), text::semanticSimilarity(${q})`
    : `[title, keyPoints[], proTip] match text::query(${q})`
  return `
*[_type == "lesson" && defined(slug.current)]
| score(${scoreExpr})
| order(_score desc)
{
  _score,
  ${LESSON_SEARCH_PROJECTION}
}
[ _score > 0 ]
`
}

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

function formatDurationSeconds(seconds: number | undefined | null): string {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '00:00'
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function extractNotesText(notes: unknown[] | undefined | null): string {
  if (!Array.isArray(notes)) return ''
  const texts: string[] = []
  for (const block of notes) {
    if (block && typeof block === 'object' && '_type' in block && block._type === 'block') {
      const children = (block as { children?: Array<{ text?: string }> }).children
      if (Array.isArray(children)) {
        for (const child of children) {
          if (child && typeof child.text === 'string') {
            texts.push(child.text)
          }
        }
      }
    }
  }
  return texts.join(' ')
}

interface NormalizedOptions {
  rawQuery: string
  cleanQuery: string
  queryTerms: string[]
  type: NonNullable<SearchOptions['type']>
  sort: NonNullable<SearchOptions['sort']>
  limit: number
  offset: number
}

function normalizeOptions(options: SearchOptions): NormalizedOptions {
  const rawQuery = (options.query || '').trim()
  const cleanQuery = stegaClean(rawQuery).toLowerCase()
  const queryTerms = cleanQuery
    ? cleanQuery
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
    : []
  const type = options.type || 'all'
  const sort = options.sort || 'relevant'
  const limit =
    typeof options.limit === 'number' && options.limit > 0
      ? Math.min(Math.trunc(options.limit), MAX_LIMIT)
      : DEFAULT_LIMIT
  const offset =
    typeof options.offset === 'number' && options.offset >= 0 ? Math.trunc(options.offset) : 0
  return { rawQuery, cleanQuery, queryTerms, type, sort, limit, offset }
}

interface KeywordScoreInput {
  lessonTitle: string
  courseTitle: string
  categoryTitle: string
  moduleTitle: string
  keyPoints: string
  notesText: string
  proTip: string
}

/**
 * Local keyword relevance scoring (used when the MCP engine is not requested
 * or is unavailable).
 */
function computeKeywordScore(
  input: KeywordScoreInput,
  cleanQuery: string,
  queryTerms: string[]
): number {
  const { lessonTitle, courseTitle, categoryTitle, moduleTitle, keyPoints, notesText, proTip } = input
  const lowerTitle = lessonTitle.toLowerCase()
  const lowerCourse = courseTitle.toLowerCase()
  const lowerCategory = categoryTitle.toLowerCase()
  const lowerModule = moduleTitle.toLowerCase()
  const lowerKeyPoints = keyPoints.toLowerCase()
  const lowerNotes = notesText.toLowerCase()
  const lowerProTip = proTip.toLowerCase()

  let score = 0

  // Exact full query match
  if (lowerTitle === cleanQuery) {
    score += 120
  } else if (lowerTitle.includes(cleanQuery)) {
    score += 80
  }

  if (lowerKeyPoints.includes(cleanQuery)) {
    score += 40
  }

  if (lowerCourse.includes(cleanQuery) || lowerModule.includes(cleanQuery)) {
    score += 30
  }

  if (lowerNotes.includes(cleanQuery) || lowerProTip.includes(cleanQuery)) {
    score += 20
  }

  // Individual terms scoring
  let termMatches = 0
  for (const term of queryTerms) {
    let matched = false
    if (lowerTitle.includes(term)) {
      score += 25
      matched = true
    }
    if (lowerKeyPoints.includes(term)) {
      score += 15
      matched = true
    }
    if (lowerModule.includes(term)) {
      score += 10
      matched = true
    }
    if (lowerCourse.includes(term) || lowerCategory.includes(term)) {
      score += 8
      matched = true
    }
    if (lowerNotes.includes(term) || lowerProTip.includes(term)) {
      score += 5
      matched = true
    }
    if (matched) {
      termMatches++
    }
  }

  // Bonus if all terms matched
  if (termMatches === queryTerms.length) {
    score += 35
  }

  return score
}

/**
 * Transforms raw lessons (with parent course/module hierarchy) into scored
 * search items. When `scoreBy` is provided (MCP path) the score comes from
 * the query's `_score`; otherwise local keyword scoring is applied.
 */
function buildScoredLessons(
  rawLessons: RawLesson[],
  cleanQuery: string,
  queryTerms: string[],
  scoreBy?: Map<string, number>
): ScoredLesson[] {
  const scoredLessons: ScoredLesson[] = []

  for (const lesson of rawLessons) {
    const course = lesson.course
    let moduleIndex: number | undefined
    let lessonIndex: number | undefined
    let lessonNumber: string | undefined
    let moduleTitle: string | undefined

    if (course?.modules && Array.isArray(course.modules)) {
      for (let m = 0; m < course.modules.length; m++) {
        const mod = course.modules[m]
        if (mod.lessons && Array.isArray(mod.lessons)) {
          const lIdx = mod.lessons.findIndex(
            (l) => l._id === lesson._id || l.slug === lesson.slug
          )
          if (lIdx !== -1) {
            moduleIndex = m + 1
            lessonIndex = lIdx + 1
            lessonNumber = `Lesson ${moduleIndex}.${lessonIndex}`
            moduleTitle = mod.title
            break
          }
        }
      }
    }

    const lessonTitle = stegaClean(lesson.title || '')
    const courseTitle = stegaClean(course?.title || '')
    const categoryTitle = stegaClean(course?.category?.title || '')
    const keyPoints = (lesson.keyPoints || []).map((k) => stegaClean(k))
    const proTip = stegaClean(lesson.proTip || '')
    const notesText = extractNotesText(lesson.notes)

    let score: number
    if (queryTerms.length === 0) {
      score = 1
    } else if (scoreBy) {
      score = scoreBy.get(lesson._id) ?? 0
    } else {
      score = computeKeywordScore(
        {
          lessonTitle,
          courseTitle,
          categoryTitle,
          moduleTitle: moduleTitle || '',
          keyPoints: keyPoints.join(' '),
          notesText,
          proTip,
        },
        cleanQuery,
        queryTerms
      )
    }

    if (queryTerms.length === 0 || score > 0) {
      const hasVideo = Boolean(lesson.videoUrl && lesson.videoUrl.trim() !== '')
      const formattedDuration = formatDurationSeconds(lesson.duration)
      const description =
        notesText.slice(0, 160) ||
        (keyPoints.length > 0 ? keyPoints.join(' · ') : undefined) ||
        course?.summary

      const item: SearchResultItem = {
        id: lesson._id,
        _id: lesson._id,
        title: lessonTitle,
        slug: lesson.slug,
        type: hasVideo ? 'video' : 'lesson',
        description,
        summary: description,
        duration: lesson.duration,
        durationFormatted: formattedDuration,
        formattedDuration,
        videoUrl: lesson.videoUrl,
        thumbnailUrl: lesson.thumbnailUrl,
        freePreview: lesson.freePreview,
        keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
        proTip: proTip || undefined,
        moduleTitle,
        moduleIndex,
        lessonIndex,
        lessonNumber,
        lessonBadge: lessonNumber ?? (moduleIndex ? `Module ${moduleIndex}` : undefined),
        course: course
          ? {
              _id: course._id,
              title: course.title,
              slug: course.slug,
              coverImageUrl: course.coverImageUrl,
              category: course.category
                ? {
                    title: course.category.title,
                    slug: course.category.slug,
                  }
                : undefined,
            }
          : undefined,
      }

      scoredLessons.push({
        item,
        courseObj: course,
        score,
        createdAt: lesson._createdAt,
        hasVideo,
      })
    }
  }

  return scoredLessons
}

/**
 * Applies type filtering, sorting, matched-course aggregation, and pagination
 * to scored lessons. Shared by both search engines.
 */
function finalizeResults(
  scoredLessons: ScoredLesson[],
  type: NonNullable<SearchOptions['type']>,
  sort: NonNullable<SearchOptions['sort']>,
  limit: number,
  offset: number,
  rawQuery: string,
  engine: SearchEngine,
  startTime: number
): SearchResponse {
  // Calculate facets across all matched items
  const facetAll = scoredLessons.length
  const facetVideo = scoredLessons.filter((s) => s.hasVideo).length
  const facetLesson = scoredLessons.filter((s) => !s.hasVideo || s.item.keyPoints?.length).length

  // Filter by requested type
  let filtered = scoredLessons
  if (type === 'video') {
    filtered = scoredLessons.filter((s) => s.hasVideo)
  } else if (type === 'lesson') {
    // Return items as lesson format or non-video
    filtered = scoredLessons.map((s) => ({
      ...s,
      item: { ...s.item, type: 'lesson' as const },
    }))
  }

  // Sort results
  filtered.sort((a, b) => {
    if (sort === 'duration_asc') {
      return (a.item.duration ?? 0) - (b.item.duration ?? 0)
    }
    if (sort === 'duration_desc') {
      return (b.item.duration ?? 0) - (a.item.duration ?? 0)
    }
    if (sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sort === 'alphabetical') {
      return a.item.title.localeCompare(b.item.title)
    }
    // Default: 'relevant'
    if (b.score !== a.score) {
      return b.score - a.score
    }
    return a.item.title.localeCompare(b.item.title)
  })

  // Extract matched courses with match count
  const courseMap = new Map<string, MatchedCourse>()
  for (const match of filtered) {
    if (match.courseObj) {
      const c = match.courseObj
      const existing = courseMap.get(c._id)
      if (existing) {
        existing.matchCount = (existing.matchCount || 0) + 1
      } else {
        const lessonCount = c.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0
        courseMap.set(c._id, {
          _id: c._id,
          title: c.title,
          slug: c.slug,
          summary: c.summary,
          level: c.level,
          coverImageUrl: c.coverImageUrl,
          coverImageAlt: c.coverImageAlt,
          category: c.category,
          instructor: c.instructor,
          lessonCount,
          moduleCount: c.modules?.length || 0,
          matchCount: 1,
        })
      }
    }
  }

  const matchedCourses = Array.from(courseMap.values()).sort(
    (a, b) => (b.matchCount || 0) - (a.matchCount || 0)
  )

  // Paginate results
  const totalCount = filtered.length
  const paginatedResults = filtered.slice(offset, offset + limit).map((s) => s.item)

  return {
    query: rawQuery,
    engine,
    totalCount,
    courseCount: matchedCourses.length,
    facets: {
      all: facetAll,
      video: facetVideo,
      lesson: facetLesson,
    },
    results: paginatedResults,
    matchedCourses,
    executionTimeMs: Date.now() - startTime,
  }
}

/* ------------------------------------------------------------------ */
/* Segment search (video chunks with timestamps)                       */
/* ------------------------------------------------------------------ */

const SEGMENT_PROJECTION = `
  _id,
  _score,
  chunkIndex,
  start,
  end,
  text,
  chapter,
  "lessonSlug": lesson->slug.current,
  "lessonTitle": lesson->title,
  "freePreview": lesson->freePreview,
  "videoUrl": lesson->videoUrl,
  "thumbnailUrl": lesson->thumbnail.asset->url,
  "course": *[_type == "course" && references(^.lesson->_id)][0] {
    _id,
    title,
    "slug": slug.current,
    "category": category->{ title, "slug": slug.current }
  }
`

/**
 * GROQ for scored videoChunk matches, run either through the MCP endpoint
 * (Connection Layer) or readClient.
 */
function buildSegmentSearchGroq(query: string): string {
  const q = groqString(query)
  return `
*[_type == "videoChunk" && defined(lesson->_id)]
| score(text match text::query(${q}))
| order(_score desc)
{ ${SEGMENT_PROJECTION} }
[ _score > 0 ]
[0...${MAX_LIMIT}]
`
}

function toSegments(docs: unknown[]): SearchSegment[] {
  const segments: SearchSegment[] = []
  for (const doc of docs) {
    if (!doc || typeof doc !== 'object') continue
    const d = doc as Record<string, unknown>
    if (typeof d.text !== 'string' || !d.text.trim()) continue
    const course = d.course as { title?: string; slug?: string } | undefined
    segments.push({
      chunkId: String(d._id ?? ''),
      text: stegaClean(d.text),
      start: typeof d.start === 'number' ? d.start : 0,
      end: typeof d.end === 'number' ? d.end : 0,
      chapter: typeof d.chapter === 'string' && d.chapter ? d.chapter : undefined,
      lessonSlug: typeof d.lessonSlug === 'string' ? d.lessonSlug : undefined,
      lessonTitle: typeof d.lessonTitle === 'string' ? stegaClean(d.lessonTitle) : undefined,
      freePreview: d.freePreview === true,
      videoUrl: typeof d.videoUrl === 'string' ? d.videoUrl : undefined,
      courseTitle: course?.title ? stegaClean(course.title) : undefined,
      courseSlug: course?.slug ?? undefined,
    })
  }
  return segments
}

/**
 * Direct segment search (no LLM): BM25 keyword scoring over ingested video
 * chunks through the Sanity Context MCP. Used as a fallback when no Gemini
 * key is configured, and as the hydration source for agent-run GROQ.
 */
async function searchSegmentsMcp(
  client: MCPClient,
  query: string
): Promise<SearchSegment[]> {
  const docs = await executeGroqQuery(client, buildSegmentSearchGroq(query))
  return toSegments(docs)
}

/* ------------------------------------------------------------------ */
/* Engines                                                             */
/* ------------------------------------------------------------------ */

/**
 * Local engine: fetches all lessons from Sanity and scores them with
 * keyword matching in-process. No external dependencies.
 */
async function searchLocal(options: SearchOptions, startTime: number): Promise<SearchResponse> {
  const { rawQuery, cleanQuery, queryTerms, type, sort, limit, offset } = normalizeOptions(options)

  const rawLessons = await readClient.fetch<RawLesson[]>(ALL_LESSONS_GROQ)
  const scoredLessons = buildScoredLessons(rawLessons, cleanQuery, queryTerms)
  return finalizeResults(scoredLessons, type, sort, limit, offset, rawQuery, 'local', startTime)
}

/**
 * MCP engine: hybrid keyword + semantic scoring in Sanity through the
 * Sanity Context MCP `groq_query` tool. Prefers ingested timestamped video
 * chunks (segment results) and falls back to lesson-level search when no
 * chunks match. Degrades to keyword-only scoring when dataset embeddings
 * are not available.
 */
async function searchMcp(options: SearchOptions, startTime: number): Promise<SearchResponse> {
  const { rawQuery, cleanQuery, queryTerms, type, sort, limit, offset } = normalizeOptions(options)

  const client = await getMcpClient()
  try {
    // Segment search first — the heart of intelligent search
    if (queryTerms.length > 0) {
      const segments = await searchSegmentsMcp(client, cleanQuery)
      if (segments.length > 0) {
        const matchedCourses = aggregateSegmentCourses(segments)
        return {
          query: rawQuery,
          engine: 'mcp',
          totalCount: segments.length,
          courseCount: matchedCourses.length,
          facets: {
            all: segments.length,
            video: segments.filter((s) => s.videoUrl).length,
            lesson: segments.length,
          },
          results: [],
          segments: segments.slice(offset, offset + limit),
          matchedCourses,
          executionTimeMs: Date.now() - startTime,
        }
      }
    }

    // Lesson-level search (also the empty-query path)
    let rawLessons: RawLesson[]
    let scoreBy: Map<string, number> | undefined

    if (queryTerms.length === 0) {
      rawLessons = (await executeGroqQuery(client, ALL_LESSONS_GROQ)) as RawLesson[]
    } else {
      try {
        rawLessons = (await executeGroqQuery(
          client,
          buildMcpSearchGroq(cleanQuery, true)
        )) as RawLesson[]
        scoreBy = new Map(rawLessons.map((l) => [l._id, l._score ?? 0]))
      } catch {
        // Semantic search requires dataset embeddings; retry keyword-only.
        rawLessons = (await executeGroqQuery(
          client,
          buildMcpSearchGroq(cleanQuery, false)
        )) as RawLesson[]
        scoreBy = new Map(rawLessons.map((l) => [l._id, l._score ?? 0]))
      }
    }

    const scoredLessons = buildScoredLessons(rawLessons, cleanQuery, queryTerms, scoreBy)
    return finalizeResults(scoredLessons, type, sort, limit, offset, rawQuery, 'mcp', startTime)
  } finally {
    await client.close().catch(() => {})
  }
}

function aggregateSegmentCourses(segments: SearchSegment[]): MatchedCourse[] {
  const courseMap = new Map<string, MatchedCourse>()
  for (const seg of segments) {
    if (!seg.courseSlug) continue
    const existing = courseMap.get(seg.courseSlug)
    if (existing) {
      existing.matchCount = (existing.matchCount || 0) + 1
    } else {
      courseMap.set(seg.courseSlug, {
        _id: `course.${seg.courseSlug}`,
        title: seg.courseTitle ?? seg.courseSlug,
        slug: seg.courseSlug,
        matchCount: 1,
      })
    }
  }
  return Array.from(courseMap.values())
}

/**
 * Searches Vertex learning platform courses and lessons in Sanity.
 *
 * Engine tiers (first available wins):
 * 1. `agent`  — Gemini tool loop over Sanity Context MCP: understands the
 *     plain-English query, queries timestamped `videoChunk` segments, and
 *     returns deep-linkable results. Requires GEMINI_API_KEY.
 * 2. `mcp`    — direct BM25 keyword scoring over video chunks via the
 *     Sanity Context MCP `groq_query` tool. No LLM involved.
 * 3. `local`  — in-process keyword search over lesson documents (fallback
 *     when the MCP endpoint is unreachable).
 */
export async function searchVertexContent(options: SearchOptions): Promise<SearchResponse> {
  const startTime = Date.now()
  const { queryTerms } = normalizeOptions(options)
  let failureNote: string | undefined

  // Agent tier: Gemini reasoning over the MCP connection layer
  if (options.useMcp !== false && process.env.GEMINI_API_KEY && queryTerms.length > 0) {
    try {
      const agentResponse = await searchViaAgent(options, startTime)
      if (agentResponse) return agentResponse
    } catch (error) {
      failureNote = describeSearchError(error)
    }
  }

  // MCP tier: direct chunk search (or lesson search when chunks unavailable)
  if (options.useMcp !== false) {
    try {
      const response = await searchMcp(options, startTime)
      if (failureNote) response.error = failureNote
      return response
    } catch (error) {
      failureNote = failureNote ?? describeSearchError(error)
    }
  }

  // Local tier: always available
  const response = await searchLocal(options, startTime)
  if (failureNote) response.error = failureNote
  return response
}

function describeSearchError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return `Intelligent search unavailable — used keyword search instead. ${message}`
}

/**
 * Agent tier implementation. Runs the Gemini tool loop, then falls back to a
 * direct segment query when the agent produced no usable segments.
 * Returns undefined when the agent result is empty (caller falls through).
 */
async function searchViaAgent(
  options: SearchOptions,
  startTime: number
): Promise<SearchResponse | undefined> {
  const { rawQuery, cleanQuery, queryTerms, limit } = normalizeOptions(options)
  const client = await getMcpClient()
  try {
    const fetchGroq = (groq: string) => executeGroqQuery(client, groq)
    const agent = await runAgentSearch(rawQuery, fetchGroq)
    let segments: SearchSegment[] = agent.segments.map((s) => ({
      chunkId: s.chunkId,
      text: s.text,
      start: s.start,
      end: s.end,
      chapter: s.chapter,
      lessonSlug: s.lessonSlug,
      lessonTitle: s.lessonTitle,
      freePreview: s.freePreview,
      videoUrl: s.videoUrl,
      courseTitle: s.courseTitle,
      courseSlug: s.courseSlug,
    }))

    // Agent found nothing usable — try a direct keyword pass over chunks
    if (segments.length === 0 && queryTerms.length > 0) {
      segments = await searchSegmentsMcp(client, cleanQuery)
    }
    if (segments.length === 0) {
      return undefined
    }

    segments = segments.slice(0, limit)
    const matchedCourses = aggregateSegmentCourses(segments)

    return {
      query: rawQuery,
      engine: 'agent',
      totalCount: segments.length,
      courseCount: matchedCourses.length,
      facets: {
        all: segments.length,
        video: segments.filter((s) => s.videoUrl).length,
        lesson: segments.length,
      },
      results: [],
      segments,
      answer: agent.summary,
      steps: agent.steps,
      matchedCourses,
      executionTimeMs: Date.now() - startTime,
    }
  } finally {
    await client.close().catch(() => {})
  }
}
