import { Descendant, Element } from '@editablejs/models'
import { DOCX_RUN_KEY } from '../constants'

export interface DocxRun extends Element {
  type: typeof DOCX_RUN_KEY,
  style?: any
  classList?: string[]
}

export const DocxRun = {
  isDocxRun: (value: any): value is DocxRun => {
    return Element.isElement(value) && !!value.type && value.type === DOCX_RUN_KEY
  },

  create: (children: Descendant[] = [{ text: '' }]): DocxRun => {
    return {
      type: DOCX_RUN_KEY,
      children,
    }
  },
}
