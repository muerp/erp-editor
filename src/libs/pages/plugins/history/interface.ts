import { Operation } from "@editablejs/models"
import * as Y from 'yjs'
export interface HistoryRecordInfo {
    content: string,
    ops: Operation[],
    time: number
    buffer: Uint8Array,
    clock: number
}

export interface HistoryRecordEditor {
    loading?: boolean
    id: string
    ydoc: Y.Doc
    sharedRoot: Y.XmlText
    size: number
    page: number
    token?: string
    url?: string
    wss?: string
    isFinished: boolean
    recoverUrl?: string
    destroy: () => void,
    getMore: () => Promise<HistoryRecordInfo[]>
    // recover: (clock: number) => Promise<any>
    recover: (buffers: Uint8Array[]) => Promise<any>
}

export interface HistoryRecordEditorOptions {
    articleId: string
    size?: number
    token?: string
    url?: string
    recoverUrl?: string
    wss?: string
}
