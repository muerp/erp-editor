import { Descendant, Element } from '@editablejs/models'
import { SECTION_KEY } from '../constants'

export interface Section extends Element {
  type: typeof SECTION_KEY,
  style?: any
  classList?: string[]
}

export const Section = {
  isSection: (value: any): value is Section => {
    return Element.isElement(value) && !!value.type && value.type === SECTION_KEY
  },

  create: (children: Descendant[] = [{ text: '' }]): Section => {
    return {
      type: SECTION_KEY,
      children,
    }
  },
}
