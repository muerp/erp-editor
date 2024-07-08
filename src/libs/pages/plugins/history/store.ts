import { HistoryRecordEditor, HistoryRecordInfo } from "./interface"
import create, {UseBoundStore, StoreApi} from 'zustand'



interface HistoryRecordStore {
    records: HistoryRecordInfo[]
}

const HISTORY_RECORD_STORE = new WeakMap<HistoryRecordEditor, UseBoundStore<StoreApi<HistoryRecordStore>>>()

export const getHistoryRecordStore = (editor: HistoryRecordEditor) => {
  let store = HISTORY_RECORD_STORE.get(editor)
  if (!store) {
    store = create<HistoryRecordStore>(() => ({
        records: [],
    }))
    HISTORY_RECORD_STORE.set(editor, store)
  }
  return store
}
