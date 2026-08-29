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
  summary,
  level,
  "coverImageUrl": coverImage.asset->url,
  "category": category->{ _id, title, "slug": slug.current },
  "instructor": instructor->{ ${INSTRUCTOR_PROJECTION} },
  price,
  popular,
  studentCount,
  "lessonCount": count(modules[].lessons[]),
  "moduleCount": count(modules),
  "totalDuration": math::sum(modules[].lessons[]->duration)
`

const LESSON_CARD_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  duration,
  freePreview
`

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */

export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)]
  | order(title asc) {
    ${COURSE_CARD_PROJECTION}
  }
`)

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    ${COURSE_CARD_PROJECTION},
    "learningOutcomes": learningOutcomes[] { _key, icon, title, description },
    "modules": modules[] { _key, title, summary, "lessons": lessons[]->{ ${LESSON_CARD_PROJECTION} } }
  }
`)

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)].slug.current
`)

export const COURSES_BY_INSTRUCTOR_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current) && instructor._ref == $instructorId]
  | order(title asc) {
    ${COURSE_CARD_PROJECTION}
  }
`)

export const COURSES_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current) && category._ref == $categoryId]
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
      *[_type == "course" && references(^._id)]
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
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
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
    expertise,
    "socialLinks": socialLinks[] { _key, platform, url },
    "courseCount": count(
      *[_type == "course" && references(^._id)]
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
    expertise,
    "socialLinks": socialLinks[] { _key, platform, url },
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      ${COURSE_CARD_PROJECTION}
    }
  }
`)

/* ------------------------------------------------------------------ */
/* Lessons                                                             */
/* ------------------------------------------------------------------ */

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    "thumbnailUrl": thumbnail.asset->url,
    duration,
    freePreview,
    studentCount,
    "notes": notes[] {
      _type == "image" => {
        _type,
        _key,
        "url": asset->url,
        alt,
        caption
      },
      _type != "image" => @
    },
    keyPoints,
    proTip,
    "resources": resources[] { _key, type, title, description, url },
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      "slug": slug.current,
      "module": modules[$slug in lessons[]->slug.current] { title, _key } [0]
    }
  }
`)

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)].slug.current
`)
