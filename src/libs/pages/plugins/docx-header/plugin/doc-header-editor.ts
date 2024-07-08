import { Editable } from '@editablejs/editor'
import { Editor, Range } from '@editablejs/models'
import { DocxHeader } from '../interfaces/docx-header'

export interface DocxHeaderEditor extends Editable {
  isHeader: boolean
}

export const DocxHeaderEditor = {
  isHeaderEditor: (editor: any): editor is DocxHeaderEditor => {
    return !!(editor as DocxHeaderEditor).isHeader
  },

  isDocxHeader: (value: any): value is DocxHeader => {
    return DocxHeader.isDocxHeader(value)
  },

  isFocused: (editor: Editor) => {
    const { selection } = editor
    if (!selection) return false
    const section = Editor.above(editor, {
      match: n => DocxHeader.isDocxHeader(n),
    })
    if (!section) return false
    const range = Editor.range(editor, section[1])
    return Range.includes(range, selection.anchor) && Range.includes(range, selection.focus)
  },
}
