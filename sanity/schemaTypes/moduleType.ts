import { defineArrayMember, defineField, defineType } from 'sanity'
import { StackIcon } from '@sanity/icons'

export const moduleType = defineType({
  name: 'module',
  title: 'Module',
  type: 'document',
  icon: StackIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'course',
      title: 'Course',
      type: 'reference',
      to: [{ type: 'course' }],
      validation: (rule) => rule.required(),
      description: 'The course this module belongs to',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'number',
      description: 'Sort order of this module within the course (1, 2, 3…)',
      initialValue: 1,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
      description: 'Ordered lessons in this module',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      courseTitle: 'course.title',
      position: 'position',
      lessonCount: 'lessons.length',
    },
    prepare({ title, courseTitle, position, lessonCount }) {
      const subtitleParts = [
        typeof position === 'number' ? `#${position}` : null,
        courseTitle ?? null,
        typeof lessonCount === 'number'
          ? `${lessonCount} lesson${lessonCount === 1 ? '' : 's'}`
          : null,
      ].filter(Boolean)
      return { title, subtitle: subtitleParts.join(' · ') }
    },
  },
})
