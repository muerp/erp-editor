import { Element } from '@editablejs/models'
import { MARGIN_KEY } from '../constants'

export interface Margin extends Element {
  marginBlockEnd?: string
}

export const Margin = {
  isMargin: (value: any): value is Margin => {
    return Element.isElement(value) && value.type === MARGIN_KEY
  },
}
