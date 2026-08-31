import { NextRequest, NextResponse } from 'next/server'

import { searchVertexContent, type SearchOptions } from '@/sanity/lib/search'

export const dynamic = 'force-dynamic'

const VALID_TYPES = new Set(['all', 'video', 'lesson'])
const VALID_SORTS = new Set(['relevant', 'duration_asc', 'duration_desc', 'newest', 'alphabetical'])
const DEFAULT_LIMIT = 50
const MAX_LIMIT = 100

/**
 * GET /api/search
 *
 * Query parameters:
 * - q | query: search query string (e.g. "data fetching")
 * - type: "all" | "video" | "lesson" (default: "all")
 * - sort: "relevant" | "duration_asc" | "duration_desc" | "newest" | "alphabetical" (default: "relevant")
 * - limit: number 1..100 (default: 50)
 * - offset: number >= 0 (default: 0)
 * - mcp: "false" to disable the intelligent (Sanity Context MCP / agent) engines.
 *   Enabled by default; falls back to local keyword search automatically.
 */
export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams
  const query = source.get('q') ?? source.get('query') ?? ''

  const parsed = parseCommonParams({
    type: source.get('type') || 'all',
    sort: source.get('sort') || 'relevant',
    limit: source.get('limit'),
    offset: source.get('offset'),
    useMcp: source.get('mcp') !== 'false',
  })
  if (parsed.error) {
    return invalidRequest(query, parsed.error)
  }

  try {
    const results = await searchVertexContent({ query, ...parsed.options })
    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal search error'
    return searchError(query, message)
  }
}

/**
 * POST /api/search
 *
 * Body JSON:
 * {
 *   "query": "data fetching",
 *   "type": "all",
 *   "sort": "relevant",
 *   "limit": 50,
 *   "offset": 0,
 *   "useMcp": false
 * }
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return invalidRequest('', 'Request body must be a JSON object')
  }

  const query = typeof body.query === 'string' ? body.query : ''
  const parsed = parseCommonParams({
    type: (body.type as SearchOptions['type']) ?? 'all',
    sort: (body.sort as SearchOptions['sort']) ?? 'relevant',
    limit: typeof body.limit === 'number' ? String(body.limit) : undefined,
    offset: typeof body.offset === 'number' ? String(body.offset) : undefined,
    useMcp: body.useMcp !== false && body.mcp !== false,
  })
  if (parsed.error) {
    return invalidRequest(query, parsed.error)
  }

  try {
    const results = await searchVertexContent({ query, ...parsed.options })
    return NextResponse.json(results, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal search error'
    return searchError(query, message)
  }
}

interface ParseInput {
  type: string
  sort: string
  limit?: string | null
  offset?: string | null
  useMcp: boolean
}

type ParsedParams =
  | { options: Omit<SearchOptions, 'query'>; error?: undefined }
  | { options?: undefined; error: string }

function parseCommonParams(input: ParseInput): ParsedParams {
  const type = input.type
  if (!VALID_TYPES.has(type)) {
    return { error: `Invalid type "${input.type}". Expected one of: all, video, lesson.` }
  }

  const sort = input.sort
  if (!VALID_SORTS.has(sort)) {
    return {
      error: `Invalid sort "${input.sort}". Expected one of: relevant, duration_asc, duration_desc, newest, alphabetical.`,
    }
  }

  let limit = DEFAULT_LIMIT
  if (input.limit != null) {
    limit = Number.parseInt(input.limit, 10)
    if (Number.isNaN(limit) || limit < 1) {
      return { error: 'limit must be a positive integer.' }
    }
    limit = Math.min(limit, MAX_LIMIT)
  }

  let offset = 0
  if (input.offset != null) {
    offset = Number.parseInt(input.offset, 10)
    if (Number.isNaN(offset) || offset < 0) {
      return { error: 'offset must be a non-negative integer.' }
    }
  }

  return {
    options: {
      type: type as 'all' | 'video' | 'lesson',
      sort: sort as 'relevant' | 'duration_asc' | 'duration_desc' | 'newest' | 'alphabetical',
      limit,
      offset,
      useMcp: input.useMcp,
    },
  }
}

function emptyResults(query: string) {
  return {
    query,
    engine: 'local' as const,
    totalCount: 0,
    courseCount: 0,
    facets: { all: 0, video: 0, lesson: 0 },
    results: [],
    segments: [],
    matchedCourses: [],
    executionTimeMs: 0,
  }
}

function invalidRequest(query: string, message: string): NextResponse {
  return NextResponse.json({ ...emptyResults(query), error: message }, { status: 400 })
}

function searchError(query: string, message: string): NextResponse {
  return NextResponse.json({ ...emptyResults(query), error: message }, { status: 500 })
}
