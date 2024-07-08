import { HTMLSerializerWithTransform } from '@editablejs/serializer/html'
import { DOCX_RUN_KEY } from '../constants'
import { DocxRun } from '../interfaces/docx-run'

export const withTitleHTMLSerializerTransform: HTMLSerializerWithTransform = (
  next,
  serializer,
  customOptions = {},
) => {
  const { attributes: customAttributes, style: customStyle } = customOptions
  return (node, options) => {
    const { attributes, style } = options ?? {}
    if (DocxRun.isDocxRun(node)) {
      return serializer.create(
        DOCX_RUN_KEY,
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
