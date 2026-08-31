import type { Metadata } from "next";
import Link from "next/link";

import { formatDuration } from "@/app/lib/format";
import {
  searchVertexContent,
  type SearchResponse,
  type SearchSegment,
  type SearchResultItem,
} from "@/sanity/lib/search";

export const dynamic = "force-dynamic";

const VALID_TYPES = new Set(["all", "video", "lesson"]);
const VALID_SORTS = new Set([
  "relevant",
  "duration_asc",
  "duration_desc",
  "newest",
  "alphabetical",
]);

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

async function runSearch(
  searchParams: Promise<Record<string, string | string[] | undefined>>
): Promise<{ query: string; response: SearchResponse }> {
  const params = await searchParams;
  const query = firstParam(params.q ?? params.query).trim();
  const type = firstParam(params.type) || "all";
  const sort = firstParam(params.sort) || "relevant";
  const limit = Number.parseInt(firstParam(params.limit), 10);
  const offset = Number.parseInt(firstParam(params.offset), 10);
  const useMcp = firstParam(params.mcp) !== "false";

  const response = await searchVertexContent({
    query,
    type: VALID_TYPES.has(type) ? (type as "all" | "video" | "lesson") : "all",
    sort: VALID_SORTS.has(sort)
      ? (sort as "relevant" | "duration_asc" | "duration_desc" | "newest" | "alphabetical")
      : "relevant",
    limit: Number.isFinite(limit) && limit > 0 ? limit : 50,
    offset: Number.isFinite(offset) && offset >= 0 ? offset : 0,
    useMcp,
  });

  return { query, response };
}

export async function generateMetadata(props: PageProps<"/search">): Promise<Metadata> {
  const params = await props.searchParams;
  const query = firstParam(params.q ?? params.query).trim();
  return {
    title: query ? `Search: ${query} — Vertex` : "Search — Vertex",
    description:
      "Search courses, videos, and lessons on the Vertex learning platform.",
  };
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default async function SearchPage(props: PageProps<"/search">) {
  const { query, response } = await runSearch(props.searchParams);

  const videos = response.results.filter((item) => item.type === "video");
  const lessons = response.results.filter((item) => item.type === "lesson");
  const engineLabel =
    response.engine === "agent"
      ? `AI search (Gemini + Sanity Context MCP) · ${response.steps ?? "?"} steps`
      : response.engine === "mcp"
        ? "semantic search (Sanity Context MCP)"
        : "keyword (local)";

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        fontFamily: "var(--font-body, sans-serif)",
        color: "var(--color-neutral-900, #0F172A)",
      }}
    >
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
        {query ? `Search results for “${query}”` : "Search"}
      </h1>

      <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>
        {query
          ? `${response.totalCount} result${response.totalCount === 1 ? "" : "s"} · engine: ${engineLabel} · ${response.executionTimeMs}ms`
          : "Pass a query with ?q= to search courses, videos, and lessons."}
      </p>

      {response.error && (
        <p
          style={{
            color: "#92400E",
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
          }}
        >
          {response.error}
        </p>
      )}

      {!query && (
        <p style={{ color: "#64748B" }}>
          Example: <code>/search?q=how%20do%20layouts%20work</code>
        </p>
      )}

      {/* AI-generated answer summary */}
      {response.answer && (
        <p
          style={{
            background: "#F0F9FF",
            border: "1px solid #BAE6FD",
            borderRadius: "8px",
            padding: "0.9rem 1rem",
            marginBottom: "1.5rem",
          }}
        >
          {response.answer}
        </p>
      )}

      {/* Timestamped video segments (intelligent search) */}
      {query && response.segments && response.segments.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            Video segments ({response.segments.length})
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {response.segments.map((segment) => (
              <SegmentItem key={segment.chunkId} segment={segment} />
            ))}
          </ul>
        </section>
      )}

      {query && response.matchedCourses.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Matched courses</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {response.matchedCourses.map((course) => (
              <li
                key={course._id}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <Link href={`/courses/${course.slug}`} style={{ fontWeight: 600 }}>
                  {course.title}
                </Link>
                <span style={{ color: "#64748B" }}>
                  {course.category?.title ? ` · ${course.category.title}` : ""}
                  {course.level ? ` · ${course.level}` : ""} ·{" "}
                  {course.matchCount} matching segment{course.matchCount === 1 ? "" : "s"}
                  {typeof course.lessonCount === "number"
                    ? ` across ${course.lessonCount} lessons`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {query && videos.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            Video results ({videos.length})
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {videos.map((item) => (
              <ResultItem key={item._id} item={item} />
            ))}
          </ul>
        </section>
      )}

      {query && lessons.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            Lesson results ({lessons.length})
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {lessons.map((item) => (
              <ResultItem key={item._id} item={item} />
            ))}
          </ul>
        </section>
      )}

      {query &&
        response.totalCount === 0 &&
        !(response.segments && response.segments.length > 0) && (
          <p style={{ color: "#64748B" }}>
            No results for “{query}”. Try a different query or fewer keywords.
          </p>
        )}
    </main>
  );
}

function SegmentItem({ segment }: { segment: SearchSegment }) {
  const deepLink = segment.lessonSlug
    ? `/lessons/${segment.lessonSlug}?t=${Math.floor(segment.start)}`
    : "#";

  return (
    <li style={{ padding: "0.85rem 0", borderBottom: "1px solid #E2E8F0" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
        <Link href={deepLink} style={{ fontWeight: 600, flexShrink: 0 }}>
          {formatTimestamp(segment.start)}
        </Link>
        <div>
          {segment.lessonTitle && (
            <Link href={deepLink} style={{ fontWeight: 600 }}>
              {segment.lessonTitle}
            </Link>
          )}
          {segment.courseTitle && (
            <span style={{ color: "#64748B", fontSize: "0.875rem" }}>
              {" "}
              · {segment.courseTitle}
              {segment.chapter ? ` · ${segment.chapter}` : ""}
              {segment.freePreview ? " · Free preview" : ""}
            </span>
          )}
        </div>
      </div>
      <p style={{ color: "#475569", fontSize: "0.875rem", margin: "0.35rem 0 0" }}>
        {segment.text.slice(0, 240)}
        {segment.text.length > 240 ? "…" : ""}
      </p>
    </li>
  );
}

function ResultItem({ item }: { item: SearchResultItem }) {
  const meta = [
    item.formattedDuration ? formatDuration(item.duration) : undefined,
    item.course?.title,
    item.lessonNumber,
    item.freePreview ? "Free preview" : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li style={{ padding: "0.75rem 0", borderBottom: "1px solid #E2E8F0" }}>
      <Link href={`/lessons/${item.slug}`} style={{ fontWeight: 600 }}>
        {item.title}
      </Link>
      {meta && <div style={{ color: "#64748B", fontSize: "0.875rem" }}>{meta}</div>}
      {item.description && (
        <p style={{ color: "#475569", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
          {item.description}
        </p>
      )}
    </li>
  );
}
