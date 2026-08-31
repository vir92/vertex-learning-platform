import { type SchemaTypeDefinition } from 'sanity'

import { category } from './category'
import { course } from './course'
import { instructor } from './instructor'
import { learningOutcome } from './learningOutcome'
import { lesson } from './lesson'
import { moduleType } from './module'
import { resource } from './resource'
import { videoChunk } from './videoChunk'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [course, moduleType, lesson, videoChunk, learningOutcome, resource, category, instructor],
}
