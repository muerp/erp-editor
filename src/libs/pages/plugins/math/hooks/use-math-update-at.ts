import { useMemo } from 'react'
import { useStore } from 'zustand'
import { useMathStore } from './use-math-store'

export const useMathUpdateAt = (): [number[] | undefined] => {
  const store = useMathStore()
  const at = useStore(store, state => state.at)
  return useMemo(() => {
    return [at]
  }, [store, at])
}