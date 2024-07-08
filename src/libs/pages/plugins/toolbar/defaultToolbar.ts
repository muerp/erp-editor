import { Editor, Grid, Node } from "@editablejs/models"
import { ShortcutKey } from "../window"
import { AlignEditor, BackgroundColorEditor, FontColorEditor, FontSizeEditor, HeadingEditor, HrEditor, ImageEditor, IndentEditor, LeadingEditor, LinkEditor, MarkEditor, TableEditor } from "@editablejs/plugins"
import { FontFamilyEditor, OrderedListEditor, UnorderedListEditor } from ".."
import { ClearFormatEditor } from "../clear-format"
import { MathMLEditor } from "../math"
import { MarginEditor } from "../margin"
import { MList } from "./list"
import { HistoryEditor } from "@editablejs/plugin-history"
import { Editable } from "@editablejs/editor"
import { ToolbarItem, ToolbarOptions } from './components/type'
import { TitleEditor } from "../title"
export const ParagraphText: { [key: string]: string } = {
    'paragraph': '正文',
    'heading-one': '标题1',
    'heading-two': '标题2',
    'heading-three': '标题3',
    'heading-four': '标题4',
    'heading-five': '标题5',
    'heading-six': '标题6',
}
export const Paragraph = [
    { title: '正文', className: 'toolbar-normal-text', value: 'paragraph' },
    { title: '标题1', className: 'toolbar-h1', value: 'heading-one' },
    { title: '标题2', className: 'toolbar-h2', value: 'heading-two' },
    { title: '标题3', className: 'toolbar-h3', value: 'heading-three' },
    { title: '标题4', className: 'toolbar-h4', value: 'heading-four' },
    // { title: '标题5', className: 'toolbar-h5', value: 'heading-five' },
    // { title: '标题6', className: 'toolbar-h6', value: 'heading-six' },
]
export const FontFamilyText: { [key: string]: string } = {
    "Arial,Helvetica,sans-serif": "Arail",
    "Georgia,serif": "Georgia",
    "Impact,Charcoal,sans-serif": "Impact",
    "ahoma,Geneva,sans-serif": "Tahoma",
    "'Times New Roman',Times,serif": "Times New Roman",
    "Verdana,Geneva,sans-serif": "Verdana",
    "SimSun": "宋体",
    "SimHei": "黑体",
    "Microsoft Yahei": "微软雅黑",
    "Microsoft JhengHei": "微软正黑体",
    "KaiTi": "楷体",
    "NSimSun": "新宋体",
    "FangSong": "仿宋"
}
export const defaultFamily = 'Arial,Helvetica,sans-serif'
export const FontFamily = [
    { title: 'Arail', value: 'Arial,Helvetica,sans-serif' },
    { title: 'Georgia', value: 'Georgia,serif' },
    { title: 'Impact', value: 'Impact,Charcoal,sans-serif' },
    { title: 'Tahoma', value: 'ahoma,Geneva,sans-serif' },
    { title: 'Times New Roman', value: "'Times New Roman',Times,serif" },
    { title: 'Verdana', value: 'Verdana,Geneva,sans-serif' },
    { title: '宋体', value: 'SimSun' },
    { title: '黑体', value: 'SimHei' },
    { title: '微软雅黑', value: 'Microsoft Yahei' },
    { title: '微软正黑体', value: 'Microsoft JhengHei' },
    { title: '楷体', value: 'KaiTi' },
    { title: '新宋体', value: 'NSimSun' },
    { title: '仿宋', value: 'FangSong' }
]
export const defaultFontColor = '#000'
export const defaultBackgroundColor = 'transparent'
export const FontSize = [
    { title: '12', value: '12px' },
    { title: '13', value: '13px' },
    { title: '14', value: '14px' },
    { title: '15', value: '17px' },
    { title: '16', value: '16px' },
    { title: '17', value: '17px' },
    { title: '18', value: '18px' },
    { title: '24', value: '24px' },
    { title: '30', value: '30px' },
    { title: '42', value: '42px' },
    { title: '48', value: '48px' },
    { title: '60', value: '60px' },
    { title: '72', value: '72px' },
    { title: '96', value: '96px' }
]


export const LineHeightConfig = [
    {
        value: 'default',
        title: '默认',
    },
    {
        title: '1',
        value: '1'
    },
    {
        title: '1.15',
        value: '1.15'
    },
    {
        title: '1.5',
        value: '1.5'
    },
    {
        title: '2',
        value: '2'
    },
    {
        title: '3',
        value: '3'
    },
    {
        title: '4',
        value: '4'
    },
]

export const SectionConfig = [
    {
        value: '0',
        title: '0',
    },
    {
        title: '0.4',
        value: '0.4rem'
    },
    {
        title: '0.6',
        value: '0.6rem'
    },
    {
        title: '默认',
        value: '0.8rem'
    },
    {
        title: '1.0',
        value: '1.0rem'
    },
    {
        title: '1.2',
        value: '1.2rem'
    }
]

export const AlignConfig = [
    {
        icon: 'left',
        value: 'left',
    },
    {
        icon: 'center',
        value: 'center',
    },
    {
        icon: 'right',
        value: 'right',
    },
    {
        icon: 'justify',
        value: 'justify',
    }
]

export const NumberedList = [
    { title: '默认', value: 0 },
    { title: 'a,b,c...', value: 1 },
    { title: 'α,β,γ...', value: 2 },
    { title: 'i,ii,iii...', value: 3 },
    { title: 'A,B,C...', value: 4 },
    { title: 'Ⅰ,Ⅱ,Ⅲ...', value: 5 },
]

export const BulletedList = [
    { title: '默认', value: 0 },
    { title: '○ 空心圆', value: 1 },
    { title: '■ 实心方块', value: 2 },
    { title: '★ 五角星', value: 3 }
]

// const CheckList = [
//     {title: '默认', value: 'bulleted-default'},
//     {title: '○ 空心圆', value: 'bulleted-one'},
//     {title: '● 实心圆', value: 'bulleted-two'},
//     {title: '■ 实心方块', value: 'bulleted-three'}
// ]

export const createToolbar = (
    editor: Editor,
    { accentColor, majorContentColor, provenances, onChange, imageBase64 }: ToolbarOptions, isMobile?:boolean
): ToolbarItem[] => {
    if (isMobile) {
        return [
            {
                type: 'button',
                icon: 'back',
                className: 't-9 back-view',
                onToggle: () => {
                    onChange && onChange('back');
                },
            },
            {
                type: 'button',
                icon: 'redo2',
                className: 't-9',
                disabled: !HistoryEditor.canUndo(editor),
                onToggle: () => {
                    if (HistoryEditor.canUndo(editor)) {
                        HistoryEditor.undo(editor)
                    }
                },
            },
            {
                type: 'button',
                icon: 'undo2',
                className: 't-9',
                disabled: !HistoryEditor.canRedo(editor),
                onToggle: () => {
                    if (HistoryEditor.canRedo(editor)) {
                        HistoryEditor.redo(editor)
                    }
                },
            },
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
            disabled: TitleEditor.isFocused(editor),
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
            method: 'select-font',
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
            method: 'select-cc',
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
            disabled: TitleEditor.isFocused(editor),
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
            disabled: TitleEditor.isFocused(editor),
            onToggle: () => {
                MathMLEditor.open(editor);
            },
        },
        {
            type: 'button',
            icon: 'table',
            className: 't-9',
            title: '插入表格',
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
            active: MarginEditor.queryActiveEnd(editor) || '0.8rem',
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
            disabled: TitleEditor.isFocused(editor),
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
            disabled: TitleEditor.isFocused(editor),
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
            title: ShortcutKey["cmd+shift+8"].title,
            method: ShortcutKey["cmd+shift+8"].key,
            disabled: TitleEditor.isFocused(editor),
            onToggle: () => {
                const p = UnorderedListEditor.queryActive(editor);
                if (p) {
                    UnorderedListEditor.toggle(editor);
                } else {
                    MList.wrapList(editor, {
                        type: 'unordered-list'
                    })
                }
            },
        },
        {
            type: 'select',
            title: '无序列表',
            list: BulletedList,
            className: 'toolbar-angle-button',
            disabled: TitleEditor.isFocused(editor),
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
                const selection= editor.selection;
                if (!selection) return;
                const range = { anchor: selection.anchor, focus: selection.focus }
                const fs = Editor.fragment(editor, range);
                
                const strs = fs.map(element => Node.string(element))
                onChange && onChange('transit', strs.join(' '))
            },
        },
        {
            type: 'button',
            icon: 'sd',
            className: 't-11',
            title: '闪念',
            onToggle: () => {
                const selection= editor.selection;
                if (!selection) return;
                const range = { anchor: selection.anchor, focus: selection.focus }
                const fs = Editor.fragment(editor, range);
                
                const strs = fs.map(element => Node.string(element))
                onChange && onChange('idea', strs.join(' '))
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
    return items;
}