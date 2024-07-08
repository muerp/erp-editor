import * as Y from 'yjs'
import { Node, Operation, createEditor } from '@editablejs/models'
import {
    deltaInsertToEditorNode,
} from '@editablejs/yjs-transform'
import { HistoryRecordEditor, HistoryRecordInfo } from './interface'
import { WebsocketProvider } from '@editablejs/yjs-websocket'
import { YjsEditor, withYjs } from '@editablejs/plugin-yjs'
import { Editable, withEditable } from '@editablejs/editor'

function applyDelta(delta: any): Operation[] {
    const ops: Operation[] = []
    // Apply changes in reverse order to avoid path changes.
    const changes = delta.reverse()
    for (const change of changes) {
        if ('insert' in change) {
            ops.push({
                type: 'insert_node',
                path: [0],
                node: deltaInsertToEditorNode(change),
            })
        }
    }

    return ops
}
export function translateYTextEvent(
    event: Y.YTextEvent,
): Operation[] {
    const { target } = event
    const delta = event.delta

    if (!(target instanceof Y.XmlText)) {
        throw new Error('Unexpected target node type')
    }

    const ops: Operation[] = []

    if (delta.length > 0) {
        ops.push(...applyDelta(delta))
    }

    return ops
}

function translateYjsEvent(
    event: Y.YEvent<Y.XmlText>,
) {
    if (event instanceof Y.YTextEvent) {
        return translateYTextEvent(event)
    }

    throw new Error('Unexpected Y event type')
}
export const applyYjsEvents = (events: Y.YEvent<Y.XmlText>[]) => {
    const ops = events.reduceRight<any[]>((_, event) => {
        return translateYjsEvent(event)
    }, [])
    return ops;
}

export const bufferArrayToOps = async (editor: HistoryRecordEditor, updates: { buffer: Uint8Array; time: number, clock: number }[]): Promise<HistoryRecordInfo[]> => {
    return new Promise(resolve => {
        const ydoc = editor.ydoc;
        const allHistory: any[] = []
        let len = updates.length;
        const onObserveDeep = (events: Y.YEvent<Y.XmlText>[]) => {
            const ops = applyYjsEvents(events);
            len--;
            // console.log('ssss----', editor.sharedRoot.toString())
            allHistory.push({
                content: ops.map(op => Node.string(op.node)).join(''),
                time: updates[updates.length - len - 1].time,
                buffer: updates[updates.length - len - 1].buffer,
                ops: [...ops],
                clock: updates[updates.length - len - 1].clock,
            })
            // if (ops.length > 0) {
            //     allHistory.push({
            //         content: ops.map(op => Node.string(op.node)).join(''),
            //         time: updates[updates.length - len - 1].time,
            //         ops: [...ops]
            //     })
            // }
            if (len === 0) {
                editor.sharedRoot.unobserveDeep(onObserveDeep)
                resolve(allHistory);
            }
        }
        editor.sharedRoot.observeDeep(onObserveDeep)
        for (let i = 0; i < updates.length; i++) {
            Y.applyUpdate(ydoc, updates[i].buffer)
        }
    })
}

export const testToOps = (updates: { buffer: Uint8Array }[]) => {
    console.log('-test--events-222--', updates)
    const doc = new Y.Doc();
    const sharedRoot = doc.get('content', Y.XmlText) as Y.XmlText;
    let len = updates.length;
    let allOps: any[] = [];
    sharedRoot.observeDeep(events => {
        const ops = applyYjsEvents(events);
        allOps = allOps.concat(ops);
        console.log('--test--events--11--', ops.length);
        len--;
        if (len === 0) {
            console.log('--test--events----', allOps);
        }

    })
    for (let i = 0; i < updates.length; i++) {
        Y.applyUpdate(doc, updates[i].buffer)
    }

}

export const bufferToOps = (buffers: Uint8Array[]): Promise<Node[]> => {
    return new Promise(resolve => {
        const ydoc = new Y.Doc()
        ydoc.get('content', Y.XmlText).observeDeep((events) => {
            const ops = applyYjsEvents(events);
            resolve(ops.map(op => op.node).reverse());
        })
        ydoc.transact(() => {
            for (let i = 0; i < buffers.length; i++) {
                Y.applyUpdate(ydoc, buffers[i])
            }
        })
    })
}

export const getYjsEditor = async (wss: string, id: string, token: string): Promise<Editable> => {
    return new Promise((resolve) => {
        const ydoc = new Y.Doc({ gc: false });
        const provider = new WebsocketProvider(wss, id, ydoc, {
            connect: false,
            params: {
                token: token
            }
        })
        const sharedType = ydoc.get('content', Y.XmlText) as Y.XmlText
        const editor = withYjs(withEditable(createEditor()), sharedType, { autoConnect: false });
        editor.on('change', () => {
            if (editor.children.length > 0) {
                resolve(editor)
                setTimeout(() => {
                    provider.disconnect();
                }, 200);
            }
        })

        provider.on('status', (event: any) => {
            if (event.status === 'connected') {
                YjsEditor.connect(editor)
            }
        })

        provider.connect();
        
        
    })

}
