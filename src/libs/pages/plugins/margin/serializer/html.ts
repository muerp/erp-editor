import { HTMLSerializerWithTransform } from '@editablejs/serializer/html'
import { FontFamily } from '../interfaces/font-family'

export const withFontColorHTMLSerializerTransform: HTMLSerializerWithTransform = (
  next,
  serializer,
  customOptions = {},
) => {
  const { attributes: customAttributes, style: customStyle } = customOptions
  return (node, options) => {
    const { attributes, style } = options ?? {}
    if (FontFamily.isFontFamily(node)) {
      const { fontFamily, text } = node
      return serializer.create(
        'span',
        serializer.mergeOptions(node, attributes, customAttributes),
        serializer.mergeOptions(node, style, customStyle, { color: fontFamily }),
        text,
      )
    }
    return next(node, options)
  }
}
