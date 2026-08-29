import { type SchemaTypeDefinition } from 'sanity'

import { category } from './category'
import { course } from './course'
import { instructor } from './instructor'
import { lesson } from './lesson'
import { moduleType as module } from './moduleType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [course, module, lesson, category, instructor],
}
