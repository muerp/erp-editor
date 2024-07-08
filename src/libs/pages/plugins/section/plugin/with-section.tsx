import { Editable } from '@editablejs/editor'
import { Editor } from '@editablejs/models'
import { Section } from '../interfaces/section'

import { setOptions, SectionOptions } from '../options'
import { SectionEditor } from './section-editor'

const { isEmpty } = Editor

Editor.isEmpty = (editor, node) => {
  if (Editor.isEditor(node)) {
    if (!SectionEditor.isSection(node.children[0])) return isEmpty(editor, node)
    return isEmpty(editor, { children: node.children.slice(1) })
  }
  return isEmpty(editor, node)
}

export const withSection = <T extends Editable>(editor: T, options: SectionOptions = {}) => {
  const newEditor = editor as T & SectionEditor

  setOptions(newEditor, options)

  const { renderElement } = newEditor

  newEditor.renderElement = ({ element, attributes, children }) => {
    if (Section.isSection(element)) {
      return (
        <section {...attributes} className='docx' style={{...element?.style}}>
          {children}
        </section>
      )
    }
    return renderElement({ attributes, children, element })
  }
  return newEditor
}
