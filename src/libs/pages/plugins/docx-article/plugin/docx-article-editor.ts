import { Editable } from '@editablejs/editor'
import { Editor, Range } from '@editablejs/models'
import { DocxArticle } from '../interfaces/docx-article'

export interface DocxArticleEditor extends Editable {}

export const DocxArticleEditor = {
  isArticleEditor: (value: any): value is DocxArticleEditor => {
    return Editable.isEditor(value)
  },

  isDocxArticle: (value: any): value is DocxArticle => {
    return DocxArticle.isDocxArticle(value)
  },

  isFocused: (editor: Editor) => {
    const { selection } = editor
    if (!selection) return false
    const section = Editor.above(editor, {
      match: n => DocxArticle.isDocxArticle(n),
    })
    if (!section) return false
    const range = Editor.range(editor, section[1])
    return Range.includes(range, selection.anchor) && Range.includes(range, selection.focus)
  },
}
