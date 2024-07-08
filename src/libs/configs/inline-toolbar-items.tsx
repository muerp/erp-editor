import { Editable } from '@editablejs/editor'
import { Editor, Grid } from '@editablejs/models'
// import { ToolbarItem } from '@editablejs/plugin-toolbar'
import { AlignConfig, AlignEditor, BackgroundColorEditor, BulletedList, FontColorEditor, FontFamily, FontFamilyEditor, FontFamilyText, FontSize, FontSizeEditor, HeadingEditor, HrEditor, ImageEditor, IndentEditor, LeadingEditor, LineHeightConfig, LinkEditor, MarkEditor, NumberedList, OrderedListEditor, Paragraph, ParagraphText, SectionConfig, TableEditor, ToolbarItem, ToolbarOptions, UnorderedListEditor, defaultFamily, defaultFontColor } from '../../libs/pages/plugins'
import { ShortcutKey } from '../../libs/pages/plugins/window'
import { HistoryEditor } from '@editablejs/plugin-history'
import { ClearFormatEditor } from '../../libs/pages/plugins/clear-format'
import { MarginEditor } from '../../libs/pages/plugins/margin'
import { MathMLEditor } from '../../libs/pages/plugins/math'
import { MList } from '../../libs/pages/plugins/toolbar/list'
export const createInlineToolbarItems = (editor: Editable, 
  { accentColor, majorContentColor, provenances, onChange, imageBase64, isReadOnly }: ToolbarOptions) => {

    if (isReadOnly) {
        return [
            {
                type: 'button',
                icon: 'copy',
                className: 't-12',
                title: '复制',
                onToggle: () => {
                    (editor as Editable).copy()
                    onChange && onChange('copy')
                },
            }
        ]
    }
    const items: ToolbarItem[] =  [
      {
          icon: 'bold',
          type: 'button',
          title: ShortcutKey["cmd+b"].title,
          method: ShortcutKey["cmd+b"].key,
          active: MarkEditor.isActive(editor, 'bold'),
          onToggle: () => {
              MarkEditor.toggle(editor, 'bold')
          }
      },
      {
          icon: 'a',
          type: 'button',
          title: ShortcutKey["cmd+2"].title,
          method: ShortcutKey["cmd+2"].key,
          active: BackgroundColorEditor.queryActive(editor) === (accentColor || '#f4e6b9'),
          className: 't-1',
          onToggle: () => {
              if (BackgroundColorEditor.queryActive(editor) === (accentColor || '#f4e6b9')) {
                  BackgroundColorEditor.toggle(editor, 'transparent')
              } else {
                  BackgroundColorEditor.toggle(editor, '#f4e6b9')
              }
          }
      },
      {
          icon: 'a',
          type: 'button',
          title: ShortcutKey["cmd+1"].title,
          method: ShortcutKey["cmd+1"].key,
          active: FontColorEditor.queryActive(editor) === (majorContentColor || '#f4e6b9'),
          className: 't-2',
          onToggle: () => {
              if (FontColorEditor.queryActive(editor) === (majorContentColor || '#de4e4e')) {
                  FontColorEditor.toggle(editor, '#000')
              } else {
                  FontColorEditor.toggle(editor, '#de4e4e')
              }
          }
      },
      {
          type: 'select',
          className: 't-5',
          title: '段落格式',
          value: ParagraphText[HeadingEditor.queryActive(editor) || 'paragraph'] || '正文',
          active: HeadingEditor.queryActive(editor) || 'paragraph',
          width: 110,
          valueWidth: 72,
          list: Paragraph,
          onToggle: item => {
              HeadingEditor.toggle(editor, item.value)
          }
      },
      {
          type: 'button',
          icon: 'italic',
          method: ShortcutKey["cmd+i"].key,
          title: ShortcutKey["cmd+i"].title,
          active: MarkEditor.isActive(editor, 'italic'),
          onToggle: () => {
              MarkEditor.toggle(editor, 'italic')
          },
      },
      {
          type: 'button',
          icon: 'underline',
          method: ShortcutKey["cmd+u"].key,
          title: ShortcutKey["cmd+u"].title,
          active: MarkEditor.isActive(editor, 'underline'),
          onToggle: () => {
              MarkEditor.toggle(editor, 'underline')
          },
      },
      {
          type: 'button',
          icon: 'strikethrough',
          title: '删除线',
          active: MarkEditor.isActive(editor, 'strikethrough'),
          onToggle: () => {
              MarkEditor.toggle(editor, 'strikethrough')
          },
      },
      {
          type: 'separator'
      },
      {
          type: 'select',
          className: 't-5',
          title: '字体',
          value: FontFamilyText[FontFamilyEditor.queryActive(editor) || defaultFamily],
          active: FontFamilyEditor.queryActive(editor) || defaultFamily,
          list: FontFamily,
          onToggle: item => {
              FontFamilyEditor.toggle(editor, item.value)
          }
      },
      {
          type: 'select',
          className: 't-6',
          title: '字体大小',
          value: parseInt(FontSizeEditor.queryActive(editor) || '14') + '',
          active: FontSizeEditor.queryActive(editor) ?? '14px',
          list: FontSize,
          width: 60,
          valueWidth: 60,
          onToggle: item => {
              FontSizeEditor.toggle(editor, item.value)
          }
      },
      {
          type: 'separator'
      },
      {
          type: 'color',
          icon: 'a',
          method: ShortcutKey["cmd+alt+ç"].key,
          defaultColor: defaultFontColor,
          color: FontColorEditor.queryActive(editor) || defaultFontColor,
          className: 't-7',
          title: ShortcutKey["cmd+alt+ç"].title,
          onToggle: (color) => {
              FontColorEditor.toggle(editor, color);
          }
      },
      {
          type: 'color',
          icon: 'bg',
          method: ShortcutKey["cmd+alt+˙"].key,
          defaultColor: defaultFontColor,
          color: BackgroundColorEditor.queryActive(editor) || '',
          className: 't-7 t-8',
          title: ShortcutKey["cmd+alt+˙"].title,
          onToggle: (color) => {
              BackgroundColorEditor.toggle(editor, color || 'transparent');
          }
      },
      {
          type: 'button',
          icon: 'clear',
          method: ShortcutKey["cmd+\\"].key,
          title: ShortcutKey["cmd+\\"].title,
          onToggle: () => {
              ClearFormatEditor.clear(editor);
          },
      },
      {
          type: 'button',
          icon: 'cc',
          method: ShortcutKey["cmd+4"].key,
          title: ShortcutKey["cmd+4"].title,
          onToggle: () => {
              if (provenances.length > 1) {
                  editor.insertText(provenances[0].title)
              } else {
                  onChange && onChange('editor-provenance')
              }
          },
      },
      {
          type: 'select',
          title: '出处',
          list: provenances,
          maxWidth: 200,
          className: 'toolbar-angle-button',
          hideValue: true,
          onToggle: item => {
              if (item.type) {
                  onChange && onChange('editor-provenance')
              } else {
                  editor.insertText(item.title)
              }
          }
      },
      {
          type: 'separator'
      },
      {
          type: 'button',
          icon: 'img',
          className: 't-10',
          title: '插入图片',
          onToggle: () => {
              if (imageBase64) {
                  ImageEditor.open(editor)
              } else {
                  onChange && onChange('editor-image')
              }
          },
      },
      {
          type: 'button',
          icon: 'func',
          className: 't-9',
          title: '插入函数',
          onToggle: () => {
              MathMLEditor.open(editor);
          },
      },
      {
          type: 'button',
          icon: 'table',
          className: 't-9',
          title: '插入函数',
          disabled: !!Grid.above(editor),
          onToggle: () => {
              TableEditor.insert(editor)
          },
      },
      {
          type: 'button',
          icon: 'indent',
          className: 't-10',
          title: ShortcutKey["cmd+]"].title,
          method: ShortcutKey["cmd+]"].key,
          onToggle: () => {
              const entry = Editor.above(editor);
              if (entry) {
                  IndentEditor.addLineIndent(editor, entry[1])
              }
          },
      },
      {
          type: 'select',
          title: '行间距',
          icon: 'line-height',
          list: LineHeightConfig,
          className: 't-11',
          hideValue: true,
          width: 60,
          valueWidth: 38,
          direction: 'bottom-left',
          active: LeadingEditor.queryActive(editor) ?? 'default',
          onToggle: item => {
              LeadingEditor.toggle(editor, item.value === 'default' ? undefined : item.value)
          }
      },
      {
          type: 'select',
          title: '段间距',
          icon: 'dj',
          list: SectionConfig,
          className: 't-9',
          hideValue: true,
          width: 60,
          valueWidth: 38,
          direction: 'bottom-left',
          active: MarginEditor.queryActiveEnd(editor) || '0',
          onToggle: item => {
              MarginEditor.toggleMarginEnd(editor, item.value)
          }
      },
      {
          type: 'separator'
      },
      {
          type: 'select',
          title: '对齐方式',
          icon: 'left',
          list: AlignConfig,
          className: 't-3',
          hideValue: true,
          valueWidth: 38,
          layout: 'row',
          direction: 'bottom-right',
          active: AlignEditor.queryActive(editor) || 'left',
          onToggle: item => {
              AlignEditor.toggle(editor, item.value)
          }
      },
      {
          type: 'button',
          icon: 'order',
          title: ShortcutKey["cmd+shift+7"].title,
          method: ShortcutKey["cmd+shift+7"].key,
          onToggle: () => {
              const p = OrderedListEditor.queryActive(editor);
              if (p) {
                  OrderedListEditor.toggle(editor);
              } else {
                  MList.wrapList(editor, {
                      type: 'ordered-list'
                  })
              }
          },
      },
      {
          type: 'select',
          title: '有序列表',
          list: NumberedList,
          className: 'toolbar-angle-button',
          hideValue: true,
          active: {
              get value() {
                  const p = OrderedListEditor.queryActive(editor);

                  if (p && p.length > 0) {
                      return (p[0][0] as any).level
                  }
                  return '';
              }
          },
          onToggle: item => {
              const entry = OrderedListEditor.queryActive(editor);
              let isChange = true;
              if (entry) {
                  const [node] = entry;
                  if (node[0].level === item.value) {
                      isChange = false;
                      OrderedListEditor.toggle(editor);
                  }
              }
              if (isChange) {
                  MList.wrapList(editor, {
                      type: 'ordered-list',
                      level: item.value,
                  })
              }
          }
      },
      {
          type: 'button',
          icon: 'order',
          title: ShortcutKey["cmd+shift+7"].title,
          method: ShortcutKey["cmd+shift+7"].key,
          onToggle: () => {
              const p = OrderedListEditor.queryActive(editor);
              if (p) {
                  OrderedListEditor.toggle(editor);
              } else {
                  MList.wrapList(editor, {
                      type: 'ordered-list'
                  })
              }
          },
      },
      {
          type: 'select',
          title: '无序列表',
          list: BulletedList,
          className: 'toolbar-angle-button',
          hideValue: true,
          active: {
              get value() {
                  const p = UnorderedListEditor.queryActive(editor);
                  if (p && p.length > 0) {
                      return (p[0][0] as any).level
                  }
                  return '';
              }
          },
          onToggle: item => {
              const entry = UnorderedListEditor.queryActive(editor);
              let isChange = true;
              if (entry) {
                  const [node] = entry;
                  if (node[0].level === item.value) {
                      isChange = false;
                      UnorderedListEditor.toggle(editor);
                  }
              }
              if (isChange) {
                  MList.wrapList(editor, {
                      type: 'unordered-list',
                      level: item.value,
                  })
              }
          }
      },
      {
          type: 'separator'
      },
      {
          type: 'button',
          icon: 'line',
          className: 't-9',
          title: '插入水平线',
          active: HrEditor.isActive(editor),
          onToggle: () => {
              HrEditor.insert(editor)
          },
      },
      {
          type: 'button',
          icon: 'link',
          className: 't-9',
          title: ShortcutKey["cmd+k"].title,
          method: ShortcutKey["cmd+k"].key,
          active: LinkEditor.isActive(editor),
          onToggle: () => {
              LinkEditor.open(editor)
          },
      },
      {
          type: 'button',
          icon: 'undo',
          className: 't-9',
          title: ShortcutKey["cmd+z"].title,
          method: ShortcutKey["cmd+z"].key,
          disabled: !HistoryEditor.canUndo(editor),
          onToggle: () => {
              if (HistoryEditor.canUndo(editor)) {
                  HistoryEditor.undo(editor)
              }
          },
      },
      {
          type: 'button',
          icon: 'redo',
          className: 't-9',
          title: ShortcutKey["cmd+shift+z"].title,
          method: ShortcutKey["cmd+shift+z"].key,
          disabled: !HistoryEditor.canRedo(editor),
          onToggle: () => {
              if (HistoryEditor.canRedo(editor)) {
                  HistoryEditor.redo(editor)
              }
          },
      },
      {
          type: 'button',
          icon: 'cut',
          className: 't-12',
          title: '剪切',
          onToggle: () => {
              (editor as Editable).cut()
              onChange && onChange('cut')
          },
      },
      {
          type: 'button',
          icon: 'copy',
          className: 't-12',
          title: '复制',
          onToggle: () => {
              (editor as Editable).copy()
              onChange && onChange('copy')
          },
      },
      {
          type: 'button',
          icon: 'zz',
          className: 't-11',
          title: '中转',
          onToggle: () => {
              onChange && onChange('transit')
          },
      },
      {
          type: 'button',
          icon: 'sd',
          className: 't-11',
          title: '闪念',
          onToggle: () => {
              onChange && onChange('idea')
          },
      },
      {
          type: 'button',
          icon: 'set',
          className: 't-11',
          title: '更多',
          onToggle: () => {
              onChange && onChange('more')
          },
      },
  ]
  const grid = Grid.above(editor);
  if (grid) {
      items.push(...[
          {
              type: 'separator'
          },
          {
              type: 'button',
              icon: 'merge',
              className: 't-11',
              title: '合并单元格',
              disabled: !Grid.canMerge(editor, grid),
              onToggle: () => {
                  Grid.mergeCell(editor, grid)
              },
          },
          {
              type: 'button',
              icon: 'split',
              className: 't-11',
              title: '拆分单元格',
              disabled: !Grid.canSplit(editor, grid),
              onToggle: () => {
                  Grid.splitCell(editor, grid)
              },
          },
      ])
  }

  return items
}
