import { ElementAttributes } from '@editablejs/editor'
import { Editor } from '@editablejs/models'

export interface DocxSpanComponentProps {
  attributes: ElementAttributes
  children: any
}

export interface DocxHeaderOptions {
  placeholder?: string
}
const DOCX_OPTIONS = new WeakMap<Editor, DocxHeaderOptions>()

export const getOptions = (editor: Editor): DocxHeaderOptions => {
  return DOCX_OPTIONS.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: DocxHeaderOptions) => {
  DOCX_OPTIONS.set(editor, options)
}
