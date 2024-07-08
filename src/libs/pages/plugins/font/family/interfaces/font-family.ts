import { Text } from '@editablejs/models'
import { FONTFAMILY_KEY } from '../constants'

export interface FontFamily extends Text {
  fontFamily?: string
}

export const FontFamily = {
  isFontFamily: (value: any): value is FontFamily => {
    return Text.isText(value) && FONTFAMILY_KEY in value && typeof value[FONTFAMILY_KEY] === 'string'
  },
}
