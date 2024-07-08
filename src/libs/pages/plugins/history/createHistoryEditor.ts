import * as Y from 'yjs'
import { HistoryRecordEditorOptions, HistoryRecordEditor } from './interface';
import { getHistory } from './history'
import { Operation } from '@editablejs/models'
import { bufferToOps, getYjsEditor } from './yjs-events';
export const createEditor = (options: HistoryRecordEditorOptions): HistoryRecordEditor => {
    const ydoc = new Y.Doc();
    const editor: HistoryRecordEditor = {
        loading: false,
        id: options.articleId,
        wss: options.wss,
        ydoc,
        isFinished: false,
        sharedRoot: ydoc.get('content', Y.XmlText) as Y.XmlText,
        size: options.size || 10,
        page: 0,
        token: options.token,
        url: options.url,
        recoverUrl: options.recoverUrl,
        destroy() {
            editor.ydoc.destroy();
        },
        getMore: async () => {
            if (editor.loading || editor.isFinished) [];
            editor.loading = true;
            return getHistory(editor).then(result => {
                if (result.length < editor.size) {
                    editor.isFinished = true;
                }
                editor.loading = false;
                return result;
            }).catch(() => {
                editor.loading = false;
                return [];
            })
        },
        recover: async (buffers: Uint8Array[]) => {
            if (!editor.wss || !editor.token) return;
            const adds = await bufferToOps(buffers);
            const yjsEditor = await getYjsEditor(editor.wss, editor.id, editor.token);
            const ops: Operation[] = []
            for (let i = 1; i < yjsEditor.children.length; ++i) {
                ops.push({
                    type: 'remove_node',
                    node: yjsEditor.children[i],
                    path: [1],
                })
            }
            // const first = adds[0];


            for (let i = adds.length - 1; i >= 1; --i) {
                ops.push({
                    type: 'insert_node',
                    node: adds[i],
                    path: [1]
                })
            }
            ops.push({
                type: 'remove_node',
                node: yjsEditor.children[0],
                path: [0],
            })
            ops.push({
                type: 'insert_node',
                node: adds[0],
                path: [0],
            })
            ops.forEach(op => {
                yjsEditor.apply(op);
            })
        }
        // recover: async (clock: number) => {
        //     return recoverDocument(editor, {clock});
        // }

    }
    return editor;
}
// export default { createHistoryEditor }
