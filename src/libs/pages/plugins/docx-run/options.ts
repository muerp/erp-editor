import { ElementAttributes } from '@editablejs/editor'
import { Editor } from '@editablejs/models'

export interface DocxSpanComponentProps {
  attributes: ElementAttributes
  children: any
}

export interface DocxRunOptions {
  
}
const DOCX_OPTIONS = new WeakMap<Editor, DocxRunOptions>()

export const getOptions = (editor: Editor): DocxRunOptions => {
  return DOCX_OPTIONS.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: DocxRunOptions) => {
  DOCX_OPTIONS.set(editor, options)
}
