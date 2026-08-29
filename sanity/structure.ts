import { BookIcon, StackIcon, PlayIcon, TagIcon, UserIcon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('course').title('Courses').icon(BookIcon),
      S.divider(),
      S.documentTypeListItem('module').title('Modules').icon(StackIcon),
      S.documentTypeListItem('lesson').title('Lessons').icon(PlayIcon),
      S.divider(),
      S.documentTypeListItem('category').title('Categories').icon(TagIcon),
      S.documentTypeListItem('instructor').title('Instructors').icon(UserIcon),
    ])
