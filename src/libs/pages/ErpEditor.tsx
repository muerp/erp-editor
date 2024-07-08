import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    EditableProvider,
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
import { Editor, createEditor, Transforms, Descendant, Grid, Node, Text, Operation } from '@editablejs/models'
import { useContextMenuEffect, ContextMenu, MentionUser, MarkEditor, FontColorEditor, BackgroundColorEditor, FontSizeEditor, HeadingEditor, LinkEditor, ImageEditor, BlockquoteEditor, UnorderedListEditor, OrderedListEditor, TaskListEditor, TableEditor, AlignEditor, HrEditor, CodeBlockEditor, LeadingEditor, withContextMenu } from '@editablejs/plugins'
import { javascript as codemirrorJavascript } from '@codemirror/lang-javascript'
import { html as codemirrorHtml } from '@codemirror/lang-html'
import { css as codemirrorCss } from '@codemirror/lang-css'
import { withYCodeBlock } from '@editablejs/plugin-codeblock/yjs'
import {
    useInlineToolbarEffect,
    InlineToolbar,
    withInlineToolbar,
    ToolbarOptions
} from './plugins'
import {
    defaultBackgroundColor,
    defaultFontColor,
} from '../configs/toolbar-items'
import {
    withSlashToolbar,
    useSlashToolbarEffect,
    SlashToolbar,
} from './plugins/toolbar/slash'
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
import { clearFormat } from './utils';
import { ClearFormatEditor } from './plugins/clear-format';
import { withToolbar } from '@editablejs/plugin-toolbar';
import { createSlashToolbarItems } from '../configs/slash-toolbar-items'
import { Toolbar, useToolbarEffect } from './plugins/toolbar/store';
import { MathMLEditor } from './plugins/math';
import { withTitle, TitleEditor } from './plugins/title';
import { ErpContent } from './ErpContent'
import { Button, SvgIcon } from './components';

interface FontListItem {
    id: string,
    isfouce: boolean,
    sort: number,
    tip: string
}
export const EditorVersion = '2'
export interface ErpEditorProps {
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
    toolbarDirection?: 'none' | 'top' | 'bottom'
    theme?: string
    showCloseButton?: boolean
    onClose?: () => void
    onConvertFinished?: () => void
    onLoad?: (status: string) => void
    wss: string
    disabledCollaborative?: boolean
    readOnly?: boolean
    disabledContextMenu?: boolean
    hideToolbar?: boolean
    isMobile?: boolean
    token?: string
    user?: {
        name?: string,
        avatar?: string
    },
    exts?: boolean,
    articleId: string
}
export const ErpEditor = forwardRef(({
    className, initValue, isHtml, onChange,
    title, onChangeTitle, isPasteText,
    fontList, accentColor, majorContentColor,
    toolbarDirection, onChangeToolbar, articleId, exts, wss,
    token, showCloseButton, onClose,
    theme, user, onConvertFinished,
    disabledCollaborative, readOnly, disabledContextMenu, onLoad,
    hideToolbar, isMobile
}: ErpEditorProps, ref) => {
    useEffect(() => {
        const onMove = (e: any) => {
            e.stopPropagation();
        }
        window.document.addEventListener('pointermove', onMove)
        return () => {
            window.document.removeEventListener('pointermove', onMove)
        }
    }, [])
    const [connected, setConnected] = useState(false)
    const [, setConnection] = useState(false)
    const isInitRef = useRef(false);
    const [isInit, setIsInit] = useState(false);
    const isSynchronization = useRef(false);
    const document = useMemo(() => {
        isInitRef.current = false;
        const doc = new Y.Doc();
        return doc;
    }, [articleId])
    const contentRef = useRef<HTMLDivElement>(null)
    const isTop = useRef(false)
    const isPasteTextRef = useRef(false);

    const titleRef = useRef<any>(null)

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
        // if (disabledCollaborative) return null;
        if (!articleId) return;
        const provider =
            typeof window === 'undefined'
                ? null
                : new WebsocketProvider(wss, articleId, document, {
                    connect: false,
                    params: {
                        token: token || 'testtoken',
                        readOnly: readOnly ? 'readOnly' : '',
                    }
                })

        const handleStatus = (event: Record<'status', 'connecting' | 'connected' | 'disconnected'>) => {
            const { status } = event
            // console.log('---status---', status)
            if (status === 'connected') {
                setConnected(true)
                setConnection(false)
                if (isInitRef.current || !connected) {
                    onLoad && onLoad('connected')
                    return;
                }

                if (isHtml && initValue && (exts ? exts + '' : '') !== EditorVersion) {
                    isInitRef.current = true;
                    const madst = MarkdownDeserializer.toMdastWithEditor(editor, initValue)
                    const content = MarkdownDeserializer.transformWithEditor(editor, madst)
                    isTop.current = true;
                    requestAnimationFrame(() => {
                        content.forEach((item, idx) => {
                            editor.apply({
                                type: 'insert_node',
                                node: item,
                                path: [idx]
                            })
                        })
                    });
                    onConvertFinished && onConvertFinished();
                }
                onLoad && onLoad('connected')
            } else if (status === 'connecting') {
                setConnection(true)
                onLoad && onLoad('connecting')
            } else if (status === 'disconnected') {
                setConnected(false)
                setConnection(false)
                onLoad && onLoad('disconnected')
            }
        }
        if (provider) provider.on('status', handleStatus)
        return provider
    }, [document])

    const editor = useMemo(() => {
        const sharedType = document.get('content', Y.XmlText) as Y.XmlText

        let editor = withYjs(withEditable(createEditor()), sharedType, { autoConnect: false })
        if (provider) {
            const cursorData: CursorData = {
                color: randomColor({
                    luminosity: 'dark',
                    alpha: 0.5,
                    format: 'hex',
                }),
                name: user?.name || '',
                avatar: user?.avatar || '',
            }
            editor = withYCursors(editor, provider.awareness, {
                data: cursorData,
            })
        }

        // if (!readOnly) {
        editor = withHistory(editor)

        editor = withYHistory(editor)
        // }

        if (!disabledContextMenu) {
            editor = withContextMenu(editor);
        }

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
                                name: '',
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
        if (!readOnly && !isMobile) {
            editor = withInlineToolbar(withToolbar(editor))
        }


        if (!isTouchDevice) {
            editor = withSideToolbar(editor, {
                match: () => false,
            })
        }
        // if (!readOnly) {
        editor = withSlashToolbar(editor, {
            match: () => !Editor.above(editor, { match: n => TitleEditor.isTitle(editor, n) }),
        })
        // }
        editor = withTitle(editor, {
            onChange: (v) => {
                if (!isSynchronization.current) return;
                // console.log('---change', v)
                if (v) {
                    onChangeTitle && onChangeTitle(v);
                }
            }
        })
        isInitRef.current = false;
        return editor
    }, [document, provider, articleId])

    useIsomorphicLayoutEffect(() => {
        if (readOnly) return;
        const unsubscribe = Placeholder.subscribe(editor, ([node]) => {
            if (
                Editable.isFocused(editor) &&
                Editor.isBlock(editor, node) &&
                !TitleEditor.isTitle(editor, node)
            )
                return () => readOnly ? '' : '请输入存量'
        })
        return () => unsubscribe()
    }, [editor, readOnly])

    useImperativeHandle(ref, () => ({
        apply: editor.apply,
        get editor() {
            return editor;
        },
        get document() {
            return document;
        },
        focus() {
            if (titleRef.current) {
                titleRef.current?.focus();
            } else {
                editor.focus(true)
            }
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
        },
        changeContent(value: string | any[]) {
            if (!editor) return;
            let content: any[] = []
            if (typeof value === 'string') {
                const madst = MarkdownDeserializer.toMdastWithEditor(editor, value)
                content = MarkdownDeserializer.transformWithEditor(editor, madst)
            } else {
                content = value;
            }
            isTop.current = true;
            editor.apply({
                type: 'insert_node',
                node: {
                    text: ''
                },
                path: [0]
            })
            editor.children.forEach((item) => {
                editor.apply({
                    type: 'remove_node',
                    path: [0],
                    node: item,
                })
            })
            content.forEach((item, idx) => {
                editor.apply({
                    type: 'insert_node',
                    node: item,
                    path: [idx]
                })
            })
        },
        insertMath() {
            MathMLEditor.open(editor);
        }
    }))

    useEffect(() => {
        // if (readOnly) return;
        if (!provider) return
        if (!disabledCollaborative) {
            provider.connect()
        }
        return () => {
            provider.disconnect()
        }
    }, [provider, disabledCollaborative])

    useEffect(() => {
        if (connected) {
            YjsEditor.connect(editor)
        }
        return () => YjsEditor.disconnect(editor)
    }, [editor, connected])


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
        // if (!readOnly) {
        ContextMenu.setItems(editor, createContextMenuItems(editor, readOnly))
        // }
    }, editor)
    const toolbarOptions = useMemo((): ToolbarOptions => {
        return {
            accentColor, majorContentColor,
            provenances,
            isReadOnly: readOnly,
            onChange: (type, value) => {
                onChangeToolbar && onChangeToolbar(type, value);
            }
        }
    }, [accentColor, majorContentColor, provenances, onChange])

    useToolbarEffect(() => {
        // if (!readOnly) {
        Toolbar.setItems(editor, createToolbar(editor, toolbarOptions, isMobile))
        // }
    }, editor)

    useEffect(() => {
        if (!readOnly) {
            Toolbar.setProvenances(editor, provenances)
        }
    }, [provenances])

    useInlineToolbarEffect(() => {
        if (!isMobile) {
            InlineToolbar.setItems(editor, createInlineToolbarItems(editor, toolbarOptions))
        }
    }, [editor, toolbarOptions, provenances])

    useSlashToolbarEffect(value => {
        // if (!readOnly) {
        SlashToolbar.setItems(editor, createSlashToolbarItems(editor, value))
        // }
    }, editor)
    useEffect(() => {
        isInitRef.current = false;
    }, [initValue])
    useEffect(() => {
        if (!disabledCollaborative || isInitRef.current || !initValue || initValue.length === 0) {
            isInitRef.current = true;
            return;
        }
        isInitRef.current = true;
        let content: any[] = [];
        if (typeof initValue === 'string') {
            const madst = MarkdownDeserializer.toMdastWithEditor(editor, initValue)
            content = MarkdownDeserializer.transformWithEditor(editor, madst)
        } else if (typeof initValue === 'object') {
            content = initValue;
        }
        isTop.current = true;

        const ops: Operation[] = []
        for (let i = 1; i < editor.children.length; ++i) {
            ops.push({
                type: 'remove_node',
                node: editor.children[i],
                path: [1],
            })
        }

        for (let i = content.length - 1; i >= 1; --i) {
            ops.push({
                type: 'insert_node',
                node: content[i],
                path: [1]
            })
        }
        ops.push({
            type: 'remove_node',
            node: editor.children[0],
            path: [0],
        })
        ops.push({
            type: 'insert_node',
            node: content[0],
            path: [0],
        })
        ops.forEach(op => {
            editor.apply(op);
        })
    }, [editor, disabledCollaborative, initValue, readOnly])

    const toolbarRef = useRef<any>()
    useEffect(() => {
        if (!readOnly) {
            InlineToolbar.setDisabled(editor, toolbarDirection === 'bottom' || toolbarDirection === 'top');
        }
    }, [toolbarDirection, editor])

    useEffect(() => {
        if (readOnly) return;
        const subDocLoaded = () => {
            setIsInit(true);
            document.off('updateV2', subDocLoaded)
        }
        document.on('updateV2', subDocLoaded)
        return () => {
            document.off('updateV2', subDocLoaded)
        }
    }, [document])
    useEffect(() => {
        if (readOnly) return;
        if (!editor || !editor.children[0]) return;
        if (isInit && !isSynchronization.current) {
            isSynchronization.current = true;
            // const str = Node.string(editor.children[0])
            // if (title !== str) {
            //     const node = editor.children[0];
            //     const ops: Operation[] = []
            //     if (!Text.isText(node) && Text.isText(node.children[0])) {
            //         for (let i = node.children.length - 1; i >= 0; i--) {
            //             const c = node.children[i];
            //             if (i === 0) {
            //                 if (Text.isText(c)) {
            //                     if (c.text.length > 0) {
            //                         ops.push({
            //                             type: 'remove_text',
            //                             path: Editable.findPath(editor, c),
            //                             offset: 0,
            //                             text: c.text
            //                         })
            //                     }
            //                 } else {
            //                     ops.push({
            //                         type: 'remove_node',
            //                         path: Editable.findPath(editor, c),
            //                         node: c
            //                     })
            //                 }
            //             } else {
            //                 ops.push({
            //                     type: 'remove_node',
            //                     path: Editable.findPath(editor, c),
            //                     node: c
            //                 })
            //             }
            //         }
            //     }
            //     if (title) {
            //         ops.push({
            //             type: 'insert_text',
            //             path: [0, 0],
            //             offset: 0,
            //             text: title
            //         })
            //     }
            //     ops.forEach(op => {
            //         editor.apply(op);
            //     })
            // }
        }
    }, [title, isInit])
    useEffect(()=>{
        const str = Node.string(editor.children[0])
        if (title && title !== str) {
            const node = editor.children[0];
            const ops: Operation[] = []
            if (!Text.isText(node) && Text.isText(node.children[0])) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    const c = node.children[i];
                    if (i === 0) {
                        if (Text.isText(c)) {
                            if (c.text.length > 0) {
                                ops.push({
                                    type: 'remove_text',
                                    path: Editable.findPath(editor, c),
                                    offset: 0,
                                    text: c.text
                                })
                            }
                        } else {
                            ops.push({
                                type: 'remove_node',
                                path: Editable.findPath(editor, c),
                                node: c
                            })
                        }
                    } else {
                        ops.push({
                            type: 'remove_node',
                            path: Editable.findPath(editor, c),
                            node: c
                        })
                    }
                }
            }
            if (title) {
                ops.push({
                    type: 'insert_text',
                    path: [0, 0],
                    offset: 0,
                    text: title
                })
            }
            ops.forEach(op => {
                editor.apply(op);
            })
        }
    }, [title])
    useEffect(() => {
        isSynchronization.current = false;
        setIsInit(false);
    }, [articleId])
    return (
        <EditableProvider editor={editor}
            onChange={(value: Descendant[]) => {
                if (isTop.current) {
                    contentRef.current?.scrollTo({ top: 0 });
                    isTop.current = false;
                }
                onChange && onChange(value);
                // console.log('value---', value)
            }}>
            <MainView className={`${toolbarDirection ? 'dox-direction-' + toolbarDirection : ''}${className ? ' ' + className : ''}${theme ? ' docx-' + theme : ''}`} title={title} onShortcut={item => {
                toolbarRef.current?.command(item.key);
            }}>
                {
                    !hideToolbar && !readOnly && <div className='dox-toolbar'>
                        <ToolbarComponent editor={editor} ref={toolbarRef} />
                    </div>
                }
                {
                    isMobile && !readOnly && <div className='dox-toolbar-mobile'>
                        <ToolbarComponent mode="mobile" editor={editor} ref={toolbarRef} />
                    </div>
                }
                <div className={`dox-erp${isMobile ? ' dox-erp-mobile' : ''}`}>
                    {
                        showCloseButton && <Button className='erp-close' onClick={onClose}>
                            <SvgIcon iconClass='cr'></SvgIcon>
                        </Button>
                    }
                    <div className='erp-inner'>
                        <div className='docx-content' ref={contentRef} onScroll={() => {
                            window.document.dispatchEvent(new CustomEvent('scroll-erp-editor'))
                        }}>
                            <ErpContent readOnly={readOnly} theme={theme}></ErpContent>
                        </div>
                    </div>
                </div>
            </MainView>
        </EditableProvider>
    )
})