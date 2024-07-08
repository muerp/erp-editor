import { Descendant, Element } from '@editablejs/models'
import { DOCX_KEY } from '../constants'

export interface Docx extends Element {
  type: typeof DOCX_KEY,
  tagName?: 'section' | 'span' | 'p' | 'img' | 'div',
  style?: any
  classList?: string[]
}

export const Docx = {
  isDocx: (value: any): value is Docx => {
    return Element.isElement(value) && !!value.type && value.type === DOCX_KEY
  },

  create: (children: Descendant[] = [{ text: '' }]): Docx => {
    return {
      type: DOCX_KEY,
      children,
    }
  },
}
