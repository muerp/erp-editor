import { ElementAttributes } from '@editablejs/editor'
import { Editor } from '@editablejs/models'

export interface DocxArticleComponentProps {
  attributes: ElementAttributes
  children: any
}

export interface DocxArticleOptions {
  
}
const DOCX_OPTIONS = new WeakMap<Editor, DocxArticleOptions>()

export const getOptions = (editor: Editor): DocxArticleOptions => {
  return DOCX_OPTIONS.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: DocxArticleOptions) => {
  DOCX_OPTIONS.set(editor, options)
}
