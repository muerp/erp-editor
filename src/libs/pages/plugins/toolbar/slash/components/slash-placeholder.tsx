import { Editable } from '@editablejs/editor'
import { forwardRef, useMemo } from 'react'
import { useSlashToolbarSearchValue } from '../hooks/use-slash-toolbar-search'
import { getOptions } from '../options'
import React from 'react'

export interface SlashToolbarPlaceholderProps {
  editor: Editable
  children: React.ReactElement
}

export const SlashToolbarPlaceholder = forwardRef<HTMLSpanElement, SlashToolbarPlaceholderProps>(
  ({ editor, children }, ref) => {
    const { placeholder } = useMemo(() => {
      return getOptions(editor)
    }, [editor])

    const searchValue = useSlashToolbarSearchValue(editor)
    const renderChildren = () => {
      if (searchValue) return children
      if (typeof placeholder === 'function') return placeholder(children)
      if (typeof placeholder === 'string')
        return (
          <>
            {children}
            <span className='slash-placehoder'>{placeholder}</span>
          </>
        )

      return children
    }

    return (
      <span className="inline-block" ref={ref}>
        {renderChildren()}
      </span>
    )
  },
)

SlashToolbarPlaceholder.displayName = 'SlashToolbarPlaceholder'
