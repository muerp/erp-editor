import { Editable } from '@editablejs/editor'
import { Editor, Operation } from '@editablejs/models'
import { Docx } from '../interfaces/docx'

import { setOptions, DocxOptions } from '../options'
import { DocxEditor } from './docx-editor'
import { withHistoryProtocol } from '@editablejs/protocols/history'
const { isEmpty } = Editor

Editor.isEmpty = (editor, node) => {
  if (Editor.isEditor(node)) {
    if (!Docx.isDocx(node.children[0])) return isEmpty(editor, node)
    return isEmpty(editor, { children: node.children.slice(1) })
  }
  return isEmpty(editor, node)
}

export const withDocx = <T extends Editable>(editor: T, options: DocxOptions = {}) => {
  const docxEditor = editor as T & DocxEditor

  setOptions(docxEditor, options)
  const historyProtocol = withHistoryProtocol(docxEditor)
  const { capture } = historyProtocol

  historyProtocol.capture = (op: Operation) => {
    if (op.type === 'set_node') {
      const { path, newProperties } = op
      if (Editor.hasPath(editor, path)) {
        const docx = Editor.node(editor, path)
        if (Docx.isDocx(docx[0])) {
          const prop = newProperties as Partial<Docx>
          if (prop.style) {
            return false
          }
        }
      }
    }
    return capture(op)
  }

  // const { renderLeaf } = docxEditor
  // docxEditor.renderLeaf = (s: RenderLeafProps) => {
  //   const {attributes, children, text } = s
  //   const style: typeof attributes.style = attributes.style ?? {}

  //   console.log('---renderLeaf---', s)
  //   return renderLeaf({ attributes: Object.assign({}, attributes, { style }), children, text })
  // }

  // const { isInline, isVoid } = docxEditor
  // docxEditor.isInline = element => {
  //   return DocxEditor.isDocx(docxEditor, element) || isInline(element)
  // }
  // docxEditor.isVoid = element => {
  //   return DocxEditor.isDocx(docxEditor, element) || isVoid(element)
  // }

  const { renderElementAttributes } = docxEditor

  docxEditor.renderElementAttributes = ({ attributes, element }) => {

    if (Docx.isDocx(element)) {
      const style = { ...element.style } || {}
      // style.display = 'inline-block'

      attributes = Object.assign({}, attributes, { style })
    }


    return renderElementAttributes({
      attributes,
      element,
    })
  }
  // const hotkey = ''
  // const { onKeydown } = docxEditor
  // editor.onKeydown = e => {
  //   if (Hotkey.match(hotkey, e)) {
  //     e.preventDefault()
  //     return
  //   }
  //   onKeydown(e);
  // }

  // const { renderElement } = docxEditor
  // docxEditor.renderElement = ({ element, attributes, children }) => {
  //   if (Docx.isDocx(element)) {
  //     // return (
  //     //   <DocxComponent element={element} attributes={attributes} >
  //     //     {children}
  //     //   </DocxComponent>
  //     // )
  //     const style = element.style || {};
  //     attributes.style = {...style, display: 'inline-block'};
  //     console.log('---attributes-', element.style)
  //   }
  //   return renderElement({ attributes, children, element })
  // }

  // const { normalizeNode } = docxEditor

  // docxEditor.renderLeaf = ({ attributes, children, text }: RenderLeafProps) => {
  //   const style: typeof attributes.style = attributes.style ?? {}
  //   return renderLeaf({ attributes: Object.assign({}, attributes, { style }), children, text })
  // }

  // docxEditor.normalizeNode = entry => {
  //   const [node, path] = entry
  //   if (Editor.isEditor(node)) {
  //     let isUnwrap = false
  //     const firstChild = node.children[0]
  //     if (!firstChild || Editor.isVoid(docxEditor, firstChild)) {
  //       console.log("---------ss1--")
  //       Transforms.insertNodes(
  //         docxEditor,
  //         { type: '', children: [{ text: '' }] },
  //         { at: [0] },
  //       )
  //       isUnwrap = true
  //     } 
  //     const secondChild = node.children[1]
  //     if (!secondChild) {
  //       console.log("---------ss2--")
  //       Transforms.insertNodes(
  //         docxEditor,
  //         { type: 'paragraph', children: [{ text: '' }] },
  //         { at: [1] },
  //       )
  //       isUnwrap = true
  //     } else if (Docx.isDocx(secondChild)) {
  //       // Transforms.setNodes(isUnwrap, { type: 'paragraph' }, { at: [1] })
  //       isUnwrap = true
  //     }
  //     if (isUnwrap) return


  //     if (isUnwrap) {
  //       Transforms.unwrapNodes(editor, { at: path })
  //       return
  //     }

  //   }
  //   normalizeNode(entry)
  // }
  return docxEditor
}
