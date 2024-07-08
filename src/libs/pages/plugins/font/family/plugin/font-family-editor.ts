import { Editor } from '@editablejs/models'
import { FONTFAMILY_KEY } from '../constants'
import { FontFamily } from '../interfaces/font-family'
import { getOptions } from '../options'

export interface FontFamilyEditor extends Editor {
  toggleFontFamily: (fontFamily: string) => void
}

export const FontFamilyEditor = {
  isFontFamilyEditor: (editor: Editor): editor is FontFamilyEditor => {
    return !!(editor as FontFamilyEditor).toggleFontFamily
  },

  isFontFamily: (editor: Editor, value: any): value is FontFamily => {
    return FontFamily.isFontFamily(value)
  },

  queryActive: (editor: Editor) => {
    const marks = Editor.marks(editor) as Partial<FontFamily>
    return marks[FONTFAMILY_KEY] ?? null
  },

  toggle: (editor: Editor, family: string) => {
    if (FontFamilyEditor.isFontFamilyEditor(editor)) editor.toggleFontFamily(family)
  },

  getOptions,
}
