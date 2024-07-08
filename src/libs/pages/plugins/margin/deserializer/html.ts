import { HTMLDeserializerWithTransform } from '@editablejs/deserializer/html'
import { isDOMHTMLElement } from '@editablejs/models'
import { Margin } from '../interfaces/margin'

export const withMarginHTMLDeserializerTransform: HTMLDeserializerWithTransform = next => {
  return (node, options = {}) => {
    const { element, text } = options
    if (isDOMHTMLElement(node)) {
      const { marginBlockEnd } = node.style
      const indent = Object.assign({}, element) as Margin
      if (!indent.marginBlockEnd && marginBlockEnd) {
        indent.marginBlockEnd = marginBlockEnd;
      }
      if (indent.marginBlockEnd) {
        return next(node, { element: indent, text })
      }
    }
    return next(node, options)
  }
}
