import { createMCPClient, type CallToolResult, type MCPClient } from '@ai-sdk/mcp'

import { dataset, projectId } from '../env'

export type { MCPClient } from '@ai-sdk/mcp'

const DEFAULT_MCP_API_VERSION = 'v2026-03-03'
const INITIAL_CONTEXT_TTL_MS = 5 * 60 * 1000
const CONNECT_TIMEOUT_MS = 15_000
const TOOL_TIMEOUT_MS = 30_000

export class McpError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'McpError'
  }
}

/**
 * Resolves the Sanity Context MCP endpoint URL.
 *
 * Precedence:
 * 1. `SANITY_CONTEXT_MCP_URL` — full URL override (e.g. a document-based URL with a slug)
 * 2. Base URL derived from the project/dataset, optionally extended with
 *    `SANITY_CONTEXT_MCP_SLUG` (Sanity Context document slug) and
 *    `SANITY_CONTEXT_EMBEDDINGS` (forces the embeddings/semantic-search flag)
 */
export function getMcpUrl(): string | null {
  if (process.env.SANITY_CONTEXT_MCP_URL) {
    return process.env.SANITY_CONTEXT_MCP_URL
  }
  if (!projectId || !dataset) return null
  const apiVersion = process.env.SANITY_CONTEXT_MCP_API_VERSION || DEFAULT_MCP_API_VERSION
  const slug = process.env.SANITY_CONTEXT_MCP_SLUG || ''
  const url = new URL(
    `https://api.sanity.io/${apiVersion}/context/mcp/${projectId}/${dataset}${slug ? `/${slug}` : ''}`
  )
  const embeddings = process.env.SANITY_CONTEXT_EMBEDDINGS
  if (embeddings) url.searchParams.set('embeddings', embeddings)
  return url.toString()
}

export function isMcpConfigured(): boolean {
  return Boolean(getMcpUrl() && process.env.SANITY_API_READ_TOKEN)
}

/**
 * Creates a connected Sanity Context MCP client (HTTP transport, Bearer auth).
 * Throws McpError when unconfigured or when the endpoint cannot be reached
 * (e.g. no deployed Studio for this project/dataset).
 */
export async function getMcpClient(): Promise<MCPClient> {
  const url = getMcpUrl()
  const token = process.env.SANITY_API_READ_TOKEN
  if (!url || !token) {
    throw new McpError(
      'Sanity Context MCP is not configured: set SANITY_API_READ_TOKEN (optionally SANITY_CONTEXT_MCP_URL)'
    )
  }
  try {
    return await createMCPClient({
      transport: {
        type: 'http',
        url,
        headers: { Authorization: `Bearer ${token}` },
      },
      initializationOptions: { timeout: CONNECT_TIMEOUT_MS },
    })
  } catch (error) {
    throw new McpError(`Failed to connect to Sanity Context MCP: ${describeError(error)}`)
  }
}

let cachedInitialContext: string | null = null
let initialContextFetchedAt = 0

/**
 * Fetches the compressed schema context from the `/initial-context` endpoint.
 * Cached in-process for INITIAL_CONTEXT_TTL_MS. Returns null when the
 * endpoint is unavailable (never throws).
 */
export async function getInitialContext(): Promise<string | null> {
  const url = getMcpUrl()
  const token = process.env.SANITY_API_READ_TOKEN
  if (!url || !token) return null
  if (cachedInitialContext && Date.now() - initialContextFetchedAt < INITIAL_CONTEXT_TTL_MS) {
    return cachedInitialContext
  }
  const contextUrl = new URL(url)
  contextUrl.pathname = `${contextUrl.pathname.replace(/\/$/, '')}/initial-context`
  try {
    const res = await fetch(contextUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(CONNECT_TIMEOUT_MS),
    })
    if (!res.ok) return cachedInitialContext
    cachedInitialContext = await res.text()
    initialContextFetchedAt = Date.now()
    return cachedInitialContext
  } catch {
    return cachedInitialContext
  }
}

const QUERY_ARG_KEYS = ['query', 'groq', 'queryString', 'gql']
const PARAMS_ARG_KEYS = ['params', 'variables']

function buildToolArguments(
  properties: Record<string, unknown> | undefined,
  groq: string,
  params?: Record<string, unknown>
): Record<string, unknown> {
  const keys = properties ? Object.keys(properties) : []
  const queryKey = QUERY_ARG_KEYS.find((key) => keys.includes(key)) ?? 'query'
  const args: Record<string, unknown> = { [queryKey]: groq }
  if (params && Object.keys(params).length > 0) {
    const paramsKey = PARAMS_ARG_KEYS.find((key) => keys.includes(key))
    if (paramsKey) args[paramsKey] = params
  }
  return args
}

function extractDocuments(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    for (const key of ['result', 'data', 'documents', 'items']) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[]
    }
  }
  return []
}

function parseToolResult(result: CallToolResult): unknown[] {
  if ('toolResult' in result) {
    return extractDocuments(result.toolResult)
  }
  if (result.isError) {
    const text = result.content
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
    throw new McpError(text || 'Sanity Context MCP tool returned an error')
  }
  if (result.structuredContent !== undefined) {
    return extractDocuments(result.structuredContent)
  }
  const text = result.content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
  if (!text.trim()) return []
  try {
    return extractDocuments(JSON.parse(text))
  } catch {
    throw new McpError(`Could not parse Sanity Context MCP query result: ${text.slice(0, 200)}`)
  }
}/**
 * Executes a GROQ query through the Sanity Context MCP `groq_query` tool and
 * returns the resulting document array.
 */
export async function executeGroqQuery(
  client: MCPClient,
  groq: string,
  params?: Record<string, unknown>
): Promise<unknown[]> {
  const { tools } = await client.listTools()
  const tool =
    tools.find((t) => t.name === 'groq_query') ?? tools.find((t) => /groq|query/i.test(t.name))
  if (!tool) {
    throw new McpError(
      `groq_query tool not found on MCP endpoint (available tools: ${tools.map((t) => t.name).join(', ') || 'none'})`
    )
  }
  const result = await client.callTool({
    name: tool.name,
    arguments: buildToolArguments(tool.inputSchema?.properties, groq, params),
    options: { timeout: TOOL_TIMEOUT_MS },
  })
  return parseToolResult(result)
}

/**
 * Parses a raw `CallToolResult` into a document array. Exported so the
 * agentic search layer can reuse the same result-shaping for tool calls made
 * through the AI SDK tool loop (which returns the same raw MCP result).
 */
export function parseGroqToolResult(result: CallToolResult): unknown[] {
  return parseToolResult(result)
}

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}
