import { Descendant, Element } from '@editablejs/models'
import { DOCX_ARTICLE_KEY } from '../constants'

export interface DocxArticle extends Element {
  type: typeof DOCX_ARTICLE_KEY,
  style?: any
  classList?: string[]
}

export const DocxArticle = {
  isDocxArticle: (value: any): value is DocxArticle => {
    return Element.isElement(value) && !!value.type && value.type === DOCX_ARTICLE_KEY
  },

  create: (children: Descendant[] = [{ text: '' }]): DocxArticle => {
    return {
      type: DOCX_ARTICLE_KEY,
      children,
    }
  },
}
