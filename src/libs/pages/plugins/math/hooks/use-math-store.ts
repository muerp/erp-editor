import { useEditableStatic } from '@editablejs/editor'
import { useMemo } from 'react'
import { getViewerStore } from '../store'

export const useMathStore = () => {
  const editor = useEditableStatic()
  const store = useMemo(() => getViewerStore(editor), [editor])
  return store
}
