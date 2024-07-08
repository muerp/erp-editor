import { Descendant, Element } from '@editablejs/models'
import { DOCX_HEADER_KEY } from '../constants'

export interface DocxHeader extends Element {
  type: typeof DOCX_HEADER_KEY,
  style?: any
  classList?: string[]
}

export const DocxHeader = {
  isDocxHeader: (value: any): value is DocxHeader => {
    return Element.isElement(value) && !!value.type && value.type === DOCX_HEADER_KEY
  },

  create: (children: Descendant[] = [{ text: '' }]): DocxHeader => {
    return {
      type: DOCX_HEADER_KEY,
      children,
    }
  },
}
