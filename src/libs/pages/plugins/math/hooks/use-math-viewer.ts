import { useEditableStatic } from '@editablejs/editor'
import { useMemo } from 'react'
import { getMathViewer } from '../create-viewer'

export const useMathViewer = () => {
  const editor = useEditableStatic()

  return useMemo(() => getMathViewer(editor), [editor])
}
