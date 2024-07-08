
import { Editor } from '@editablejs/models'
import { MathML } from '../interface/math'
import { DOCX_MATH_KEY } from '../constants'
import { getMathViewer } from '../create-viewer'
import { Editable } from '@editablejs/editor'

export interface OpenMathOptions {
  latex: string
}

export interface UpdateMathOptions {
  latex: string
  scale?: number
}

export interface MathMLEditor extends Editor {
  insertMath: (latex: string) => void
  updateMath: (at: number[], options: UpdateMathOptions) => void
}

export const MathMLEditor = {
  isMathEditor: (editor: Editor): editor is MathMLEditor => {
    return !!(editor as MathMLEditor).insertMath
  },
  isMathML: (_: Editor, value: any): value is MathML => {
    return MathML.isMathML(value)
  },
  isActive: (editor: Editor) => {
    const elements = Editor.elements(editor)
    return !!elements[DOCX_MATH_KEY]
  },
  insert(editor: Editor, latex: string) {
    if (MathMLEditor.isMathEditor(editor)) editor.insertMath(latex)
  },
  update: (editor: Editor, at: number[], options: UpdateMathOptions) => {
    if (MathMLEditor.isMathEditor(editor)) editor.updateMath(at, options)
  },
  open: (editor: Editor) => {
    if (MathMLEditor.isMathEditor(editor))  getMathViewer(editor).open();
  }
}
