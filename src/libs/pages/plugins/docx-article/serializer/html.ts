import { HTMLSerializerWithTransform } from '@editablejs/serializer/html'
import { DOCX_ARTICLE_KEY } from '../constants'
import { DocxArticle } from '../interfaces/docx-article'

export const withTitleHTMLSerializerTransform: HTMLSerializerWithTransform = (
  next,
  serializer,
  customOptions = {},
) => {
  const { attributes: customAttributes, style: customStyle } = customOptions
  return (node, options) => {
    const { attributes, style } = options ?? {}
    if (DocxArticle.isDocxArticle(node)) {
      return serializer.create(
        DOCX_ARTICLE_KEY,
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
