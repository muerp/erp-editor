import * as React from 'react'
import {
  Editable,
  useEditableStatic,
  Slot,
  SelectionDrawing,
  useSlotActive,
  useIsomorphicLayoutEffect,
} from '@editablejs/editor'
import { Descendant, Range } from '@editablejs/models'
import { useInlineToolbarItems, useInlineToolbarOpen } from '../store'
import { Toolbar } from '../../components/toolbar'

export const InlineToolbar = () => {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLElement | null>(null)
  const editor = useEditableStatic()

  const items = useInlineToolbarItems(editor)

  const [open, setOpen] = useInlineToolbarOpen(editor)

  const [side, setSide] = React.useState<'bottom' | 'top'>('bottom')

  const pointRef = React.useRef({ x: 0, y: 0 })

  const updatePoint = React.useCallback(() => {
    if (!rootRef.current || !containerRef.current) return;
    const { selection } = editor
    if (!selection) return

    const rects = SelectionDrawing.toRects(editor, selection, false)
    const isBackward = Range.isBackward(selection)

    let rangeRect = { x: 0, y: 0, width: 0, height: 0 };
    if (rects.length > 0) {
      const rect = isBackward ? rects[0] : rects[rects.length - 1]
      rangeRect.x = isBackward ? rect.x : rect.right
      rangeRect.y = isBackward ? rect.y : rect.bottom
      rangeRect.width = rect.width;
      rangeRect.height = rect.height;
    } else {
      const range = Editable.toDOMRange(editor, selection)
      range.collapse(isBackward)
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        setOpen(false)
        return
      }
      rangeRect.x = isBackward ? rect.x : rect.right
      rangeRect.y = isBackward ? rect.top : rect.bottom
      rangeRect.width = rect.width;
      rangeRect.height = rect.height;
    }
    if (!rangeRect) return;
    const offset = 10;
    const pRect = containerRef.current.getBoundingClientRect();
    const rect = rootRef.current.getBoundingClientRect();

    let x = rangeRect.x - pRect.left - rect.width * 0.5;
    if (x < 0) {
      x = 0;
    }
    rootRef.current.style.left = x + 'px';
    let y = rangeRect.y - pRect.top;

    
    if (isBackward) {
      if (rangeRect.y - rect.height - offset < 10) {
        rootRef.current.style.top = (rangeRect.y - pRect.top + rangeRect.height + offset) + 'px';
      } else {
        rootRef.current.style.top = (rangeRect.y - pRect.top - rect.height - offset) + 'px';
      }
    } else if (rangeRect.y + rect.height + offset > document.body.clientHeight) {
      rootRef.current.style.top = (rangeRect.y - pRect.top - rangeRect.height - rect.height - offset) + 'px';
    } else {
      rootRef.current.style.top = (rangeRect.y - pRect.top + offset) + 'px';
    }

    setSide(isBackward ? 'top' : 'bottom')
  }, [editor, setOpen, setSide, open])

  const handleOpen = React.useCallback(
    (force = false) => {
      const { selection } = editor
      if (selection && (Range.isExpanded(selection) || force)) {
        updatePoint()
        setOpen(value => {
          if (value) {
            document.dispatchEvent(new CustomEvent('refreshInlineToolbarPosition'))
          }
          return true
        })
      } else {
        setOpen(false)
      }
    },
    [editor, setOpen, updatePoint],
  )

  const isRootMouseDown = React.useRef(false)

  const handleSelectStart = React.useCallback(() => {
    if (!isRootMouseDown.current) setOpen(false)
  }, [setOpen])

  const handleSelectionChange = React.useCallback(() => {
    const { selection } = editor
    if (!selection || Range.isCollapsed(selection)) {
      setOpen(false)
    }
  }, [editor, setOpen])

  const [contentChanged, setContentChanged] = React.useState<Descendant[]>([])

  React.useEffect(() => {
    if (!open) return
    updatePoint()
    document.dispatchEvent(new CustomEvent('refreshInlineToolbarPosition'))
  }, [open, contentChanged, updatePoint])

  React.useEffect(() => {
    containerRef.current = Editable.toDOMNode(editor, editor)
    const root = document.createElement('div')

    const handleMouseDown = () => {
      isRootMouseDown.current = true
    }

    const handleMouseUp = () => {
      isRootMouseDown.current = false
    }

    const handleChange = () => {
      setContentChanged(editor.children)
    }
    root.addEventListener('mousedown', handleMouseDown)
    root.addEventListener('mouseup', handleMouseUp)
    if (rootRef.current)
    root.appendChild(rootRef.current)

    const handleSelectOpen = () => {
      handleOpen()
    }

    const handleTouchHoldOpen = () => {
      handleOpen(true)
    }

    const handleTouchTrack = () => {
      setOpen(value => {
        const newValue = !value
        if (newValue) {
          handleOpen(true)
        }
        return newValue
      })
    }

    document.body.appendChild(root)
    editor.on('blur', handleSelectStart)
    editor.on('touchhold', handleTouchHoldOpen)
    editor.on('touchtrack', handleTouchTrack)
    editor.on('selectstart', handleSelectStart)
    editor.on('selectend', handleSelectOpen)
    editor.on('selectionchange', handleSelectionChange)
    editor.on('change', handleChange)
    return () => {
      document.body.removeChild(root)
      editor.off('blur', handleSelectStart)
      editor.off('touchhold', handleTouchHoldOpen)
      editor.off('touchtrack', handleTouchTrack)
      editor.off('selectstart', handleSelectStart)
      editor.off('selectend', handleSelectOpen)
      editor.off('selectionchange', handleSelectionChange)
      editor.off('change', handleChange)
      root.removeEventListener('mousedown', handleMouseDown)
      root.removeEventListener('mouseup', handleMouseUp)
    }
  }, [editor, handleOpen, handleSelectStart, handleSelectionChange])

  const [active] = useSlotActive(InlineToolbar)
  useIsomorphicLayoutEffect(() => {
    if (active === false) {
      setOpen(false)
    }
  }, [active])

  useIsomorphicLayoutEffect(() => {
    if (open) Slot.update(editor, { active: true }, c => c === InlineToolbar)
  }, [editor, open])

  useIsomorphicLayoutEffect(() => {
  }, [rootRef.current?.clientHeight])

  return (
    <>
      {
        open && <div className='toolbar-popover' ref={rootRef}>
          <Toolbar items={items} mode="inline" onRefresh={() => {
            if (open) {
              updatePoint();
            }
          }} />
        </div>
      }
    </>
  )
}
