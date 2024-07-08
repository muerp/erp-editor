import { Editor } from '@editablejs/models'

export interface ClearFormatEditor extends Editor {
    clearFormat: () => void
}

export const ClearFormatEditor = {
    clear: (editor: Editor) => {
        (editor as ClearFormatEditor).clearFormat();
    }
}