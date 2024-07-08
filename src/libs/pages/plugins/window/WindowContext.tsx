import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { MenuItem } from "./type"

export interface WindowContextType {
    menus: MenuItem[],
    setMenus: (menus: MenuItem[]) => void
    activeMenu?: MenuItem
    setActiveMenu: (menu?: MenuItem) => void
    onChangeMenu: (menu: MenuItem) => void
    closeDropView: () => void
    title: string
    setTitle: (title: string) => void
}

const defaultWindow: WindowContextType = {
    menus: [],
    setMenus: () => { },
    setActiveMenu: () => { },
    onChangeMenu: () => { },
    closeDropView: () => { },
    title: '',
    setTitle: () => {}
}
const MenuItems = [
    {
        key: 'file',
        text: '文件',
        shortcutKey: 'Ctrl+F',
        children: [
            {
                key: 'new',
                text: '新建',
                shortcutKey: 'Ctrl+N',
            },
            {
                key: 'open',
                text: '打开',
                shortcutKey: 'Ctrl+O',
                children: [
                    {
                        key: 'new',
                        text: '最近打开',
                    },
                    {
                        key: 'open',
                        text: 'aa.docx',
                    },
                    {
                        key: 'save',
                        text: 'bb.docx',
                    }
                ]
            },
            {
                key: 'recent',
                text: '最近使用',
                shortcutKey: 'Ctrl+T',
                line: true
            },
            {
                key: 'save',
                text: '保存',
                shortcutKey: 'Ctrl+S'
            },
            {
                key: 'rename',
                text: '重命名',
                shortcutKey: 'Ctrl+D'
            }
        ]
    },
    {
        key: 'edit',
        text: '编辑',
        shortcutKey: 'Ctrl+E',
        children: [
            {
                key: 'undo',
                text: '撤销',
                shortcutKey: 'Ctrl+U',
            }
        ]
    },
    {
        key: 'view',
        text: '查看',
        shortcutKey: 'Ctrl+V',
        children: [
            {
                key: 'search',
                text: '搜索',
                shortcutKey: 'Ctrl+F',
            }
        ]
    },
    {
        key: 'insert',
        text: '插入',
        shortcutKey: 'Ctrl+V',
    },
    {
        key: 'format',
        text: '格式',
        shortcutKey: 'Ctrl+V',
    },
    {
        key: 'tool',
        text: '工具',
        shortcutKey: 'Ctrl+V',
    },
    {
        key: 'help',
        text: '帮助',
        shortcutKey: 'Ctrl+V',
    },
    {
        key: 'ai',
        text: 'AI创作',
        shortcutKey: 'Ctrl+V',
    },
    {
        key: 'noai',
        text: '去AI化',
        shortcutKey: 'Ctrl+V',
    },
    {
        key: 'check-lang',
        text: '语法检查',
        shortcutKey: 'Ctrl+V',
    },
    {
        key: 'de-weight',
        text: '论文去重',
        shortcutKey: 'Ctrl+V',
    },
    {
        key: 'score',
        text: '论文评分',
        shortcutKey: 'Ctrl+V',
    }
]
const WindowContext = React.createContext<WindowContextType>(defaultWindow)
interface WindowProviderProps {
    children: ReactNode
    name?: string
    onChangeTitle?: (title: string) => void
}
const WindowProvider = ({ children, name, onChangeTitle }: WindowProviderProps) => {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [activeMenu, setActiveMenu] = useState<MenuItem>();
    const [showMathEditor, setShowMathEditor] = useState(false);
    const [title, setTitle] = useState(name || '')
    const titleRef = useRef(name || '')
    useEffect(()=>{
        if (name !== titleRef.current) {
            setTitle(name || '');
        }
    }, [name])
    useEffect(()=>{
        if (titleRef.current === title) return;
        titleRef.current = title;
        onChangeTitle && onChangeTitle(title);
    }, [title])
    useEffect(()=>{
        function resetMenus(menus: MenuItem[]) {
            menus.forEach(menu=>{
                if (menu.children) {
                    menu.ref = {current: undefined};
                    resetMenus(menu.children);
                }
            })
        }
        resetMenus(MenuItems);
        setMenus(MenuItems)
    }, [])
    const closeDropView = useCallback(() => {
        setActiveMenu(undefined);
    }, [])
    const onChangeMenu = (menu: MenuItem) => {
        // console.log("-----", menu);
        closeDropView();
    }
    useEffect(() => {
        if (activeMenu) {
            setTimeout(() => {
                window.addEventListener('click', closeDropView)
            }, 10);
        } else {
            window.removeEventListener('click', closeDropView)
        }
        return () => {
            window.removeEventListener('click', closeDropView)
        }
    }, [activeMenu, closeDropView])

    const ctx = {
        menus, setMenus,
        activeMenu, setActiveMenu,
        onChangeMenu, closeDropView,
        showMathEditor, setShowMathEditor,
        title, setTitle
    }
    return (
        <WindowContext.Provider value={ctx}>
            {children}
        </WindowContext.Provider>
    )

}

export { WindowContext, WindowProvider }