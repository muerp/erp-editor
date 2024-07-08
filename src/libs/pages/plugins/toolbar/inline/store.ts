import * as React from 'react'
import create, { StoreApi, UseBoundStore, useStore } from 'zustand'
import shallow from 'zustand/shallow'
import { Editable, useIsomorphicLayoutEffect } from '@editablejs/editor'

import { ToolbarItem } from '../components/type'

interface ToolbarState {
  items: ToolbarItem[]
  open: boolean
  disabled: boolean
  theme?: string
}

const EDITOR_TO_TOOLBAR_STORE = new WeakMap<Editable, UseBoundStore<StoreApi<ToolbarState>>>()

const getStore = (editor: Editable) => {
  let store = EDITOR_TO_TOOLBAR_STORE.get(editor)
  if (!store) {
    store = create<ToolbarState>(() => ({
      items: [],
      open: false,
      disabled: false,
    }))
    EDITOR_TO_TOOLBAR_STORE.set(editor, store)
  }
  return store
}

export const useInlineToolbarStore = (editor: Editable) => {
  return React.useMemo(() => getStore(editor), [editor])
}

export const useInlineToolbarItems = (editor: Editable) => {
  const store = useInlineToolbarStore(editor)
  return useStore(store, state => state.items, shallow)
}

export const useInlineToolbarOpen = (
  editor: Editable,
): [boolean, (open: boolean | ((value: boolean) => boolean)) => void, boolean, string|undefined] => {
  const store = useInlineToolbarStore(editor)
  const open = useStore(store, state => state.open)
  const disabled = useStore(store, state => state.disabled)
  const theme = useStore(store, state => state.theme)
  return React.useMemo(
    () => [
      open,
      (open: boolean | ((value: boolean) => boolean)) => {
        if (typeof open === 'function') {
          open = open(store.getState().open)
        }
        InlineToolbar.setOpen(editor, open)
      },
      disabled,
      theme
    ],
    [editor, open, disabled, theme],
  )
}

type ToolbarEffectCallback = () => (() => void) | void

export const useInlineToolbarEffect = (aciton: ToolbarEffectCallback, [editor, ...props]: [editor: Editable, ...props: any]) => {
  const [open] = useInlineToolbarOpen(editor)
  useIsomorphicLayoutEffect(() => {
    let destroy: (() => void) | void

    const handleSelectionChange = () => {
      if (destroy) destroy()
      destroy = aciton()
    }
    if (open) {
      destroy = aciton()
      editor.on('selectionchange', handleSelectionChange)
    }
    return () => {
      editor.off('selectionchange', handleSelectionChange)
      if (destroy) destroy()
    }
  }, [open, editor, aciton, ...props])
}

export const InlineToolbar = {
  setOpen(editor: Editable, open: boolean) {
    const store = getStore(editor)
    store.setState({ open })
  },
  setDisabled(editor: Editable, disabled: boolean) {
    const store = getStore(editor)
    store.setState({ disabled })
  },
  setItems(editor: Editable, items: ToolbarItem[]) {
    const store = getStore(editor)
    store.setState({ items })
  },
  setTheme(editor: Editable, theme: string) {
    const store = getStore(editor)
    store.setState({ theme })
  },
}
