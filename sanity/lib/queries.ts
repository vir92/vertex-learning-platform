import { defineQuery } from 'groq'

/* ------------------------------------------------------------------ */
/* Shared projections                                                  */
/* ------------------------------------------------------------------ */

const INSTRUCTOR_PROJECTION = `
  _id,
  name,
  "slug": slug.current,
  title,
  "photoUrl": photo.asset->url
`

const COURSE_CARD_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  subtitle,
  difficulty,
  "coverImageUrl": coverImage.asset->url,
  "category": category->{ _id, title, "slug": slug.current, icon },
  "instructors": instructors[]->{ ${INSTRUCTOR_PROJECTION} },
  "estimatedDurationMinutes": estimatedDurationMinutes,
  "highlights": highlights[] { _key, label }
`

const LESSON_CARD_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  lessonType,
  durationMinutes,
  summary
`

const MODULE_PROJECTION = `
  _id,
  title,
  description,
  position,
  "lessons": lessons[]->{ ${LESSON_CARD_PROJECTION} }
`

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */

export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && status == "published" && defined(slug.current)]
  | order(title asc) {
    ${COURSE_CARD_PROJECTION},
    "moduleCount": count(*[_type == "module" && course._ref == ^._id])
  }
`)

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug && status == "published"][0] {
    ${COURSE_CARD_PROJECTION},
    description,
    "modules": *[_type == "module" && course._ref == ^._id] | order(position asc) {
      ${MODULE_PROJECTION}
    }
  }
`)

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && status == "published" && defined(slug.current)].slug.current
`)

export const COURSES_BY_INSTRUCTOR_QUERY = defineQuery(`
  *[_type == "course" && status == "published" && defined(slug.current) && $instructorId in instructors[]._ref]
  | order(title asc) {
    ${COURSE_CARD_PROJECTION}
  }
`)

export const COURSES_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "course" && status == "published" && defined(slug.current) && category._ref == $categoryId]
  | order(title asc) {
    ${COURSE_CARD_PROJECTION}
  }
`)

/* ------------------------------------------------------------------ */
/* Categories & instructors                                           */
/* ------------------------------------------------------------------ */

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    "courseCount": count(
      *[_type == "course" && status == "published" && references(^._id)]
    )
  }
`)

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    "courses": *[_type == "course" && status == "published" && references(^._id)] | order(title asc) {
      ${COURSE_CARD_PROJECTION}
    }
  }
`)

export const INSTRUCTORS_QUERY = defineQuery(`
  *[_type == "instructor"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    title,
    bio,
    "photoUrl": photo.asset->url,
    "socialLinks": socialLinks[] { _key, platform, url },
    "courseCount": count(
      *[_type == "course" && status == "published" && references(^._id)]
    )
  }
`)

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    title,
    bio,
    "photoUrl": photo.asset->url,
    "socialLinks": socialLinks[] { _key, platform, url },
    "courses": *[_type == "course" && status == "published" && references(^._id)] | order(title asc) {
      ${COURSE_CARD_PROJECTION}
    }
  }
`)

/* ------------------------------------------------------------------ */
/* Modules & lessons                                                   */
/* ------------------------------------------------------------------ */

export const MODULES_BY_COURSE_QUERY = defineQuery(`
  *[_type == "module" && course._ref == $courseId] | order(position asc) {
    ${MODULE_PROJECTION}
  }
`)

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    lessonType,
    durationMinutes,
    summary,
    videoUrl,
    "content": content[] {
      _type == "image" => {
        _type,
        _key,
        "url": asset->url,
        alt,
        caption
      },
      _type != "image" => @
    },
    "questions": questions[] {
      _key,
      prompt,
      "options": options[] { _key, text, correct },
      explanation
    },
    "resources": resources[] { _key, label, resourceType, url, "fileUrl": file.asset->url },
    "module": *[_type == "module" && references(^._id)][0] {
      _id,
      title,
      position,
      "course": course->{ _id, title, "slug": slug.current }
    }
  }
`)

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)].slug.current
`)
