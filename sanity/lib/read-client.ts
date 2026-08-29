import { client } from './client'

/**
 * Server-side read client for non-Live data access: server actions,
 * route handlers, background jobs, and generateStaticParams where
 * fresh, uncached reads are required.
 *
 * - `useCdn: false` guarantees fresh reads (no CDN delay)
 * - optional token enables draft/preview reads when SANITY_API_READ_TOKEN is set
 */
export const readClient = client.withConfig({
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
})

export { readClient as serverClient }
