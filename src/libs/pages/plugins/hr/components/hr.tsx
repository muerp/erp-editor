import { RenderElementProps, useNodeFocused, useReadOnly } from '@editablejs/editor'
import { FC } from 'react'
import { HrEditor } from '../plugin/hr-editor'
import { Hr } from '../interfaces/hr'
import { HrPopover } from './hr-popover'
import { DEFAULT_HR_STYLE, DEFAULT_HR_WIDTH, DEFUALT_HR_COLOR } from '../constants'

export interface HrProps extends RenderElementProps<Hr> {
  editor: HrEditor
  element: Hr
}

export const HrComponent: FC<HrProps> = ({ children, attributes, editor, element }) => {
  const focused = useNodeFocused()
  const [readOnly] = useReadOnly()
  const { color = DEFUALT_HR_COLOR, width = DEFAULT_HR_WIDTH, style = DEFAULT_HR_STYLE } = element
  return (
    <HrPopover editor={editor} element={element}>
      <div className={`hr-p${!readOnly? ' hr-bover-bg':''}${focused && !readOnly? ' hr-focused-bg':''}`}
        {...attributes}
      >
        <hr
          style={{ borderTop: `${width}px ${style} ${color}`}}
        />

        <div className="hidden absolute">{children}</div>
      </div>
    </HrPopover>
  )
}
