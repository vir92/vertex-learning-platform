import { defineArrayMember, defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const instructor = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Job title',
      type: 'string',
      description: 'e.g. "Full-Stack Engineer & Educator"',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'array',
      description: 'Areas of expertise, e.g. "React", "Web performance"',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              if (!alt && (context.document as { photo?: { asset?: unknown } })?.photo?.asset) {
                return 'Alternative text is required when a photo is set'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineField({
          name: 'socialLink',
          title: 'Social link',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['website', 'github', 'x', 'linkedin', 'youtube'],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid http(s) URL'),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'photo',
    },
  },
})
