import { Editable } from '@editablejs/editor'
import { Editor, Range } from '@editablejs/models'
import { DocxRun } from '../interfaces/docx-run'

export interface DocxRunEditor extends Editable {}

export const DocxRunEditor = {
  isSectionEditor: (value: any): value is DocxRunEditor => {
    return Editable.isEditor(value)
  },

  isDocxRun: (value: any): value is DocxRun => {
    return DocxRun.isDocxRun(value)
  },

  isFocused: (editor: Editor) => {
    const { selection } = editor
    if (!selection) return false
    const section = Editor.above(editor, {
      match: n => DocxRun.isDocxRun(n),
    })
    if (!section) return false
    const range = Editor.range(editor, section[1])
    return Range.includes(range, selection.anchor) && Range.includes(range, selection.focus)
  },
}
