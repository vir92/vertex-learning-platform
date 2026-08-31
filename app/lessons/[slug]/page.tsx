import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLessonBySlug, getLessonSlugs } from "@/sanity/lib/api";
import { LessonDetail, type LessonDetailData } from "./LessonDetail";

export async function generateStaticParams() {
  const slugs = await getLessonSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const rawLesson = await getLessonBySlug(slug);
  const lesson = rawLesson as LessonDetailData | null;

  if (!lesson) {
    return {
      title: "Lesson Not Found — Vertex",
    };
  }

  const courseTitle = lesson.course?.title ? ` | ${lesson.course.title}` : "";
  return {
    title: `${lesson.title}${courseTitle} — Vertex`,
    description: `Watch ${lesson.title} on Vertex learning platform.`,
  };
}

export default async function LessonPage({
  params,
  searchParams,
}: PageProps<"/lessons/[slug]">) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Deep link from intelligent-search segment results: ?t=<start-seconds>
  const tParam = resolvedSearchParams.t;
  const tValue = Array.isArray(tParam) ? tParam[0] : tParam;
  const startAt = tValue ? Number.parseInt(tValue, 10) : 0;

  const rawLesson = await getLessonBySlug(slug);

  if (!rawLesson) notFound();

  return (
    <LessonDetail
      lesson={rawLesson as LessonDetailData}
      startAt={Number.isFinite(startAt) && startAt > 0 ? startAt : null}
    />
  );
}
