import { notFound } from "next/navigation";
import { getCourseBySlug, getCourseSlugs } from "@/sanity/lib/api";
import { CourseDetail, type CourseDetailData } from "./CourseDetail";

export async function generateStaticParams() {
  const slugs = await getCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  return <CourseDetail course={course as CourseDetailData} />;
}
