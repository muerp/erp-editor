import {
    Editable,
} from '@editablejs/editor'
export const withDocxSection = (editor: Editable) => {
    const newEditor = editor
    const { renderElement } = newEditor
    newEditor.renderElement = ({ element, attributes, children }) => {
        if (element.type?.startsWith('dox-section')) {
          return (
            <section {...attributes}>
              {children}
            </section>
          )
        }
        return renderElement({ attributes, children, element })
      }
      return newEditor
}