import { Editable } from '@editablejs/editor'
import {Toolbar, ToolbarProps} from './components/toolbar'
import { useToolbarItems } from './store'
import { forwardRef } from 'react'

export interface ToolbarComponentProps extends Omit<ToolbarProps, 'items'> {
  editor: Editable
  items?: ToolbarProps['items']
}

export const ToolbarComponent =  forwardRef(({
  editor,
  items: itemsProp,
  ...props
}: ToolbarComponentProps, ref: any) => {
  const items = useToolbarItems(editor)

  return <Toolbar items={itemsProp || items} {...props} ref={ref}/>
})

export const ToolbarMobileComponent = forwardRef(({
  editor,
  items: itemsProp,
  ...props
}: ToolbarComponentProps, ref: any) => {
  const items = useToolbarItems(editor)

  return <Toolbar items={itemsProp || items} {...props} ref={ref}/>
})