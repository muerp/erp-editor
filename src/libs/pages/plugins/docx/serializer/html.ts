import { HTMLSerializerWithTransform } from '@editablejs/serializer/html'
import { DOCX_KEY } from '../constants'
import { Docx } from '../interfaces/docx'

export const withTitleHTMLSerializerTransform: HTMLSerializerWithTransform = (
  next,
  serializer,
  customOptions = {},
) => {
  const { attributes: customAttributes, style: customStyle } = customOptions
  return (node, options) => {
    const { attributes, style } = options ?? {}
    if (Docx.isDocx(node)) {
      return serializer.create(
        DOCX_KEY,
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
