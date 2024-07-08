import { HTMLDeserializerWithTransform } from '@editablejs/deserializer/html'
import { DOCX_HEADER_KEY } from '../constants'
import { Descendant } from '@editablejs/models'

export const withSectionHTMLDeserializerTransform: HTMLDeserializerWithTransform = (
  next,
  serializer,
) => {
  return (node, options = {}) => {
    const { element, text } = options
    if (node.nodeName.toLowerCase() === DOCX_HEADER_KEY) {
      const children: Descendant[] = []
      for (const child of node.childNodes) {
        children.push(...serializer.transform(child, { text }))
      }
      return [{ ...element, type: DOCX_HEADER_KEY, children }]
    }
    return next(node, options)
  }
}
