import { FC, useCallback } from 'react'
import { Editable, useEditable } from '@editablejs/editor'
import { Grid } from '@editablejs/models'
import {
  FontSizeEditor,
  FontColorEditor,
  BackgroundColorEditor,
  HeadingEditor,
  BlockquoteEditor,
  OrderedListEditor,
  UnorderedListEditor,
  HeadingType,
  MarkFormat,
  MarkEditor,
  TaskListEditor,
  TableEditor,
  LinkEditor,
  ImageEditor,
  HrEditor,
  AlignEditor,
  AlignKeys,
  LeadingEditor,
  CodeBlockEditor,
} from '@editablejs/plugins'
import { HistoryEditor } from '@editablejs/plugin-history'
import { ToolbarItem } from '@editablejs/plugin-toolbar'
import { Icon, IconMap, ToolbarButton } from '@editablejs/ui'
import { useMathViewer } from '../pages/plugins/math/hooks/use-math-viewer'
import { FuncIcon } from './FuncIcon'
import { Button, SvgIcon } from '../pages/components'
import React from 'react'

export const AlignDropdown: FC = () => {
  const editor = useEditable()
  const getAlign = useCallback(() => {
    const value = AlignEditor.queryActive(editor)
    switch (value) {
      case 'center':
        return 'alignCenter'
      case 'right':
        return 'alignRight'
      case 'justify':
        return 'alignJustify'
    }
    return 'alignLeft'
  }, [editor])
  const name: keyof typeof IconMap = getAlign()
  return <Icon name={name} />
}

// const marks: MarkFormat[] = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'sub', 'sup']
const marks: MarkFormat[] = ['bold', 'italic', 'underline', 'strikethrough']
const marksText: string[] = ['加粗', '斜体', '下划线', '删除线', '代码块', '上标', '下标']
export const defaultFontColor = '#262626'
export const defaultBackgroundColor = 'transparent'

const MathButton: FC = () => {
  const viewer = useMathViewer();
  return (
    <ToolbarButton title="函数"
      icon={<FuncIcon />}
      onToggle={() => {
        viewer.open();
      }} />
  )
}

export const createToolbarItems = (editor: Editable, menus: ToolbarItem[] = []) => {
  const items: ToolbarItem[] = [
    {
      type: 'button',
      title: <span className='t-undo'>返回</span>,
      disabled: !HistoryEditor.canUndo(editor),
      icon: <Icon name="undo" />,
      onToggle: () => {
        HistoryEditor.undo(editor)
      },
    },
    {
      type: 'button',
      title: <span className='t-redo'>前进</span>,
      disabled: !HistoryEditor.canRedo(editor),
      icon: <Icon name="redo" />,
      onToggle: () => {
        HistoryEditor.redo(editor)
      },
    },
  ]
  // const markItems: ToolbarItem[] = marks.map((mark, idx) => ({
  //   type: 'button',
  //   title: <span className='t-mark'>{marksText[idx]}</span>,
  //   active: MarkEditor.isActive(editor, mark),
  //   icon: <Icon name={mark} />,
  //   onToggle: () => {
  //     MarkEditor.toggle(editor, mark)
  //   },
  // }))
  items.push('separator')
  items.push({
    type: 'button',
    title: <span className='t-mark'>加粗</span>,
    active: MarkEditor.isActive(editor, 'bold'),
    icon: <SvgIcon iconClass='bold' />,
    onToggle: () => {
      MarkEditor.toggle(editor, 'bold')
    },
  })
  items.push({
    type: 'button',
    title: <span className='t-mark'>斜体</span>,
    active: MarkEditor.isActive(editor, 'italic'),
    icon: <SvgIcon iconClass='italic' />,
    onToggle: () => {
      MarkEditor.toggle(editor, 'italic')
    },
  })
  items.push({
    type: 'button',
    title: <span className='t-mark'>下划线</span>,
    active: MarkEditor.isActive(editor, 'underline'),
    icon: <SvgIcon iconClass='underline' className='size-2' />,
    onToggle: () => {
      MarkEditor.toggle(editor, 'underline')
    },
  })
  items.push({
    type: 'button',
    title: <span className='t-mark'>删除线</span>,
    active: MarkEditor.isActive(editor, 'strikethrough'),
    icon: <SvgIcon iconClass='strikethrough' className='size-3' />,
    onToggle: () => {
      MarkEditor.toggle(editor, 'strikethrough')
    },
  })


  // items.push('separator', ...markItems)
  items.push(
    'separator',
    {
      type: 'color-picker',
      defaultValue: '#F5222D',
      defaultColor: {
        color: defaultFontColor,
        title: <span className='t-color'>默认颜色</span>,
      },
      title: <span className='t-font-color'>字体颜色</span>,
      children: <SvgIcon iconClass='a' />,
      onSelect: (color: string) => {
        FontColorEditor.toggle(editor, color)
      },
      renderButton: (props: {
        type: 'button' | 'arrow';
        children: React.ReactNode;
      }) => {
        if (props.type==='arrow') {
          return <div className='d-center'><Button className='angle-button color-gray'><SvgIcon iconClass='angle' className='size-1'/></Button></div>
        }
        return <div className='tb-f'>{props.children}</div>
      }
    },
    {
      type: 'color-picker',
      defaultValue: '#FADB14',
      defaultColor: {
        color: defaultBackgroundColor,
        title: <span className='t-color'>无颜色</span>,
      },
      title: <span className='t-bg-color'>背景色</span>,
      children: <Icon name="backgroundColor" className='svg-size-2'/>,
      onSelect: (color: string) => {
        BackgroundColorEditor.toggle(editor, color)
      },
      renderButton: (props: {
        type: 'button' | 'arrow';
        children: React.ReactNode;
      }) => {
        if (props.type==='arrow') {
          return <div className='d-center'><Button className='angle-button color-gray'><SvgIcon iconClass='angle' className='size-1'/></Button></div>
        }
        return <div>{props.children}</div>
      }
    },
  )
  items.push(
    'separator',
    {
      type: 'dropdown',
      title: <span className='t-font-size'>字体大小</span>,
      items: [
        {
          value: '14'
        },
        {
          value: '16',
        },
        {
          value: '20',
        },
        {
          value: '22',
        },
        {
          value: '24',
        },
        {
          value: '28',
        },
      ],
      value: parseInt(FontSizeEditor.queryActive(editor) ?? '14')+'',
      onSelect: (value: string) => {
        FontSizeEditor.toggle(editor, value+'px')
      },
    },
    {
      type: 'dropdown',
      title: <span className='t-paragraph'>段落格式</span>,
      items: [
        {
          value: 'paragraph',
          content: <span className='paragraph'>正文</span>,
        },
        {
          value: 'heading-one',
          content: <span className='h-one'>标题 1</span>,
        },
        {
          value: 'heading-two',
          content: <span className='h-one'>标题 2</span>,
        },
        {
          value: 'heading-three',
          content: <span className='h-one'>标题 3</span>,
        },
        {
          value: 'heading-four',
          content: <span className='h-one'>标题 4</span>,
        },
        {
          value: 'heading-five',
          content: <span className='h-one'>标题 5</span>,
        },
        {
          value: 'heading-six',
          content: <span className='h-one'>标题 6</span>,
        },
      ],
      value: HeadingEditor.queryActive(editor) ?? 'paragraph',
      onSelect: value => {
        HeadingEditor.toggle(editor, value as HeadingType)
      },
    },
  )
  items.push(
    'separator',
    {
      type: 'button',
      title: <span className='t-link'>超链接</span>,
      active: LinkEditor.isActive(editor),
      onToggle: () => {
        LinkEditor.open(editor)
      },
      icon: <Icon name="link" />,
    },
    {
      type: 'button',
      title: <span className='t-image'>图片</span>,
      active: ImageEditor.isActive(editor),
      onToggle: () => {
        ImageEditor.open(editor)
      },
      icon: <Icon name="image" />,
    },
    {
      type: 'button',
      title: <span className='t-blockquote'>引用块</span>,
      active: BlockquoteEditor.isActive(editor),
      onToggle: () => {
        BlockquoteEditor.toggle(editor)
      },
      icon: <Icon name="blockquote" />,
    },
    {
      type: 'button',
      title: <span className='t-no-order'>无序列表</span>,
      active: !!UnorderedListEditor.queryActive(editor),
      onToggle: () => {
        UnorderedListEditor.toggle(editor)
      },
      icon: <Icon name="unorderedList" />,
    },
    {
      type: 'button',
      title: <span className='t-order'>有序列表</span>,
      active: !!OrderedListEditor.queryActive(editor),
      onToggle: () => {
        OrderedListEditor.toggle(editor)
      },
      icon: <Icon name="orderedList" />,
    },
    {
      type: 'button',
      title: <span className='t-task-order'>任务列表</span>,
      active: !!TaskListEditor.queryActive(editor),
      onToggle: () => {
        TaskListEditor.toggle(editor)
      },
      icon: <Icon name="taskList" />,
    },
    {
      type: 'button',
      title: <span className='t-table'>表格</span>,
      disabled: !!TableEditor.isActive(editor),
      onToggle: () => {
        TableEditor.insert(editor)
      },
      icon: <Icon name="table" />,
    },
    {
      content: <MathButton></MathButton>
      // type: 'button',
      // title:  <span className='t-table'>公式</span>,
      // disabled: !!TableEditor.isActive(editor),
      // renderButton: () => {

      // },
      // onToggle: () => {
      //   MathMLEditor.insert(editor, 'sss')
      // },
      // icon: <Icon name="table" />,
    } as any,
    'separator',
    {
      type: 'dropdown',
      title: <span className='t-align'>对齐</span>,
      items: [
        {
          value: 'left',
          content: (
            <div tw="flex gap-1 items-center">
              <Icon name="alignLeft" />
              <span className='t-align-item'>左对齐</span>
            </div>
          ),
        },
        {
          value: 'center',
          content: (
            <div tw="flex gap-1 items-center">
              <Icon name="alignCenter" />
              <span className='t-align-item'>居中对齐</span>
            </div>
          ),
        },
        {
          value: 'right',
          content: (
            <div tw="flex gap-1 items-center">
              <Icon name="alignRight" />
              <span className='t-align-item'>右对齐</span>
            </div>
          ),
        },
        {
          value: 'justify',
          content: (
            <div tw="flex gap-1 items-center">
              <Icon name="alignJustify" />
              <span className='t-align-item'>两端对齐</span>
            </div>
          ),
        },
      ],
      children: <AlignDropdown />,
      value: AlignEditor.queryActive(editor),
      onSelect: value => {
        AlignEditor.toggle(editor, value as AlignKeys)
      },
    },
    {
      type: 'dropdown',
      title: <span className='t-leading'>行高</span>,
      items: [
        {
          value: 'default',
          content: '默认',
        },
        {
          value: '1',
        },
        {
          value: '1.15',
        },
        {
          value: '1.5',
        },
        {
          value: '2',
        },
        {
          value: '3',
        },
        {
          value: '4',
        },
      ],
      value: LeadingEditor.queryActive(editor) ?? 'default',
      children: <Icon name="leading" />,
      onSelect: value => {
        LeadingEditor.toggle(editor, value === 'default' ? undefined : value)
      },
    },
    {
      type: 'button',
      title: <span className='t-hr'>分割线</span>,
      active: HrEditor.isActive(editor),
      onToggle: () => {
        HrEditor.insert(editor)
      },
      icon: <Icon name="hr" />,
    },
    'separator',
    {
      type: 'button',
      title: <span className='t-code'>代码块</span>,
      active: CodeBlockEditor.isActive(editor),
      onToggle: () => {
        CodeBlockEditor.insert(editor)
      },
      icon: <Icon name="codeBlock" />,
    },
  )

  const grid = Grid.above(editor)
  if (grid) {
    items.push(
      'separator',
      {
        type: 'button',
        title: <span className='merge-cells'>合并单元格</span>,
        disabled: !Grid.canMerge(editor, grid),
        onToggle: () => {
          Grid.mergeCell(editor, grid)
        },
        icon: <Icon name="tableMerge" />,
      },
      {
        type: 'button',
        title: <span className='split-cells'>拆分单元格</span>,
        icon: <Icon name="tableSplit" />,
        disabled: !Grid.canSplit(editor, grid),
        onToggle: () => {
          Grid.splitCell(editor, grid)
        },
      }
    )
  }
  items.push(...menus)
  return items
}
