import { Editable } from '@editablejs/editor'
import {
  TableEditor,
  BlockquoteEditor,
  UnorderedListEditor,
  OrderedListEditor,
  TaskListEditor,
  ImageEditor,
} from '@editablejs/plugins'
import { SlashToolbarItem } from '@editablejs/plugin-toolbar/slash'
import { Icon } from '@editablejs/ui'

export const createSlashToolbarItems = (editor: Editable, value: string) => {
  const items: (SlashToolbarItem & { search?: string })[] = []
  items.push(
    {
      key: 'image',
      icon: <Icon name="image" />,
      title: <span className='t-image'>图片</span>,
      search: 'image,图片',
      onSelect: () => {
        ImageEditor.open(editor)
      },
    },
    {
      key: 'table',
      icon: <Icon name="table" />,
      title: <span className='t-table'>表格</span>,
      disabled: !!TableEditor.isActive(editor),
      search: 'table,表格',

      onSelect: () => {
        TableEditor.insert(editor)
      },
    },
    {
      key: 'blockquote',
      icon: <Icon name="blockquote" />,
      title: <span className='t-blockquote'>引用块</span>,
      search: 'blockquote,引用',
      onSelect: () => {
        BlockquoteEditor.toggle(editor)
      },
    },
    {
      key: 'unorderedList',
      icon: <Icon name="unorderedList" />,
      title: <span className='t-no-order'>无序列表</span>,
      search: 'list,unordered,无序列表',
      onSelect: () => {
        UnorderedListEditor.toggle(editor)
      },
    },
    {
      key: 'orderedList',
      icon: <Icon name="orderedList" />,
      title: <span className='t-order'>有序列表</span>,
      search: 'list,ordered,有序列表',
      onSelect: () => {
        OrderedListEditor.toggle(editor)
      },
    },
    {
      key: 'taskList',
      icon: <Icon name="taskList" />,
      title: <span className='t-task-order'>任务列表</span>,
      search: 'list,task,任务列表',
      onSelect: () => {
        TaskListEditor.toggle(editor)
      },
    },
  )

  return items.filter(item => {
    if ('content' in item || 'type' in item) return true
    if (item.disabled) return false
    return item.search?.includes(value)
  })
}
