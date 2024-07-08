import { HTMLSerializerWithTransform } from '@editablejs/serializer/html'
import { DOCX_HEADER_KEY } from '../constants'
import { DocxHeader } from '../interfaces/docx-header'

export const withTitleHTMLSerializerTransform: HTMLSerializerWithTransform = (
  next,
  serializer,
  customOptions = {},
) => {
  const { attributes: customAttributes, style: customStyle } = customOptions
  return (node, options) => {
    const { attributes, style } = options ?? {}
    if (DocxHeader.isDocxHeader(node)) {
      return serializer.create(
        DOCX_HEADER_KEY,
        serializer.mergeOptions(node, attributes, customAttributes),
        serializer.mergeOptions(
          node,
          style,
          {
            fontSize: '32px',
            fontWeight: 'bold',
          },
          customStyle,
        ),
        node.children.map(child => serializer.transform(child)).join(''),
      )
    }
    return next(node, options)
  }
}
