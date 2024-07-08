import { Editable } from '@editablejs/editor'
import { Editor, Range } from '@editablejs/models'
import { Section } from '../interfaces/section'

export interface SectionEditor extends Editable {}

export const SectionEditor = {
  isSectionEditor: (value: any): value is SectionEditor => {
    return Editable.isEditor(value)
  },

  isSection: (value: any): value is Section => {
    return Section.isSection(value)
  },

  isFocused: (editor: Editor) => {
    const { selection } = editor
    if (!selection) return false
    const section = Editor.above(editor, {
      match: n => Section.isSection(n),
    })
    if (!section) return false
    const range = Editor.range(editor, section[1])
    return Range.includes(range, selection.anchor) && Range.includes(range, selection.focus)
  },
}
