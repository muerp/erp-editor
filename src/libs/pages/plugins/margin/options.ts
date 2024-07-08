import { Editor } from '@editablejs/models'

export type MarginHotkey = Record<string, string | ((e: KeyboardEvent) => boolean)>

export interface MarginOptions {
  hotkey?: MarginHotkey
  defaultMargin?: string
}

const MARGIN_OPTIONS = new WeakMap<Editor, MarginOptions>()

export const getOptions = (editor: Editor): MarginOptions => {
  return MARGIN_OPTIONS.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: MarginOptions) => {
  MARGIN_OPTIONS.set(editor, options)
}
