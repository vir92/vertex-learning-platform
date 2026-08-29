import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(280).warning('Keep descriptions under 280 characters'),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon key used by the Vertex design system to represent this category',
      options: {
        list: [
          { title: 'Next.js', value: 'nextjs' },
          { title: 'Docker', value: 'docker' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'React', value: 'react' },
          { title: 'Node.js', value: 'nodejs' },
          { title: 'Database', value: 'database' },
          { title: 'DevOps', value: 'devops' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
