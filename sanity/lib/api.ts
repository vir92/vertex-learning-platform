import { stegaClean } from '@sanity/client/stega'
import {
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  COURSE_BY_SLUG_QUERY,
  COURSES_BY_CATEGORY_QUERY,
  COURSES_BY_INSTRUCTOR_QUERY,
  COURSES_QUERY,
  COURSE_SLUGS_QUERY,
  INSTRUCTORS_QUERY,
  INSTRUCTOR_BY_SLUG_QUERY,
  LESSON_BY_SLUG_QUERY,
  LESSON_SLUGS_QUERY,
} from './queries'
import { readClient } from './read-client'
import { sanityFetch } from './live'

/**
 * Server-side data layer for Vertex course content.
 *
 * - List/detail accessors for courses, modules, lessons, categories, instructors.
 * - `sanityFetch` (Live Content API) powers pages: realtime updates + draft preview.
 * - `readClient` powers static generation and non-HTTP contexts where
 *   fresh, uncached reads are required.
 */

export async function getCourses() {
  const { data } = await sanityFetch({ query: COURSES_QUERY, tags: ['course'] })
  return data
}

export async function getCourseBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
    tags: ['course', `course:${slug}`],
  })
  return data
}

export async function getCourseSlugs() {
  return readClient.fetch(COURSE_SLUGS_QUERY)
}

export async function getCoursesByInstructor(instructorId: string) {
  const { data } = await sanityFetch({
    query: COURSES_BY_INSTRUCTOR_QUERY,
    params: { instructorId },
    tags: ['course', 'instructor'],
  })
  return data
}

export async function getCoursesByCategory(categoryId: string) {
  const { data } = await sanityFetch({
    query: COURSES_BY_CATEGORY_QUERY,
    params: { categoryId },
    tags: ['course', 'category'],
  })
  return data
}

export async function getCategories() {
  const { data } = await sanityFetch({ query: CATEGORIES_QUERY, tags: ['category', 'course'] })
  return data
}

export async function getCategoryBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug },
    tags: ['category', 'course', `category:${slug}`],
  })
  return data
}

export async function getInstructors() {
  const { data } = await sanityFetch({ query: INSTRUCTORS_QUERY, tags: ['instructor', 'course'] })
  return data
}

export async function getInstructorBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: INSTRUCTOR_BY_SLUG_QUERY,
    params: { slug },
    tags: ['instructor', 'course', `instructor:${slug}`],
  })
  return data
}

export async function getLessonBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
    tags: ['lesson', `lesson:${slug}`],
  })
  return data
}

export async function getLessonSlugs() {
  return readClient.fetch(LESSON_SLUGS_QUERY)
}

/** Clean stega-encoded values before using them for logic or metadata. */
export function clean(value: string | undefined | null): string {
  return stegaClean(value ?? '')
}
