import { HTMLDeserializerWithTransform } from '@editablejs/deserializer/html'
import { SECTION_KEY } from '../constants'
import { Descendant } from '@editablejs/models'

export const withSectionHTMLDeserializerTransform: HTMLDeserializerWithTransform = (
  next,
  serializer,
) => {
  return (node, options = {}) => {
    const { element, text } = options
    if (node.nodeName.toLowerCase() === SECTION_KEY) {
      const children: Descendant[] = []
      for (const child of node.childNodes) {
        children.push(...serializer.transform(child, { text }))
      }
      return [{ ...element, type: SECTION_KEY, children }]
    }
    return next(node, options)
  }
}
