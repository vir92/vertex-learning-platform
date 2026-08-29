import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
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
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Embed URL (YouTube, Vimeo, or Mux playback). Do not upload raw video files.',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid http(s) URL'),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              if (!alt && (context.document as { thumbnail?: { asset?: unknown } })?.thumbnail?.asset) {
                return 'Alternative text is required when a thumbnail is set'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free preview',
      type: 'boolean',
      description: 'Whether this lesson can be watched without purchasing the course',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student count',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      description: 'Lesson notes written as rich text',
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
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key points',
      type: 'array',
      description: 'Short takeaways from this lesson',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro tip',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      description: 'Supplementary links for this lesson',
      of: [
        defineArrayMember({
          type: 'resource',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      freePreview: 'freePreview',
      media: 'thumbnail',
    },
    prepare({ title, duration, freePreview, media }) {
      const parts = []
      if (typeof duration === 'number') {
        const minutes = Math.round(duration / 60)
        parts.push(`${minutes} min`)
      }
      if (freePreview) {
        parts.push('Free preview')
      }
      return { title, subtitle: parts.join(' · '), media }
    },
  },
})
