import { Editor } from '@editablejs/models'
import create, { StoreApi, UseBoundStore } from 'zustand'
export interface MathViewerStore {
  visible: boolean
  latex?: string,
  at?: number[]
}

const EDITOR_TO_MATH_STORE = new WeakMap<Editor, UseBoundStore<StoreApi<MathViewerStore>>>()

export const getViewerStore = (editor: Editor) => {
  let store = EDITOR_TO_MATH_STORE.get(editor)
  if (!store) {
    store = create<MathViewerStore>(() => ({
      visible: false,
      latex: '',
      at: undefined
    }))
    EDITOR_TO_MATH_STORE.set(editor, store)
  }
  return store
}
