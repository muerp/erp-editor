import { Element } from '@editablejs/models'
import { DOCX_MATH_KEY } from '../constants'
export interface MathML extends Element {
    math?: string
    latex?: string
}

export const MathML = {
    isMathML: (value: any): value is MathML => {
        return Element.isElement(value) && value.type === DOCX_MATH_KEY || false
    },
}