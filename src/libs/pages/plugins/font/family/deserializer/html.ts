import { HTMLDeserializerWithTransform } from '@editablejs/deserializer/html'
import { isDOMHTMLElement } from '@editablejs/models'
import { FontFamily } from '../interfaces/font-family'

export const withFontFamilyHTMLDeserializerTransform: HTMLDeserializerWithTransform = next => {
  return (node, options = {}) => {
    const { text } = options
    if (isDOMHTMLElement(node)) {
      const { fontFamily } = node.style
      if (fontFamily) {
        const family: Partial<FontFamily> = {
          ...text,
          fontFamily,
        }
        return next(node, {
          ...options,
          text: family,
        })
      }
    }
    return next(node, options)
  }
}
