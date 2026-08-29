import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Short one-line summary shown on course cards',
      validation: (rule) => rule.max(140).warning('Keep the subtitle to a single line'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              if (!alt && (context.document as { coverImage?: { asset?: unknown } })?.coverImage?.asset) {
                return 'Alternative text is required when a cover image is set'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instructors',
      title: 'Instructors',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'instructor' }],
        }),
      ],
      validation: (rule) => rule.required().min(1).error('Add at least one instructor'),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio',
      },
      initialValue: 'beginner',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'estimatedDurationMinutes',
      title: 'Estimated duration (minutes)',
      type: 'number',
      description: 'Total watch time across all lessons',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'highlight',
          title: 'Highlight',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: {
            select: { title: 'label' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'coverImage',
      difficulty: 'difficulty',
      status: 'status',
    },
    prepare({ title, subtitle, media, difficulty, status }) {
      const parts = [difficulty ?? '—', status ?? '—'].join(' · ')
      return { title, subtitle: subtitle ? `${subtitle} (${parts})` : parts, media }
    },
  },
})
