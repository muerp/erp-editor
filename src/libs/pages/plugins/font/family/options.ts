import { Editor } from '@editablejs/models'

export type FontFamilyHotkey = Record<string, string | ((e: KeyboardEvent) => boolean)>

export interface FontFamilyOptions {
  hotkey?: FontFamilyHotkey
  defaultFamily?: string
}

const FONTFAMILY_OPTIONS = new WeakMap<Editor, FontFamilyOptions>()

export const getOptions = (editor: Editor): FontFamilyOptions => {
  return FONTFAMILY_OPTIONS.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: FontFamilyOptions) => {
  FONTFAMILY_OPTIONS.set(editor, options)
}
