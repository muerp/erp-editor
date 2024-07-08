import {
  useIsomorphicLayoutEffect,
  useLocale,
  useNodeFocused,
  useReadOnly,
} from '@editablejs/editor'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Toolbar,
  ToolbarColorPicker,
  ToolbarDropdown,
  Tooltip,
} from '@editablejs/ui'
import { FC, useState } from 'react'
import { DEFAULT_HR_STYLE, DEFAULT_HR_WIDTH, DEFUALT_HR_COLOR } from '../constants'
import { HrEditor } from '../plugin/hr-editor'
import { Hr, HrStyle } from '../interfaces/hr'
import { HrLocale } from '../locale/types'
import { StyleIcon, ThicknessIcon } from './icons'
import React from 'react'
import { SvgIcon } from '../../../../../libs/pages/components'

export interface HrPopoverProps {
  editor: HrEditor
  element: Hr
  children?: React.ReactNode
}

export const HrPopover: FC<HrPopoverProps> = ({ editor, element, children }) => {
  const focused = useNodeFocused()
  const [readOnly] = useReadOnly()
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handlePopoverOpenChange = (open: boolean) => {
    if (focused) {
      setPopoverOpen(true)
    } else {
      setPopoverOpen(open)
    }
  }

  useIsomorphicLayoutEffect(() => {
    setPopoverOpen(focused)
  }, [focused])

  const { toolbar } = useLocale<HrLocale>('hr')

  return (
    <Popover
      open={readOnly ? false : popoverOpen}
      onOpenChange={handlePopoverOpenChange}
      trigger="hover"
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent autoUpdate={true} side="top" sideOffset={5} className='hr-popover'>
        <Toolbar mode="inline">
          <Tooltip content={toolbar.color} side="top" arrow={false} className='hr-color'>
            <ToolbarColorPicker
              defaultValue={DEFUALT_HR_COLOR}
              defaultColor={{
                color: DEFUALT_HR_COLOR,
                title: toolbar.defaultColor,
              }}
              onSelect={color => editor.setColorHr(color, element)}
            >
              <SvgIcon iconClass='a' className='hr-icon-color'/>
            </ToolbarColorPicker>
          </Tooltip>
          <Tooltip content={toolbar.style} side="top" sideOffset={5} arrow={false}>
            <ToolbarDropdown
              onSelect={value => editor.setStyleHr(value as HrStyle, element)}
              value={element.style || DEFAULT_HR_STYLE}
              items={[
                {
                  value: 'dashed',
                  content: (
                    <div className='hr-dashed'>
                      <div className='hr-dashed-line' />
                    </div>
                  ),
                },
                {
                  value: 'solid',
                  content: (
                    <div className='hr-solid'>
                      <div className='hr-solid-line' />
                    </div>
                  ),
                },
                {
                  value: 'dotted',
                  content: (
                    <div className='hr-dotted'>
                      <div className='hr-dotted-line' />
                    </div>
                  ),
                },
                {
                  value: 'double',
                  content: (
                    <div className='hr-double'>
                      <div className='hr-double-line' />
                    </div>
                  ),
                },
              ]}
            >
              <StyleIcon className='hr-icon'/>
            </ToolbarDropdown>
          </Tooltip>
          <Tooltip content={toolbar.width} side="top" className='hr-drop' sideOffset={5} arrow={false}>
            <ToolbarDropdown
              onSelect={value => editor.setWidthHr(Number(value), element)}
              value={String(element.width || DEFAULT_HR_WIDTH)}
              items={[
                {
                  value: '1',
                  content: (
                    <div className='hr-one'>
                      <hr className='hr-one-line' />
                    </div>
                  ),
                },
                {
                  value: '2',
                  content: (
                    <div className='hr-two'>
                      <hr className='hr-two-line' />
                    </div>
                  ),
                },
                {
                  value: '4',
                  content: (
                    <div className='hr-three'>
                      <hr className='hr-three-line' />
                    </div>
                  ),
                },
                {
                  value: '6',
                  content: (
                    <div className='hr-four'>
                      <hr className='hr-four-line' />
                    </div>
                  ),
                },
              ]}
            >
              <ThicknessIcon className='hr-icon'/>
            </ToolbarDropdown>
          </Tooltip>
        </Toolbar>
      </PopoverContent>
    </Popover>
  )
}
