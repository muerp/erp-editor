import { Editable, Hotkey, RenderElementAttributes } from '@editablejs/editor'
import { MarginEditor } from './margin-editor'
import { Margin } from '../interfaces/margin'
import { MarginHotkey, MarginOptions, setOptions } from '../options'
import { Element } from '@editablejs/models'

const defaultHotkeys: MarginHotkey = {}

export const withMargin = <T extends Editable>(editor: T, options: MarginOptions = {}) => {
  const newEditor = editor as T & MarginEditor

  setOptions(newEditor, options)


  const { renderElementAttributes } = newEditor

  newEditor.renderElementAttributes =( {attributes, element}: RenderElementAttributes<Margin>) => {
    const { marginBlockEnd } = element
    const style: React.CSSProperties = attributes.style ?? {}
    if (marginBlockEnd) {
      style.marginBlockEnd = marginBlockEnd;
    } else {
      // delete style.marginBlockEnd
      style.marginBlockEnd = '0.8rem'
    }
    return renderElementAttributes({ attributes: Object.assign({}, attributes, { style }), element })
  }


  const { onKeydown, isInline, isVoid, isSolidVoid } = newEditor

  newEditor.isInline = (el: Element) => {
    return MarginEditor.isMargin(newEditor, el) || isInline(el)
  }

  newEditor.isVoid = (el: Element) => {
    return MarginEditor.isMargin(newEditor, el) || isVoid(el)
  }

  newEditor.isSolidVoid = (el: Element) => {
    if (MarginEditor.isMargin(newEditor, el)) return false
    return isSolidVoid(el)
  }

  const hotkeys: MarginHotkey = Object.assign({}, defaultHotkeys, options.hotkey)
  newEditor.onKeydown = (e: KeyboardEvent) => {
    const value = Hotkey.match(hotkeys, e)
    onKeydown(e)
  }

  return newEditor
}
