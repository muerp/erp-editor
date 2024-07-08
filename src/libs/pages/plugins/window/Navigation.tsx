import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Button, SvgIcon } from '../../components'
import { MenuItem } from './type'
import { WindowContext } from './WindowContext'
import { MenuView } from './MenuView'
import { Editable, useEditable } from '@editablejs/editor'
import { Avatar } from './Avatar'
interface NavigationProps {
    hideShortcut?: boolean
}
const ShortcutMap = {
    'Meta': 'Cmd',
    'Control': 'Ctrl',
    'Alt': 'Alt'
}
export const Navigation = ({ hideShortcut }: NavigationProps = { hideShortcut: true }) => {
    const { menus, activeMenu, setActiveMenu, onChangeMenu } = useContext(WindowContext);
    const [hoverMenu, setHoverMenu] = useState<MenuItem>();
    const editor = useEditable()
    const preShortcut = useRef<string>();
    const onClickMenu = useCallback((item?: MenuItem) => {
        setHoverMenu(undefined);
        setActiveMenu(item);
    }, [setActiveMenu])
    useEffect(() => {
        function getMenuByShortcut(menus: MenuItem[], shortcutKey: string): MenuItem | undefined {
            const item = menus.find(item => item.shortcutKey?.toLowerCase() === shortcutKey);
            if (item) return item;
            for (let i = 0; i < menus.length; ++i) {
                const menu = menus[i];
                if (menu.children) {
                    const s = getMenuByShortcut(menu.children, shortcutKey);
                    if (s) return s;
                }
            }
            return undefined;
        }
        const onKeydown = (e: KeyboardEvent) => {
            if (Editable.isFocused(editor)) return;
            if (!preShortcut.current) {
                preShortcut.current = e.key;
            }
            if (e.key === 'ArrowLeft') {
                if (activeMenu?.ref?.current?.isValidLeft()) {
                    activeMenu.ref.current.onLeft();
                } else if (activeMenu) {
                    let idx = menus.findIndex(r => r.key === activeMenu.key)
                    if (idx !== -1) {
                        idx--;
                        idx = idx < 0 ? menus.length - 1 : idx;
                    } else {
                        idx = 0;
                    }
                    onClickMenu(menus[idx]);
                }
            } else if (e.key === 'ArrowDown') {
                activeMenu?.ref?.current?.onDown();
            } else if (e.key === 'ArrowUp') {
                activeMenu?.ref?.current?.onUp();
            } else if (e.key === 'ArrowRight') {
                if (activeMenu?.ref?.current?.isValidRight()) {
                    activeMenu.ref.current.onRight();
                } else if (activeMenu) {
                    let idx = menus.findIndex(r => r.key === activeMenu.key)
                    if (idx !== -1) {
                        idx++;
                        idx = idx > menus.length - 1 ? 0 : idx;
                    } else {
                        idx = menus.length - 1;
                    }
                    onClickMenu(menus[idx]);
                }
            } else if (e.key === 'Enter') {
                //
                activeMenu?.ref?.current?.onEnter();
            } else if (preShortcut.current === 'Control' ||
                preShortcut.current === 'Meta' ||
                preShortcut.current === 'Alt') {
                //判断组合健
                const sc = (ShortcutMap[preShortcut.current] + '+' + e.key).toLowerCase();
                const item = menus.find(item => item.shortcutKey?.toLowerCase() === sc);
                if (item && activeMenu?.key !== item.key) {
                    onClickMenu(item);
                } else {
                    //
                    const item = getMenuByShortcut(menus, sc);
                    if (item) {
                        onChangeMenu(item);
                    }
                }
            }
        }
        const onKeyup = (e: KeyboardEvent) => {
            if (Editable.isFocused(editor)) return;
            if (preShortcut.current === e.key) {
                preShortcut.current = undefined;
            }
        }
        document.addEventListener('keydown', onKeydown)
        document.addEventListener('keyup', onKeyup)
        return () => {
            document.removeEventListener('keydown', onKeydown)
            document.removeEventListener('keyup', onKeyup)
        }
    }, [activeMenu, editor, menus, onChangeMenu, onClickMenu])

    return (
        <div className="main-navigation">
            <div className='navigation-inner'>
                <Button className="file-icon">
                    <SvgIcon iconClass="file-docx"></SvgIcon>
                </Button>
                <div className="nav-inner">
                    <div className='d-flex'>
                        <span className='file-name'>文档名称</span>
                        <Button>
                            <SvgIcon iconClass="star"></SvgIcon>
                        </Button>
                        <Button>
                            <SvgIcon iconClass="cloud"></SvgIcon>
                        </Button>
                    </div>
                    <div className='menu-bar'>
                        {
                            menus.map((item, idx) => (
                                <div key={idx + '-m'} className='menu-item'>
                                    <div className={`menu-click${(activeMenu && activeMenu.key === item.key) || (hoverMenu && hoverMenu.key === item.key) ? ' active' : ''}`}
                                        onClick={() => {
                                            onClickMenu(item);
                                        }}
                                        onPointerEnter={() => {
                                            if (activeMenu) {
                                                onClickMenu(item);
                                            } else {
                                                setHoverMenu(item);
                                            }
                                        }}
                                        onPointerLeave={() => {
                                            setHoverMenu(undefined);
                                        }}
                                    >
                                        {item.text} {!hideShortcut && item.shortcutKey ? `(${item.shortcutKey})` : undefined}
                                    </div>
                                    {
                                        activeMenu && activeMenu.children && activeMenu.key === item.key && <MenuView ref={item.ref} menus={activeMenu.children} />
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='nav-right d-flex'>
                    <Button>
                        <SvgIcon iconClass='time'></SvgIcon>
                    </Button>
                    <Button>
                        <SvgIcon iconClass='msg'></SvgIcon>
                    </Button>
                    <Button type='blue'>
                        <SvgIcon iconClass='share'></SvgIcon>
                        <span>共享</span>
                    </Button>
                    <Avatar name="TS" size='ml' />
                </div>
            </div>
        </div>
    )
}