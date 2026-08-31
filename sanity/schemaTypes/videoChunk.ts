import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const videoChunk = defineType({
  name: 'videoChunk',
  title: 'Video chunk',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'lesson',
      title: 'Lesson',
      type: 'reference',
      to: [{ type: 'lesson' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'YouTube video ID this chunk was ingested from',
    }),
    defineField({
      name: 'chunkIndex',
      title: 'Chunk index',
      type: 'number',
      description: 'Zero-based position of this chunk within the lesson video',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'start',
      title: 'Start time (seconds)',
      type: 'number',
      description: 'Where this chunk begins in the video — used for deep links (?t=)',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'end',
      title: 'End time (seconds)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'text',
      title: 'Transcript text',
      type: 'text',
      description: 'Verbatim transcript of this segment',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chapter',
      title: 'Chapter',
      type: 'string',
      description: 'Nearest enclosing YouTube chapter title, if any',
    }),
  ],
  preview: {
    select: {
      lessonTitle: 'lesson->title',
      chunkIndex: 'chunkIndex',
      start: 'start',
      end: 'end',
      text: 'text',
    },
    prepare({ lessonTitle, chunkIndex, start, end, text }) {
      const seconds = (value: unknown) =>
        typeof value === 'number' ? `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}` : '?'
      return {
        title: (text as string | undefined)?.slice(0, 60) ?? 'Empty chunk',
        subtitle: `${lessonTitle ?? 'No lesson'} · #${chunkIndex ?? '?'} · ${seconds(start)}–${seconds(end)}`,
        media: undefined,
      }
    },
  },
})
