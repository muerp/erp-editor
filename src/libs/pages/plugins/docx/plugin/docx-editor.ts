import { Editable } from '@editablejs/editor'
import { Editor, Range } from '@editablejs/models'
import { Docx } from '../interfaces/docx'

export interface DocxEditor extends Editable {}

export const DocxEditor = {
  isDocxEditor: (value: any): value is DocxEditor => {
    return Editable.isEditor(value)
  },

  isDocx: (value: any): value is Docx => {
    return Docx.isDocx(value)
  },

  isFocused: (editor: Editor) => {
    const { selection } = editor
    if (!selection) return false
    const docx = Editor.above(editor, {
      match: n => Docx.isDocx(n),
    })
    if (!docx) return false
    const range = Editor.range(editor, docx[1])
    return Range.includes(range, selection.anchor) && Range.includes(range, selection.focus)
  },
}
