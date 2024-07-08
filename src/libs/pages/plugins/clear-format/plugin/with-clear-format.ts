import {
    Editable
} from '@editablejs/editor'
import { ClearFormatEditor } from './clear-editor'
import { Editor } from '@editablejs/models'

export const withClearFormat = <T extends Editable>(editor: T, _: any = {}) => {
    const newEditor = editor as T & ClearFormatEditor

    newEditor.clearFormat = () => {
        Editor.removeMark(editor, 'fontSize')
        Editor.removeMark(editor, 'fontColor')
        Editor.removeMark(editor, 'backgroundColor')
        Editor.removeMark(editor, 'fontWeight')
        Editor.removeMark(editor, 'strikethrough')
        Editor.removeMark(editor, 'bold')
        Editor.removeMark(editor, 'underline')
        Editor.removeMark(editor, 'italic')
        Editor.removeMark(editor, 'sub')
        Editor.removeMark(editor, 'sup')
    }

    return newEditor;
}