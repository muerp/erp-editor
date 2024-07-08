import {
    Editable, Slot
} from '@editablejs/editor'
import { MathMLEditor, UpdateMathOptions } from './math-editor'
import { MathMLComponent } from '../components/MathMLComponent'
import { Transforms } from '@editablejs/models'
import { DOCX_MATH_KEY } from '../constants'
import { MathViewer } from '../components/MathViewer'
import { MathML } from '../interface/math'

export const withMathML = <T extends Editable>(editor: T, _: any = {}) => {
    const newEditor = editor as T & MathMLEditor
    const { renderElement, isInline, isVoid } = newEditor
    newEditor.isInline = element => {
        return MathMLEditor.isMathML(newEditor, element) || isInline(element)
    }
    newEditor.isVoid = element => {
        return MathMLEditor.isMathML(newEditor, element) || isVoid(element)
    }

    Slot.mount(newEditor, MathViewer)

    newEditor.renderElement = ({ attributes, children, element }) => {
        if (MathMLEditor.isMathML(editor, element)) {
            return (
                <MathMLComponent {...attributes} element={element} editor={editor}>
                    {children}
                </MathMLComponent>
            )
        }
        return renderElement({ attributes, children, element })
    }

    newEditor.updateMath = (at: number[], options: UpdateMathOptions) => {
        Transforms.setNodes<MathML>(
            editor,
            {
              ...options,
            },
            {
              at,
            },
          )
    }

    newEditor.insertMath = (latex: string) => {
        Transforms.insertNodes(newEditor, {
            type: DOCX_MATH_KEY,
            latex: latex,
            children: [
                { text: '' }
            ]
        } as any)
    }

    // const { normalizeNode } = newEditor
    // newEditor.normalizeNode = entry => {
    //     const [node, path] = entry
    //     if (Editor.isEditor(node)) {
    //         console.log("----", node.children)
    //     }
    //     normalizeNode(entry)
    // }

    // const { onKeydown } = newEditor
    // editor.onKeydown = e => {
    //     const { selection } = editor
    //     e.preventDefault();
    //     return
    //     onKeydown(e)
    // }
    return newEditor
}