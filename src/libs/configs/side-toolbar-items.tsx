import { Editable } from '@editablejs/editor'
import { Editor, Range, Element } from '@editablejs/models'
import {
  TableEditor,
  BlockquoteEditor,
  UnorderedListEditor,
  OrderedListEditor,
  TaskListEditor,
  ImageEditor,
} from '@editablejs/plugins'
import { SideToolbarItem } from '@editablejs/plugin-toolbar/side'
import { Icon } from '@editablejs/ui'
// import React from 'react'

export const createSideToolbarItems = (editor: Editable, range: Range, element: Element) => {
  const items: SideToolbarItem[] = []
  const isEmpty = Editor.isEmpty(editor, element)
  if (isEmpty) {
    items.push(
      {
        key: 'image',
        icon: <Icon name="image" />,
        title: <span className='t-image'>图片</span>,
        onSelect: () => {
          ImageEditor.open(editor)
        },
      },
      {
        key: 'table',
        icon: <Icon name="table" />,
        title: <span className='t-table'>表格</span>,
        disabled: !!TableEditor.isActive(editor),
        onSelect: () => {
          TableEditor.insert(editor)
        },
      },
      {
        key: 'blockquote',
        icon: <Icon name="blockquote" />,
        title: <span className='t-blockquote'>引用块</span>,
        onSelect: () => {
          BlockquoteEditor.toggle(editor)
        },
      },
      {
        key: 'unorderedList',
        icon: <Icon name="unorderedList" />,
        title: <span className='t-no-order'>无序列表</span>,
        onSelect: () => {
          UnorderedListEditor.toggle(editor)
        },
      },
      {
        key: 'orderedList',
        icon: <Icon name="orderedList" />,
        title: <span className='t-order'>有序列表</span>,
        onSelect: () => {
          OrderedListEditor.toggle(editor)
        },
      },
      {
        key: 'taskList',
        icon: <Icon name="taskList" />,
        title: <span className='t-task-order'>任务列表</span>,
        onSelect: () => {
          TaskListEditor.toggle(editor)
        },
      },
    )
  } else {
    items.push(
      {
        key: 'cut',
        icon: <Icon name="cut" />,
        title: <span className='t-cut'>剪切</span>,
        onSelect() {
          editor.cut(range)
        },
      },
      {
        key: 'copy',
        icon: <Icon name="copy" />,
        title: <span className='t-copy'>复制</span>,
        onSelect() {
          editor.copy(range)
        },
      },
    )
  }

  return items
}
