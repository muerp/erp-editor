import { Editor } from '@editablejs/models'
import { Editable, RenderLeafProps, Hotkey } from '@editablejs/editor'
import { FONTFAMILY_KEY } from '../constants'
import { FontFamilyEditor } from './font-family-editor'
import { FontFamily } from '../interfaces/font-family'
import { FontFamilyHotkey, FontFamilyOptions, setOptions } from '../options'

const defaultHotkeys: FontFamilyHotkey = {}

export const withFontFamily = <T extends Editable>(editor: T, options: FontFamilyOptions = {}) => {
  const newEditor = editor as T & FontFamilyEditor

  setOptions(newEditor, options)

  newEditor.toggleFontFamily = (fontFamily: string) => {
    editor.normalizeSelection(selection => {
      // console.log('----fontFamily-', fontFamily)
      if (editor.selection !== selection) editor.selection = selection
      const { defaultFamily } = FontFamilyEditor.getOptions(editor)
      if (defaultFamily && fontFamily === defaultFamily) {
        Editor.removeMark(editor, FONTFAMILY_KEY)
      } else {
        Editor.addMark(editor, FONTFAMILY_KEY, fontFamily)
      }
    })
  }

  const { renderLeaf } = newEditor

  newEditor.renderLeaf = ({ attributes, children, text }: RenderLeafProps) => {
    const style: typeof attributes.style = attributes.style ?? {}
    if (FontFamily.isFontFamily(text)) {
      style.fontFamily = text.fontFamily
    }
    return renderLeaf({ attributes: Object.assign({}, attributes, { style }), children, text })
  }

  const { onKeydown } = newEditor

  const hotkeys: FontFamilyHotkey = Object.assign({}, defaultHotkeys, options.hotkey)
  newEditor.onKeydown = (e: KeyboardEvent) => {
    const value = Hotkey.match(hotkeys, e)
    if (value) {
      e.preventDefault()
      newEditor.toggleFontFamily(value)
      return
    }
    onKeydown(e)
  }
  return newEditor
}
