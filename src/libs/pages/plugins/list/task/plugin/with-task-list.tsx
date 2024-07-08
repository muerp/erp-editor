import { RenderElementProps, ElementAttributes, Editable, Hotkey } from '@editablejs/editor'
import { Transforms, List } from '@editablejs/models'
import { renderList } from '../../styles'
import { DATA_TASK_CHECKED_KEY, TASK_LIST_KEY } from '../constants'
import { TaskList } from '../interfaces/task-list'
import { TaskListHotkey, TaskListOptions } from '../options'
import { TaskListEditor, ToggleTaskListOptions } from './task-list-editor'
import { withShortcuts } from './with-shortcuts'
import React from 'react'

const defaultHotkey: TaskListHotkey = 'mod+shift+9'

interface TaskProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

interface RenderTaskElementProps extends RenderElementProps {
  attributes: ElementAttributes & Partial<Record<typeof DATA_TASK_CHECKED_KEY, boolean>>
}
const TaskElement = ({ checked, onChange }: TaskProps) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <span className="task-cehck-box" onMouseDown={handleMouseDown} onClick={() => onChange(!checked)}>
      <span className='task-cehck-box-inner' />
    </span>
  )
}


export const withTaskList = <T extends Editable>(editor: T, options: TaskListOptions = {}) => {
  const hotkey = options.hotkey || defaultHotkey

  const newEditor = editor as T & TaskListEditor

  const { renderElement } = newEditor

  newEditor.renderElement = (props: RenderTaskElementProps) => {
    const { element, attributes, children } = props
    if (TaskListEditor.isTaskList(newEditor, element)) {
      attributes[DATA_TASK_CHECKED_KEY] = element.checked ?? false
      return renderList(newEditor, {
        props: {
          element,
          attributes,
          children,
        },
        className: 'task-style',
        onRenderLabel: element => {
          const { checked } = element as TaskList
          const onChange = (checked: boolean) => {
            if (Editable.isReadOnly(editor)) return
            Transforms.setNodes<TaskList>(
              editor,
              { checked },
              { at: Editable.findPath(editor, element) },
            )
          }
          return <TaskElement checked={checked ?? false} onChange={onChange} />
        },
        isAutoUpdateLabelStyle: false,
      })
    }
    return renderElement(props)
  }

  newEditor.toggleTaskList = (options: ToggleTaskListOptions = {}) => {
    const activeElements = TaskListEditor.queryActive(editor)
    if (activeElements) {
      List.unwrapList(editor, {
        match: n => n.type === TASK_LIST_KEY,
      })
    } else {
      const { checked, template } = options
      List.wrapList<TaskList>(editor, {
        type: TASK_LIST_KEY,
        template,
        checked: checked ?? false,
      })
    }
  }

  const { onKeydown, isList } = newEditor

  newEditor.isList = (value: any): value is List => {
    return TaskListEditor.isTaskList(newEditor, value) || isList(value)
  }

  newEditor.onKeydown = (e: KeyboardEvent) => {
    if (Hotkey.match(hotkey, e)) {
      e.preventDefault()
      newEditor.toggleTaskList()
      return
    }
    onKeydown(e)
  }

  const { shortcuts } = options
  if (shortcuts !== false) {
    withShortcuts(newEditor)
  }

  return newEditor
}
