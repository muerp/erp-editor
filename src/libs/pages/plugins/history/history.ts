
import { HistoryRecordEditor } from './interface';
import { getHistoryRecordStore } from './store';
import { applyYjsEvents, bufferArrayToOps } from './yjs-events'
import * as Y from 'yjs'

const queryString = (params: any) => {
    if (!params) return ''
    const p = Object.keys(params).map(key => {
        const v = params[key];
        if (v || v === 0 || v === '') {
            return (key + '=' + v).replace(/'/g, `\\'`);
        }
        return '';
    }).join('&');
    return p ? '?' + p : '';
}
const documentRequest = async (url: string, method: string, data: any, options?: { token?: string, responseType?: XMLHttpRequestResponseType }): Promise<any> => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        if (method === 'GET') {
            url += queryString(data);
        }
        request.open(method, url, true);
        if (options?.responseType) {
            request.responseType = options.responseType;
        }

        if (options?.token) {
            request.setRequestHeader('Authorization', 'Bearer ' + options.token);
        }
        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200 || request.status === 0) {
                let data: any;
                if (options?.responseType === 'arraybuffer') {
                    data = new Uint8Array(request.response);
                } else {
                    try {
                        data = JSON.parse(request.responseText);
                    } catch (e) {
                        data = request.responseText;
                    }

                }
                resolve(data);
                return;
            }
            reject(new Error(request.statusText));
        };
        if (data && method === 'POST') {
            request.send(JSON.stringify(data));
        } else {
            request.send(null);
        }
        
    })
}


export const getSpanshots = (ydoc: Y.Doc) => {
    return ydoc.getArray('versions')
}

export const recoverSnapshot = (ydoc: Y.Doc, version: { snapshot: Uint8Array }) => {
    const snap = Y.decodeSnapshot(version.snapshot);
    const tempdoc = Y.createDocFromSnapshot(ydoc, snap);

    const currentStateVector = Y.encodeStateVector(ydoc);
    const snapshotStateVector = Y.encodeStateVector(tempdoc);

    const changesSinceSnapshotUpdate = Y.encodeStateAsUpdate(ydoc, snapshotStateVector);

    const um = new Y.UndoManager(
        [...tempdoc.share.values()]
    );

    Y.applyUpdate(tempdoc, changesSinceSnapshotUpdate);
    um.undo();

    const revertChangesSinceSnapshotUpdate = Y.encodeStateAsUpdate(tempdoc, currentStateVector);
    Y.applyUpdate(ydoc, revertChangesSinceSnapshotUpdate, {
        user: {
            id: 'revert'
        }
    });
}

export const restoreHistory = (ydoc: Y.Doc, buffers: Uint8Array[]) => {
    // console.log('----sss--',buffers)
    const tempdoc = new Y.Doc()
    tempdoc.get('content', Y.XmlText).observeDeep((events) => {
        const ops = applyYjsEvents(events);

        const currentStateVector = Y.encodeStateVector(ydoc);
        const tempStateVector = Y.encodeStateVector(tempdoc);

        const changesSinceUpdate = Y.encodeStateAsUpdate(ydoc, tempStateVector);
        const um = new Y.UndoManager(
            [...tempdoc.share.values()]
        );
        Y.applyUpdate(tempdoc, changesSinceUpdate);
        um.undo();
        const revertChangesSinceUpdate = Y.encodeStateAsUpdate(tempdoc, currentStateVector);
        Y.applyUpdate(ydoc, revertChangesSinceUpdate);
    })
    tempdoc.transact(() => {
        for (let i = 0; i < buffers.length; i++) {
            Y.applyUpdate(tempdoc, buffers[i])
        }
    })
}

export const getHistory = async (editor: HistoryRecordEditor) => {
    console.log('editor--3333')
    return documentRequest(editor.url || '', 'GET', {
        id: editor.id,
        page: editor.page,
        size: editor.size
    }, { token: editor.token || 'testtoken' }).then((data: { buffer: number[], time: number, clock: number }[]) => {
        editor.page++;
        console.log('4444--1111')
        if (data.length === 0) {
            return [];
        }
        const arr = data.map(item => ({ buffer: new Uint8Array(item.buffer), time: item.time, clock: item.clock }));
        return bufferArrayToOps(editor, arr).then(result => {
            const store = getHistoryRecordStore(editor);
            const records = store.getState().records
            store.setState({
                records: records.concat(result)
            })
            return result;
        })
    })
}

export const recoverDocument = async (editor: HistoryRecordEditor, data: {clock: number}) => {
    return documentRequest(editor.recoverUrl || '', 'POST', {...data, id: editor.id}, { token: editor.token || 'testtoken' }).then(res => {
        console.log('-d-d--d-', res)
        return res.response;
    })
}