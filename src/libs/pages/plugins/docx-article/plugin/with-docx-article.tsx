import { Editable } from '@editablejs/editor'
import { Editor } from '@editablejs/models'
import { DocxArticle } from '../interfaces/docx-article'

import { setOptions, DocxArticleOptions } from '../options'
import { DocxArticleEditor } from './docx-article-editor'

const { isEmpty } = Editor

Editor.isEmpty = (editor, node) => {
  if (Editor.isEditor(node)) {
    if (!DocxArticleEditor.isDocxArticle(node.children[0])) return isEmpty(editor, node)
    return isEmpty(editor, { children: node.children.slice(1) })
  }
  return isEmpty(editor, node)
}

export const withDocxArticle = <T extends Editable>(editor: T, options: DocxArticleOptions = {}) => {
  // 页眉
  const newEditor = editor as T & DocxArticleEditor

  setOptions(newEditor, options)

  const { renderElement } = newEditor

  newEditor.renderElement = ({ element, attributes, children }) => {
    if (DocxArticle.isDocxArticle(element)) {
      // return (
      //   <article {...attributes} style={{...element?.style}}>
      //     {children}
      //   </article>
      // )
      attributes.style = element.style || {};
    }
    return renderElement({ attributes, children, element })
  }
  return newEditor
}
