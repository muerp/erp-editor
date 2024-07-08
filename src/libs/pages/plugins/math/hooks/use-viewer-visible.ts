import { useMemo } from 'react'
import { useStore } from 'zustand'
import { useMathStore } from './use-math-store'

export const useViewerVisible = (): [boolean, (visible: boolean) => void] => {
  const store = useMathStore()
  const visible = useStore(store, state => state.visible)
  return useMemo(() => {
    return [visible, (visible: boolean) => store.setState({ visible })]
  }, [store, visible])
}
