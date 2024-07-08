import { Editor, Transforms, Node, Element } from '@editablejs/models'
import { Margin } from '../interfaces/margin'
import { getOptions } from '../options'

export interface MarginEditor extends Editor {
  toggleMarginEnd: (margin: string) => void
}

export const MarginEditor = {
  isMarginEditor: (editor: Editor): editor is MarginEditor => {
    return !!(editor as MarginEditor).toggleMarginEnd
  },

  isMargin: (_: Editor, value: any): value is Margin => {
    return Margin.isMargin(value)
  },

  queryActiveEnd: (editor: Editor) => {
    const elements = Editor.elements(editor)
    for (const type in elements) {
      for (const [element] of elements[type]) {
        const { marginBlockEnd } = element as Margin
        if (marginBlockEnd) {
          return marginBlockEnd
        }
      }
    }
    return null
  },

  toggleMarginEnd: (editor: Editor, margin: string) => {
    const entry = Editor.above(editor);
    if (entry) {
      const [, path] = entry;
      const element = Node.get(editor, path)
      if (Element.isElement(element)) {
        Transforms.setNodes(editor, { marginBlockEnd: margin } as Margin, { at: path })
      }
    }

  },

  getOptions,
}
