import { defineField, defineType } from 'sanity'
import { TargetIcon } from '@sanity/icons'

export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning outcome',
  type: 'object',
  icon: TargetIcon,
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon key used by the Vertex design system (e.g. layers, workflow, gauge, rocket)',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      icon: 'icon',
    },
  },
})
