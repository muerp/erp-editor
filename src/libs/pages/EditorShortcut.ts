import { Editor } from "@editablejs/models";
import { ShortcutItem } from "./plugins/window";
import { BackgroundColorEditor, FontColorEditor, IndentEditor, LinkEditor, MarkEditor } from "@editablejs/plugins";
import { HistoryEditor } from "@editablejs/plugin-history";

export const shortcutEditor = (editor: Editor, shortcut: ShortcutItem, { accentColor, majorContentColor }: { accentColor?: string, majorContentColor?: string }) => {
    switch (shortcut.key) {
        case 'bold':
            MarkEditor.toggle(editor, 'bold')
            break;
        case 'significance':
            if (BackgroundColorEditor.queryActive(editor) === (accentColor || '#f4e6b9')) {
                BackgroundColorEditor.toggle(editor, 'transparent')
            } else {
                BackgroundColorEditor.toggle(editor, '#f4e6b9')
            }
            break;
        case 'significance-content':
            if (FontColorEditor.queryActive(editor) === (majorContentColor || '#de4e4e')) {
                FontColorEditor.toggle(editor, '#000')
            } else {
                FontColorEditor.toggle(editor, '#de4e4e')
            }
            break;
        case 'italic':
            MarkEditor.toggle(editor, 'italic')
            break;
        case 'underline':
            MarkEditor.toggle(editor, 'underline')
            break;
        case 'color':
            break;
        case 'background':
            break;
        case 'indent':
            const entry = Editor.above(editor);
            if (entry) {
                IndentEditor.addLineIndent(editor, entry[1])
            }
            break;
        case 'link':
            LinkEditor.open(editor)
            break;
        case 'undo':
            if (HistoryEditor.canUndo(editor)) {
                HistoryEditor.undo(editor)
            }
            break;
        case 'redo':
            if (HistoryEditor.canRedo(editor)) {
                HistoryEditor.redo(editor)
            }
            break;
        case 'ordered':
            break;
        case 'unordered':
            break;
        case 'check-list':
            break;
        case 'clear':
            break;
    }
}