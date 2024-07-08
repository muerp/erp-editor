import { Editable, Placeholder } from '@editablejs/editor'
import { Editor } from '@editablejs/models'
import { DocxHeader } from '../interfaces/docx-header'

import { setOptions, DocxHeaderOptions } from '../options'
import { DocxHeaderEditor } from './doc-header-editor'

const { isEmpty } = Editor

Editor.isEmpty = (editor, node) => {
  if (Editor.isEditor(node)) {
    if (!DocxHeaderEditor.isDocxHeader(node.children[0])) return isEmpty(editor, node)
    return isEmpty(editor, { children: node.children.slice(1) })
  }
  return isEmpty(editor, node)
}

export const withDocxHeader = <T extends Editable>(editor: T, options: DocxHeaderOptions = {}) => {
  // 页眉
  const newEditor = editor as T & DocxHeaderEditor
  newEditor.isHeader = true;

  setOptions(newEditor, options)

  const { renderElement } = newEditor

  newEditor.renderElement = ({ element, attributes, children }) => {
    if (DocxHeader.isDocxHeader(element)) {
      return (
        <header {...attributes} style={{...element?.style}} className='docx-header'>
          {children}
          {/* <span className="opacity-80">页眉输入</span> */}
        </header>
      )
    }
    return renderElement({ attributes, children, element })
  }
  
  const { onKeydown } = newEditor
  newEditor.onKeydown = (e: KeyboardEvent) => {
    // if (Hotkey.match(hotkey, e)) {
    //   e.preventDefault()
    //   return
    // }
    onKeydown(e);
  }

  Placeholder.subscribe(
    editor,
    ([node]) => {
      if (DocxHeader.isDocxHeader(node)) return () => options.placeholder ?? 'Page header'
    },
    true,
  )
  return newEditor
}
