import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText, stepCountIs, tool as defineTool, type ToolSet } from 'ai'
import { z } from 'zod'

import { dataset, projectId } from '../env'
import { getInitialContext, getMcpUrl } from './mcp'

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const MAX_STEPS = 6

export interface AgentSegment {
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
  score?: number
}

export interface AgentSearchResult {
  segments: AgentSegment[]
  summary?: string
  steps: number
  finishReason: string
}

const GROQ_TOOLS_SCHEMA = z.object({
  query: z.string().describe('GROQ query to execute against the Sanity dataset'),
})

/**
 * Agentic intelligent search: a Gemini model reasons over the Vertex content
 * model via the Sanity Context MCP `groq_query` tool and maps the user's
 * plain-English question to specific, timestamped video segments.
 */
export async function runAgentSearch(
  query: string,
  fetchImpl: (groq: string) => Promise<unknown[]>
): Promise<AgentSearchResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set — agentic search unavailable')
  }

  const google = createGoogleGenerativeAI({ apiKey })
  const initialContext = await getInitialContext()

  const mcpUrl = getMcpUrl()
  const baseProjectInfo = `Project: ${projectId}, dataset: ${dataset}. Sanity Context MCP endpoint: ${mcpUrl}`

  const systemPrompt = `You are the intelligent search agent for Vertex, a software-engineering learning platform. A learner asks a question in plain English. Your job: find the exact moments in course videos where that topic is taught, by querying Sanity through the groq_query tool.

${initialContext ? `# Dataset reference\n\n${initialContext}\n` : `# Project\n\n${baseProjectInfo}`}

# Content model essentials
- \`course\`: title, summary, level, modules[] (each with title and ordered lesson references)
- \`lesson\`: title, videoUrl (YouTube), duration (seconds), freePreview, notes, keyPoints
- \`videoChunk\`: the transcript of a lesson video, pre-split into ~45-second timestamped segments. Fields: \`lesson\` (reference), \`videoId\`, \`chunkIndex\`, \`start\` (seconds — use this for deep links), \`end\`, \`text\` (verbatim transcript), \`chapter\` (optional YouTube chapter title)

# How to search
1. Query videoChunk documents matching the user's question. Use GROQ text match on the chunk \`text\` field, e.g.:
   \`*[_type == "videoChunk" && text match "react server components"]\`
   For multi-word topics, use \`text match text::query("<topic>")\` for BM25 ranking, optionally inside \`| score(...)\` with \`| order(_score desc)\`.
2. Always project the fields you need, hydrate the parent lesson, and (when useful) the course:
   \`{ _id, chunkIndex, start, end, text, chapter, "lessonSlug": lesson->slug.current, "lessonTitle": lesson->title, "freePreview": lesson->freePreview, "videoUrl": lesson->videoUrl, "course": *[_type == "course" && references(^.lesson->_id)][0]{ "title": title, "slug": slug.current } }\`
3. If the first query returns nothing (wrong vocabulary — e.g. "use client" vs "client components"), reformulate with synonyms and try again. Max ${MAX_STEPS} tool calls.
4. Return 3-8 segments ordered by relevance (lesson relevance first, then earliest timestamp).

# Output
After your final tool call, respond with ONLY a JSON object (no markdown fences, no prose):
{"segments": [{"chunkId": "<videoChunk _id>", "start": <number>, "end": <number>, "text": "<chunk text>", "chapter": "<optional>", "lessonSlug": "<slug>", "lessonTitle": "<title>", "freePreview": <bool>, "videoUrl": "<url>", "courseTitle": "<title>", "courseSlug": "<slug>"}], "summary": "<one sentence: what the results teach>"}`

  const tools: ToolSet = {
    groq_query: defineTool({
      description:
        'Execute a GROQ query against the Vertex Sanity dataset (courses, lessons, videoChunks).',
      inputSchema: GROQ_TOOLS_SCHEMA,
      execute: async ({ query: groq }) => {
        const docs = await fetchImpl(groq)
        return { result: docs }
      },
    }),
  }

  const { text, steps, finishReason } = await generateText({
    model: google(DEFAULT_MODEL),
    system: systemPrompt,
    prompt: `Learner question: ${query}`,
    tools,
    stopWhen: stepCountIs(MAX_STEPS),
  })

  const parsed = parseAgentOutput(text)
  return { ...parsed, steps: steps.length, finishReason }
}

function parseAgentOutput(text: string): Pick<AgentSearchResult, 'segments' | 'summary'> {
  // The model may wrap JSON in markdown fences despite instructions.
  const cleaned = text.replace(/```(?:json)?/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try {
      const obj = JSON.parse(cleaned.slice(start, end + 1)) as {
        segments?: unknown[]
        summary?: string
      }
      return {
        segments: (obj.segments || []).filter(isSegment).map(normalizeSegment),
        summary: typeof obj.summary === 'string' ? obj.summary : undefined,
      }
    } catch {
      // fall through
    }
  }
  return { segments: [], summary: text.slice(0, 200) }
}

function isSegment(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object')
}

function normalizeSegment(value: Record<string, unknown>): AgentSegment {
  const course = value.course as { title?: string; slug?: string } | undefined
  return {
    chunkId: String(value.chunkId ?? value._id ?? ''),
    text: String(value.text ?? ''),
    start: toNumber(value.start),
    end: toNumber(value.end),
    chapter: typeof value.chapter === 'string' ? value.chapter : undefined,
    lessonSlug: str(value.lessonSlug),
    lessonTitle: str(value.lessonTitle),
    freePreview: value.freePreview === true,
    videoUrl: str(value.videoUrl),
    courseTitle: course?.title ?? str(value.courseTitle),
    courseSlug: course?.slug ?? str(value.courseSlug),
    score: toNumber(value.score ?? value._score),
  }
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function toNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}
