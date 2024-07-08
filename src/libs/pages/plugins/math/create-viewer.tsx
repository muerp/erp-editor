import { Editable } from '@editablejs/editor'
import { Editor } from '@editablejs/models'
import { getViewerStore } from './store'

export const VIEWER_CACHE_WEAKMAP = new WeakMap<Editor, ReturnType<typeof createMathViewer>>()

const createMathViewer = (editor: Editor) => {
  const viewer = {

    open: (at?:number[], latex?: string) => {
      const store = getViewerStore(editor)
      return store.setState({
        visible: true,
        latex,
        at
      })
    },

    close: () => {
      const store = getViewerStore(editor)
      store.setState({
        visible: false,
        latex: '',
        at: undefined
      })
    }
  }
  return viewer
}

export const getMathViewer = (editor: Editor) => {
  let viewer = VIEWER_CACHE_WEAKMAP.get(editor)
  if (viewer) {
    return viewer
  }
  viewer = createMathViewer(editor)
  VIEWER_CACHE_WEAKMAP.set(editor, viewer)
  return viewer
}
