import { useMemo } from 'react'
import { useStore } from 'zustand'
import { useMathStore } from './use-math-store'

export const useMathLatex = (): [string | undefined, (latex: string) => void] => {
  const store = useMathStore()
  const latex = useStore(store, state => state.latex)
  return useMemo(() => {
    return [latex, (latex: string) => store.setState({ latex })]
  }, [store, latex])
}