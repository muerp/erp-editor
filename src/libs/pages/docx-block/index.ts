import {
  ContextMenuEditor,
  ContextMenuOptions,
  withContextMenu,
} from '@editablejs/plugin-context-menu'
import {
  Editable,
} from '@editablejs/editor'
import { DocxOptions, withDocx, DocxEditor } from '../plugins/docx'
import {MathMLEditor, withMathML } from '../plugins/math'

export interface DoxPluginOptions {
  contextMenu?: ContextMenuOptions
  doxc?: DocxOptions
}


export const withDoxPlugins = <T extends Editable>(editor: T, options: DoxPluginOptions = {}) => {
  let newEditor = withContextMenu(editor)
  newEditor = withDocx(newEditor, options.doxc)
  newEditor = withMathML(newEditor, options.doxc)
  return newEditor as T &
    ContextMenuEditor &
    DocxEditor &
    MathMLEditor
}
