import { ElementAttributes } from '@editablejs/editor'
import { Editor } from '@editablejs/models'

export interface SectionComponentProps {
  attributes: ElementAttributes
  children: any
}

export interface SectionOptions {
  
}
const DOCX_OPTIONS = new WeakMap<Editor, SectionOptions>()

export const getOptions = (editor: Editor): SectionOptions => {
  return DOCX_OPTIONS.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: SectionOptions) => {
  DOCX_OPTIONS.set(editor, options)
}
