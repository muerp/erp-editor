import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    EditableProvider,
    ContentEditable,
    useIsomorphicLayoutEffect,
    Placeholder,
    isTouchDevice,
    Editable,
    withEditable,
    parseDataTransfer,
    TEXT_HTML,
} from '@editablejs/editor'
import { WebsocketProvider } from '@editablejs/yjs-websocket'
import * as Y from 'yjs'

import {
    withYHistory,
    withYjs,
    YjsEditor,
    withYCursors,
    CursorData,
} from '@editablejs/plugin-yjs'
import { HistoryEditor, withHistory } from '@editablejs/plugin-history'
import randomColor from 'randomcolor'
import { Editor, createEditor, Transforms, Descendant, Grid } from '@editablejs/models'
import { useContextMenuEffect, ContextMenu, MentionUser, MarkEditor, FontColorEditor, BackgroundColorEditor, FontSizeEditor, HeadingEditor, LinkEditor, ImageEditor, BlockquoteEditor, UnorderedListEditor, OrderedListEditor, TaskListEditor, TableEditor, AlignEditor, HrEditor, CodeBlockEditor, LeadingEditor } from '@editablejs/plugins'
import { javascript as codemirrorJavascript } from '@codemirror/lang-javascript'
import { html as codemirrorHtml } from '@codemirror/lang-html'
import { css as codemirrorCss } from '@codemirror/lang-css'
import { TitleEditor } from '@editablejs/plugin-title'
import { withYCodeBlock } from '@editablejs/plugin-codeblock/yjs'
import {
    useInlineToolbarEffect,
    InlineToolbar,
    withInlineToolbar,
    ToolbarOptions,
} from './plugins'
import {
    defaultBackgroundColor,
    defaultFontColor,
} from '../configs/toolbar-items'
import {
    withSlashToolbar,
    useSlashToolbarEffect,
    SlashToolbar,
} from '@editablejs/plugin-toolbar/slash'
import {
    withSideToolbar,
} from '@editablejs/plugin-toolbar/side'
import { MarkdownDeserializer } from '@editablejs/deserializer/markdown'


import {
    withMarkdownDeserializerTransform,
    withMarkdownDeserializerPlugin,
} from '@editablejs/plugins/deserializer/markdown'
import {
    withMarkdownSerializerTransform,
    withMarkdownSerializerPlugin,
} from '@editablejs/plugins/serializer/markdown'

import { withHTMLSerializerTransform } from '@editablejs/plugins/serializer/html'
import { withTextSerializerTransform } from '@editablejs/plugins/serializer/text'
import { withHTMLDeserializerTransform } from '@editablejs/plugins/deserializer/html'
import { withTitleHTMLSerializerTransform } from '@editablejs/plugin-title/serializer/html'
import { withTitleHTMLDeserializerTransform } from '@editablejs/plugin-title/deserializer/html'

import { HTMLDeserializer } from '@editablejs/deserializer/html'
import { HTMLSerializer } from '@editablejs/serializer/html'

import { createContextMenuItems } from '../configs/context-menu-items'
import { createInlineToolbarItems } from '../configs/inline-toolbar-items'
// import React from 'react';
import { ProvenanceItem, ToolbarComponent, createToolbar, withPlugins } from './plugins';
import { MainView } from './plugins/window'
import "../sass/root.scss"
import { clearFormat } from './utils';
import { TitleInput } from './TitleInput';
import { ClearFormatEditor } from './plugins/clear-format';
import { withToolbar } from '@editablejs/plugin-toolbar';
import { createSlashToolbarItems } from '../../libs/configs/slash-toolbar-items'
import { Toolbar, useToolbarEffect } from './plugins/toolbar/store';
import { Button, SvgIcon } from './components';
import React from 'react';
interface FontListItem {
    id: string,
    isfouce: boolean,
    sort: number,
    tip: string
}
interface PlaygroundProps {
    className?: string
    initValue?: any
    isHtml?: boolean
    title?: string
    onChange?: (value?: Descendant[]) => void
    onChangeTitle?: (title: string) => void
    onBlurTitle?: (title?: string) => void
    onChangeToolbar?: (type: string, value?: any) => void
    isPasteText?: boolean
    fontList?: FontListItem[]
    accentColor?: string
    majorContentColor?: string
    imageBase64?: boolean
    toolbarDirection?: 'none' | 'top' | 'bottom',
    theme?: string
    showCloseButton?: boolean
    onClose?: () => void
}
export const Playground = forwardRef(({
    className, initValue, isHtml, onChange,
    title, onChangeTitle, onBlurTitle, isPasteText,
    fontList, accentColor, majorContentColor,
    toolbarDirection, onChangeToolbar,
    theme, showCloseButton, onClose
}: PlaygroundProps, ref) => {
    const [readOnly] = useState(false)
    const [connected, setConnected] = useState(false)
    const [, setConnection] = useState(false)
    const document = useMemo(() => new Y.Doc(), [])
    const [reloadDoc, setReloadDoc] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null)
    const isTop = useRef(false)
    const [enableCollaborative] = useState(false)
    const isPasteTextRef = useRef(false);

    const provenances = useMemo((): ProvenanceItem[] => {
        if (fontList) {
            const p: ProvenanceItem[] = fontList.map(item => ({ title: item.tip }));
            p.push({ title: '编辑出处', type: 'edit' })
            return p;
        }
        return []
    }, [fontList])

    useEffect(() => {
        isPasteTextRef.current = !!isPasteText;
    }, [isPasteText])

    const provider = useMemo(() => {
        const provider =
            typeof window === 'undefined'
                ? null
                : new WebsocketProvider('ws://localhost:1234/editable', 'editableOne', document, {
                    connect: false,
                  })

        const handleStatus = (event: Record<'status', 'connecting' | 'connected' | 'disconnected'>) => {
            const { status } = event
            if (status === 'connected') {
                setConnected(true)
                setConnection(false)
            } else if (status === 'connecting') {
                setConnection(true)
            } else if (status === 'disconnected') {
                setConnected(false)
                setConnection(false)
            }
        }
        if (provider) provider.on('status', handleStatus)
        return provider
    }, [document])

    const editor = useMemo(() => {
        const cursorData: CursorData = {
            color: randomColor({
                luminosity: 'dark',
                alpha: 1,
                format: 'hex',
            }),
            name: `Demo`,
            avatar: '',
        }

        const sharedType = document.get('content', Y.XmlText) as Y.XmlText

        let editor = withYjs(withEditable(createEditor()), sharedType, { autoConnect: false })
        if (provider) {
            editor = withYCursors(editor, provider.awareness, {
                data: cursorData,
            })
        }


        editor = withHistory(editor)

        editor = withYHistory(editor)

        editor = withPlugins(editor, {
            fontSize: { defaultSize: '14px' },
            fontColor: { defaultColor: defaultFontColor },
            backgroundColor: { defaultColor: defaultBackgroundColor },
            mention: {
                onSearch: () => {
                    return new Promise<MentionUser[]>(resolve => {
                        const users: MentionUser[] = []
                        for (let i = 0; i < 20; i++) {
                            users.push({
                                id: i,
                                name: 'Demo',
                                avatar: '',
                            })
                        }
                        resolve(users)
                    })
                },
                match: () => !Editor.above(editor, { match: n => TitleEditor.isTitle(editor, n) }),
            },
            codeBlock: {
                languages: [
                    {
                        value: 'plain',
                        content: 'Plain text',
                    },
                    {
                        value: 'javascript',
                        content: 'JavaScript',
                        plugin: codemirrorJavascript(),
                    },
                    {
                        value: 'html',
                        content: 'HTML',
                        plugin: codemirrorHtml(),
                    },
                    {
                        value: 'css',
                        content: 'CSS',
                        plugin: codemirrorCss(),
                    },
                ],
            },
            fontFamily: { defaultFamily: 'Arial,Helvetica,sans-serif' }
        })
        if (provider) editor = withYCodeBlock(editor, document, provider.awareness)
        editor = withInlineToolbar(withToolbar(editor))

        if (!isTouchDevice) {
            editor = withSideToolbar(editor, {
                match: () => false,
            })
        }

        editor = withSlashToolbar(editor, {
            match: () => !Editor.above(editor, { match: n => TitleEditor.isTitle(editor, n) }),
        })
        // editor = withTitle(editor, { placeholder: '请提炼模型', component: ErpTitle })
        return editor
    }, [document, provider])

    useIsomorphicLayoutEffect(() => {
        const unsubscribe = Placeholder.subscribe(editor, ([node]) => {
            if (
                Editable.isFocused(editor) &&
                Editor.isBlock(editor, node) &&
                !TitleEditor.isTitle(editor, node)
            )
                return () => '请输入存量'
        })
        return () => unsubscribe()
    }, [editor])

    useImperativeHandle(ref, () => ({
        get editor() {
            return editor;
        },
        clearFormat() {
            ClearFormatEditor.clear(editor)
        },
        undo() {
            HistoryEditor.undo(editor)
        },
        redo() {
            HistoryEditor.redo(editor)
        },
        mark(format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'sub' | 'sup') {
            MarkEditor.toggle(editor, format)
        },
        fontColor(color: string) {
            FontColorEditor.toggle(editor, color)
        },
        backgroundColor(color: string) {
            BackgroundColorEditor.toggle(editor, color)
        },
        size(val: string) {
            FontSizeEditor.toggle(editor, val)
        },
        heading(value: 'heading-one' | 'heading-two' | 'heading-three' | 'heading-four' | 'heading-five' | 'heading-six') {
            HeadingEditor.toggle(editor, value)
        },
        link() {
            LinkEditor.open(editor)
        },
        image() {
            ImageEditor.open(editor)
        },
        insertImage(url: string) {
            ImageEditor.insert(editor, { file: url });
        },
        block() {
            BlockquoteEditor.toggle(editor)
        },
        unorderedList() {
            UnorderedListEditor.toggle(editor)
        },
        orderList() {
            OrderedListEditor.toggle(editor)
        },
        taskList() {
            TaskListEditor.toggle(editor)
        },
        table() {
            TableEditor.insert(editor)
        },
        align(value: 'left' | 'center' | 'right' | 'justify') {
            AlignEditor.toggle(editor, value)
        },
        hr() {
            HrEditor.insert(editor)
        },
        code() {
            CodeBlockEditor.insert(editor)
        },
        leading(value: string) {
            LeadingEditor.toggle(editor, value === 'default' ? undefined : value)
        },
        mergeCell() {
            Grid.mergeCell(editor, Grid.above(editor))
        },
        splitCell() {
            Grid.splitCell(editor, Grid.above(editor))
        }
    }))

    useEffect(() => {
        if (!provider) return
        if (enableCollaborative) {
            provider.connect()
        }
        return () => {
            provider.disconnect()
        }
    }, [provider, enableCollaborative])


    useEffect(() => {
        if (connected) {
            console.log('--111-d-d--dd--')
            YjsEditor.connect(editor)
        }
        return () => YjsEditor.disconnect(editor)
    }, [editor, connected])

    useEffect(() => {
        setTimeout(() => {
            setConnected(true);
        }, 500);
    }, [connected])


    useIsomorphicLayoutEffect(() => {
        withMarkdownDeserializerPlugin(editor) // Adds a markdown deserializer plugin to the editor
        withMarkdownSerializerPlugin(editor) // Adds a markdown serializer plugin to the editor
        withTextSerializerTransform(editor) // Adds a text serializer transform to the editor
        withHTMLSerializerTransform(editor) // Adds an HTML serializer transform to the editor
        withMarkdownSerializerTransform(editor) // Adds a markdown serializer transform to the editor
        withHTMLDeserializerTransform(editor) // Adds an HTML deserializer transform to the editor
        withMarkdownDeserializerTransform(editor) // Adds a markdown deserializer transform to the editor
        HTMLDeserializer.withEditor(editor, withTitleHTMLDeserializerTransform, {})
        HTMLSerializer.withEditor(editor, withTitleHTMLSerializerTransform, {})
        const { onPaste } = editor

        editor.onPaste = event => {
            if (event.defaultPrevented) return
            const { clipboardData } = event
            if (!clipboardData) return
            event.preventDefault()
            const { text, fragment, html, files } = parseDataTransfer(clipboardData)

            const isText = event.type === 'pasteText'
            if (!isText && fragment.length > 0) {
                if (isPasteTextRef.current) {
                    clearFormat(fragment);
                }
                editor.insertFragment(fragment)
            } else if (!isText && html) {
                const document = new DOMParser().parseFromString(html, TEXT_HTML)
                const fragment = HTMLDeserializer.transformWithEditor(editor, document.body)
                if (isPasteTextRef.current) {
                    clearFormat(fragment);
                }
                editor.insertFragment(fragment)
            } else {
                const lines = text.split(/\r\n|\r|\n/)
                let split = false
                for (const line of lines) {
                    if (split) {
                        Transforms.splitNodes(editor, { always: true })
                    }
                    editor.normalizeSelection(selection => {
                        if (selection !== editor.selection) editor.selection = selection
                        editor.insertText(line)
                    })
                    split = true
                }
            }
            for (const file of files) {
                editor.insertFile(file)
            }
            editor.emit('paste', event)
        }

        return () => {
            editor.onPaste = onPaste
        }
    }, [editor])

    useContextMenuEffect(() => {
        ContextMenu.setItems(editor, createContextMenuItems(editor))
    }, editor)
    const toolbarOptions = useMemo((): ToolbarOptions => {
        return {
            accentColor, majorContentColor,
            provenances,
            onChange: (type, value) => {
                onChangeToolbar && onChangeToolbar(type, value);
            }
        }
    }, [accentColor, majorContentColor, provenances, onChange])

    useToolbarEffect(() => {
        Toolbar.setItems(editor, createToolbar(editor, toolbarOptions))
    }, editor)

    useEffect(() => {
        Toolbar.setProvenances(editor, provenances)
    }, [provenances])

    useInlineToolbarEffect(() => {
        InlineToolbar.setItems(editor, createInlineToolbarItems(editor, toolbarOptions))
    }, [editor, toolbarOptions, provenances])

    useSlashToolbarEffect(value => {
        SlashToolbar.setItems(editor, createSlashToolbarItems(editor, value))
    }, editor)
    useEffect(() => {
        if (!reloadDoc) {
            setReloadDoc(true);
        }
    }, [reloadDoc])
    const clearAll = useCallback(() => {
        const len = editor.children.length;
        for (let i = 0; i < len - 1; i++) {
            Transforms.removeNodes(editor, {
                at: [len - i - 1],
            });
        }
    }, [editor])
    // useEffect(() => {
    //     clearAll();
    //     if (isHtml && initValue) {
    //         const madst = MarkdownDeserializer.toMdastWithEditor(editor, initValue)
    //         const content = MarkdownDeserializer.transformWithEditor(editor, madst)
    //         isTop.current = true;
    //         Transforms.insertNodes(
    //             editor,
    //             content
    //         )
    //     } else if (!isHtml && initValue) {
    //         Transforms.insertNodes(
    //             editor,
    //             initValue
    //         )
    //     }
    // }, [initValue, isHtml])
    const titleRef = useRef<any>(null)
    const onKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            titleRef.current.blur();
            setTimeout(() => {
                editor.focus(true)
            }, 50);
        }
    }
    const [selectionDrawingStyle, setSelectionDrawingStyle] = useState({})
    const toolbarRef = useRef<any>()
    useEffect(() => {
        InlineToolbar.setDisabled(editor, toolbarDirection === 'bottom' || toolbarDirection === 'top');
    }, [toolbarDirection])

    useEffect(() => {
        if (theme === 'dark') {
            setSelectionDrawingStyle({
                focusColor: 'rgba(149, 195, 257, 0.4)',
                blurColor: 'rgba(136, 136, 136, 0.3)',
                caretColor: '#fff',
                caretWidth: 1,
                dragColor: 'rgb(37, 99, 235)',
                touchWidth: 2,
                touchColor: 'rgb(37, 99, 235)',
            })
        } else {
            setSelectionDrawingStyle({
                focusColor: 'rgba(0,127,255,0.3)',
                blurColor: 'rgba(136, 136, 136, 0.3)',
                caretColor: '#000',
                caretWidth: 1,
                dragColor: 'rgb(37, 99, 235)',
                touchWidth: 2,
                touchColor: 'rgb(37, 99, 235)',
            })
        }
        InlineToolbar.setTheme(editor, theme || 'light');
    }, [theme])

    return (
        <EditableProvider editor={editor} value={[{ type: 'paragraph', children: [{ text: '' }] }]}
            onChange={(value: Descendant[]) => {
                if (isTop.current) {
                    contentRef.current?.scrollTo({ top: 0 });
                    isTop.current = false;
                }
                onChange && onChange(value);
            }}>
            <MainView className={`${toolbarDirection ? 'dox-direction-' + toolbarDirection : ''}${className ? ' ' + className : ''}${theme ? ' docx-' + theme : ''}`} title={title} onShortcut={item => {
                toolbarRef.current?.command(item.key);
            }}>
                <div className='dox-toolbar'>
                    <ToolbarComponent editor={editor} ref={toolbarRef} />
                </div>
                <div className='dox-erp'>
                    <TitleInput ref={titleRef} placeholder='请提炼模型' onKeyDown={onKeyDown} title={title}
                        onBlur={(e: any) => {
                            onBlurTitle && onBlurTitle(e.target.value)
                        }}
                        onChange={(e: any) => {
                            onChangeTitle && onChangeTitle((e.target as HTMLInputElement).value)
                        }}>
                        {
                            showCloseButton && <Button className='erp-close' onClick={onClose}>
                                <SvgIcon iconClass='cr'></SvgIcon>
                            </Button>
                        }
                    </TitleInput>
                    <div className='erp-inner'>
                        <div className='docx-content' ref={contentRef} onScroll={() => {
                            window.document.dispatchEvent(new CustomEvent('scroll-erp-editor'))
                        }}>
                            <ContentEditable
                                lang={'en-US'}
                                className='dox-inner'
                                readOnly={readOnly}
                                placeholder={'请输入存量'}
                                selectionDrawingStyle={selectionDrawingStyle}
                            ></ContentEditable>
                        </div>
                    </div>

                </div>

            </MainView>
        </EditableProvider>
    )
})