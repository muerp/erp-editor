import { ElementAttributes } from '@editablejs/editor'
import { Editor } from '@editablejs/models'
import React from 'react'

export interface DocxComponentProps {
  attributes: ElementAttributes
  children: any
}

export interface DocxOptions {
  placeholder?: React.ReactNode
  component?: React.FC<DocxComponentProps>
}
const DOCX_OPTIONS = new WeakMap<Editor, DocxOptions>()

export const getOptions = (editor: Editor): DocxOptions => {
  return DOCX_OPTIONS.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: DocxOptions) => {
  DOCX_OPTIONS.set(editor, options)
}
