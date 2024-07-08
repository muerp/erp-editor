import { HTMLSerializerWithTransform } from '@editablejs/serializer/html'
import { SECTION_KEY } from '../constants'
import { Section } from '../interfaces/section'

export const withTitleHTMLSerializerTransform: HTMLSerializerWithTransform = (
  next,
  serializer,
  customOptions = {},
) => {
  const { attributes: customAttributes, style: customStyle } = customOptions
  return (node: any, options) => {
    const { attributes, style } = options ?? {}
    if (Section.isSection(node)) {
      return serializer.create(
        SECTION_KEY,
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
        node.children.map((child: any) => serializer.transform(child)).join(''),
      )
    }
    return next(node, options)
  }
}
