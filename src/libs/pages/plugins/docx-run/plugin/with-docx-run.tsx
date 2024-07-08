import { Editable } from '@editablejs/editor'
import { Editor } from '@editablejs/models'
import { DocxRun } from '../interfaces/docx-run'

import { setOptions, DocxRunOptions } from '../options'
import { DocxRunEditor } from './doc-run-editor'
// import React from 'react'

const { isEmpty } = Editor

Editor.isEmpty = (editor, node) => {
  if (Editor.isEditor(node)) {
    if (!DocxRunEditor.isDocxRun(node.children[0])) return isEmpty(editor, node)
    return isEmpty(editor, { children: node.children.slice(1) })
  }
  return isEmpty(editor, node)
}

export const withDocxRun = <T extends Editable>(editor: T, options: DocxRunOptions = {}) => {
  const newEditor = editor as T & DocxRunEditor

  setOptions(newEditor, options)

  const { renderElement } = newEditor

  newEditor.renderElement = ({ element, attributes, children }) => {
    if (DocxRun.isDocxRun(element)) {
      return (
        <span {...attributes} style={{...element?.style}}>
          {children}
        </span>
      )
    }
    return renderElement({ attributes, children, element })
  }

  // const { renderLeaf } = newEditor

  // newEditor.renderLeaf = ({ attributes, children, text }: RenderLeafProps) => {
  //   const style: typeof attributes.style = attributes.style ?? {}
  //   console.log('---111--', attributes, text)
  //   // if (FontColor.isFontColor(text)) {
  //   //   style.color = text.fontColor
  //   // }
  //   return renderLeaf({ attributes: Object.assign({}, attributes, { style }), children, text })
  // }
  return newEditor
}
