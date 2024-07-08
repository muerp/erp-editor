import { List, Editor, WrapListOptions, generateRandomKey, Element, NodeEntry, Node, Transforms } from '@editablejs/models'
import { Indent, IndentEditor } from '@editablejs/plugins'
export const MList = {
    wrapList<T extends List>(
        editor: Editor,
        list: Partial<Omit<T, 'children'>> & { type: string },
        opitons: WrapListOptions = {},
    ) {
        const { at } = opitons
        let { start = 1, template, type, level } = list
        List.unwrapList(editor, {
            at,
        })
        editor.normalizeSelection(selection => {
            if (editor.selection !== selection) editor.selection = selection
            if (!selection) return
            const entrys = Editor.nodes<Element>(editor, {
                at: selection,
                match: n => Editor.isBlock(editor, n),
                mode: 'lowest',
            })
            const isUp = selection.anchor.path[0] > selection.focus.path[0];
            const beforePath = isUp ? Editor.before(editor, selection.focus.path) : Editor.before(editor, selection.anchor.path)
            const afterPath = isUp ? Editor.after(editor, selection.anchor.path) : Editor.after(editor, selection.focus.path)

            const [after] = Editor.nodes<List>(editor, {
                at: afterPath,
                match: n => Editor.isList(editor, n),
                mode: 'highest',
            })

            let [prev] = Editor.nodes<List>(editor, {
                at: beforePath,
                match: n => Editor.isList(editor, n),
            })

            if (typeof level === 'undefined') {
                if (prev && after) {
                    level = prev[0].level === after[0].level ? (after[0].level || 0) : 0
                } else if (prev && !after) {
                    level = prev[0].level || 0;
                } else if (!prev && after) {
                    level = after[0].level || 0;
                } else {
                    level = 0;
                }
            }

            let key = ''
            let next: NodeEntry<List> | undefined = undefined
            let oldType = '', oldLevel = 0;
            if (prev) {
                oldType = prev[0].type;
                oldLevel = prev[0].level;
                start = prev[0].start;
                key = prev[0].key
            }
            while (prev) {
                const prevList = prev[0]
                if (prevList.type !== type || prevList.level !== level || prevList.template !== template) {
                    Transforms.setNodes<List>(editor,
                        {
                            level,
                            template,
                            type
                        },
                        {
                            at: prev[1]
                        }
                    )
                    const beforePath = Editor.before(editor, prev[1])
                    const [pre] = Editor.nodes<List>(editor, {
                        at: beforePath,
                        match: n => Editor.isList(editor, n) && n.type === oldType && n.level == oldLevel,
                    })

                    if (pre) {
                        prev = pre
                    }
                    else {
                        break;
                    }
                } else {
                    break;
                }
            }

            if (prev) {
                start++;
                key = prev[0].key
            } else if (
                ([next] = Editor.nodes<List>(editor, {
                    at: afterPath,
                    match: n => Editor.isList(editor, n) && n.type === type,
                })) &&
                next
            ) {
                const nextList = next[0]
                key = nextList.key
                start = Math.max(nextList.start - 1, 1)
            } else {
                key = generateRandomKey()
            }
            const { props } = opitons

            let prevPath: any = null
            // return
            for (const [node, path] of entrys) {
                if (prevPath) {
                    const prevNode = Node.get(editor, prevPath)
                    if (!Editor.isList(editor, prevNode)) {
                        start--
                    }
                }
                const newLevel = level || 0;

                const newProps = props ? props(key, node, path) : {}
                const element: List = {
                    type,
                    key,
                    start,
                    template,
                    level: newLevel,
                    ...newProps,
                    children: [],
                }

                Transforms.wrapNodes(editor, element, {
                    at: path
                })
                start++
                prevPath = path
            }

            if (after && prevPath) {
                const afterNode = after[0];
                while (true) {
                    const next = Editor.next<List>(editor, {
                        at: prevPath,
                        match: n => Editor.isList(editor, n) && n.type === afterNode.type && afterNode.level === n.level
                    })
                    if (!next) break
                    const [, path] = next
                    prevPath = path
                    Transforms.setNodes<List>(
                        editor,
                        { start, level, type, template },
                        {
                            at: prevPath,
                        },
                    )
                    start++;
                }
            }
            if (prevPath) {
                List.updateStart(editor, {
                    type,
                    path: prevPath,
                    key,
                })
            }
        }, at)
    },
}

List.getLevel = (editor, options) => {
    const { path, key, type } = options
    const [element] = Editor.nodes<Indent>(editor, {
        at: path,
        match: n => {
            if (!Editor.isBlock(editor, n)) return false
            const indent = n as Indent
            return indent.lineIndent !== undefined || indent.textIndent !== undefined
        },
        mode: 'highest',
    })
    const prev = Editor.previous<List & Indent>(editor, {
        at: path,
        match: n => editor.isList(n) && n.type === type && n.key === key,
    })
    const prevIndentLevel = prev ? IndentEditor.getLevel(editor, prev[0]) : 0
    const prefixIndentLevel = prev ? prevIndentLevel - prev[0].level : 0
    const elementIndentLevel = element ? IndentEditor.getLevel(editor, element[0]) : 0
    return elementIndentLevel - prefixIndentLevel
}
IndentEditor.getLevel = (editor: Editor, element: Indent) => {
    const { textIndent, lineIndent } = element
    const count = (textIndent ?? 0) + (lineIndent ?? 0)
    const size = IndentEditor.getSize(editor)
    return count > 0 ? count / size : 0
}