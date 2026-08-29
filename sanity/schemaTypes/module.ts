import { defineArrayMember, defineField, defineType } from 'sanity'
import { StackIcon } from '@sanity/icons'

export const moduleType = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  icon: StackIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
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
      lessons: 'lessons',
    },
    prepare({ title, lessons }) {
      const lessonCount = Array.isArray(lessons) ? lessons.length : 0
      return {
        title,
        subtitle:
          lessonCount > 0 ? `${lessonCount} lesson${lessonCount === 1 ? '' : 's'}` : 'No lessons yet',
      }
    },
  },
})
