import { type SchemaTypeDefinition } from 'sanity'

import { category } from './category'
import { course } from './course'
import { instructor } from './instructor'
import { learningOutcome } from './learningOutcome'
import { lesson } from './lesson'
import { moduleType } from './module'
import { resource } from './resource'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [course, moduleType, lesson, learningOutcome, resource, category, instructor],
}
