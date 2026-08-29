import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const LESSON_TYPES = ['video', 'text', 'quiz'] as const

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
      name: 'lessonType',
      title: 'Lesson type',
      type: 'string',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Text', value: 'text' },
          { title: 'Quiz', value: 'quiz' },
        ],
        layout: 'radio',
      },
      initialValue: 'video',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Duration (minutes)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in lesson lists',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Rich lesson content, shown for text and quiz lessons',
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
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Embed URL (YouTube, Vimeo, or Mux playback). Do not upload raw video files.',
      hidden: ({ parent }) => parent?.lessonType !== 'video',
      validation: (rule) =>
        rule
          .uri({ scheme: ['http', 'https'] })
          .custom((url, context) => {
            const lessonType = (context.document as { lessonType?: string } | undefined)?.lessonType
            if (lessonType === 'video' && !url) {
              return 'Video lessons require a video URL'
            }
            return true
          }),
    }),
    defineField({
      name: 'questions',
      title: 'Quiz questions',
      type: 'array',
      hidden: ({ parent }) => parent?.lessonType !== 'quiz',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'question',
          title: 'Question',
          fields: [
            defineField({
              name: 'prompt',
              title: 'Prompt',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'options',
              title: 'Answer options',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'answerOption',
                  title: 'Answer option',
                  fields: [
                    defineField({ name: 'text', title: 'Text', type: 'string' }),
                    defineField({
                      name: 'correct',
                      title: 'Correct answer',
                      type: 'boolean',
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'text',
                      correct: 'correct',
                    },
                    prepare({ title, correct }: { title?: string; correct?: boolean }) {
                      return { title: correct ? `✓ ${title ?? ''}` : title ?? '' }
                    },
                  },
                }),
              ],
              validation: (rule) => rule.min(2).error('Provide at least two answer options'),
            }),
            defineField({
              name: 'explanation',
              title: 'Explanation',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'prompt',
              optionCount: 'options.length',
            },
            prepare({ title, optionCount }: { title?: string; optionCount?: number }) {
              return { title, subtitle: `${optionCount ?? 0} options` }
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((questions, context) => {
          const lessonType = (context.document as { lessonType?: string } | undefined)?.lessonType
          if (lessonType === 'quiz' && (!questions || questions.length === 0)) {
            return 'Quiz lessons need at least one question'
          }
          return true
        }),
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      description: 'Supplementary downloads and links',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'resource',
          title: 'Resource',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({
              name: 'resourceType',
              title: 'Type',
              type: 'string',
              options: {
                list: ['link', 'file'],
                layout: 'radio',
              },
              initialValue: 'link',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              hidden: ({ parent }) => parent?.resourceType !== 'link',
              validation: (rule) =>
                rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid http(s) URL'),
            }),
            defineField({
              name: 'file',
              title: 'File',
              type: 'file',
              hidden: ({ parent }) => parent?.resourceType !== 'file',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'resourceType',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lessonType: 'lessonType',
      durationMinutes: 'durationMinutes',
      media: 'content.0.asset',
    },
    prepare({ title, lessonType, durationMinutes }) {
      const parts = [lessonType ?? 'lesson']
      if (typeof durationMinutes === 'number') {
        parts.push(`${durationMinutes} min`)
      }
      return { title, subtitle: parts.join(' · ') }
    },
  },
})
