import { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import { ModalView } from './ModalView'
import { MenuItem } from './type'
import { WindowContext } from './WindowContext'
interface MenuViewProps {
    menus: MenuItem[]
    className?: string
    direction?: string
    level?: number
    onChildrenEnter?: () => void
}
export const MenuView = forwardRef(({ className, menus, level, direction, onChildrenEnter }: MenuViewProps, ref) => {

    const [hoverItem, setHoverItem] = useState<{ key?: string | number, hovered?: boolean, selected?: boolean, active?: boolean, ref: any, hasChildren?: boolean }>();
    const { onChangeMenu } = useContext(WindowContext);
    // const editor = useEditable()
    
    const pointerEnter = (menu?: MenuItem) => {
        if (!menu) {
            setHoverItem(undefined);
            return;
        }
        onChildrenEnter && onChildrenEnter();
        // let selected = false;
        // if (level && level > 0) {
        //     selected = true;
        // }
        setHoverItem({
            key: menu.key,
            hovered: true,
            ref: menu.ref,
            hasChildren: menu.children && menu.children.length > 0
        })
    }
    useImperativeHandle(ref, () => ({
        isValidLeft: () => {
            return hoverItem && hoverItem.active;
        },
        isValidRight: () => {
            if (level && level > 0 && !hoverItem) return true;
            
            return hoverItem &&
                hoverItem.hasChildren &&
                (!hoverItem.active || hoverItem.ref?.current?.isValidRight())
        },
        onLeft: () => {
            if (hoverItem) {
                hoverItem.active = false;
                hoverItem.selected = false;
                setHoverItem({ ...hoverItem });
            }
        },
        select(idx = 0) {
            pointerEnter(menus[idx]);
        },
        onRight: () => {
            if (!hoverItem) return;
            if (hoverItem.active) {
                hoverItem.ref?.current?.select();
                return;
            }
            setHoverItem({
                key: hoverItem.key,
                hovered: true,
                active: true,
                ref: hoverItem.ref,
                hasChildren: hoverItem.hasChildren
            });
        },
        onDown() {
            if (hoverItem) {
                if (hoverItem.selected && hoverItem.active) {
                    hoverItem.ref?.current?.onDown();
                    return;
                }
            }
            let idx = menus.findIndex(r => r.key === hoverItem?.key);
            idx = idx === -1 ? 0 : idx + 1;
            if (idx > menus.length - 1) {
                idx = 0;
            }
            pointerEnter(menus[idx]);
        },
        onUp() {
            if (hoverItem) {
                if (hoverItem.selected && hoverItem.active) {
                    hoverItem.ref?.current?.onUp();
                    return;
                }
            }
            let idx = menus.findIndex(r => r.key === hoverItem?.key);
            idx = idx === -1 ? 0 : idx - 1;
            if (idx < 0) {
                idx = menus.length - 1;
            }
            pointerEnter(menus[idx]);
        },
        onEnter() {
            if (hoverItem) {
                if (hoverItem.hovered && hoverItem.active) {
                    hoverItem.ref?.current.onEnter();
                } else if (hoverItem.hovered) {
                    const idx = menus.findIndex(r => r.key === hoverItem?.key);
                    if (idx !== -1) {
                        onClickMenu(menus[idx])
                    }
                }
            }
        }
    }));
    // const onKeydown = (e: KeyboardEvent) => {
    //     if (Editable.isFocused(editor)) return;
    //     console.log("---222--", e.target);
    // }
    // useEffect(() => {
    //     document.addEventListener('keydown', onKeydown)
    //     return () => {
    //         document.removeEventListener('keydown', onKeydown)
    //     }
    // }, [])


    const openChildren = (menu: MenuItem) => {
        setHoverItem({
            key: menu.key,
            hovered: true,
            active: true,
            ref: menu.ref,
            hasChildren: menu.children && menu.children.length > 0
        });
    }
    const onClickMenu = (menu: MenuItem) => {
        if (menu.children) {
            openChildren(menu);
        } else {
            onChangeMenu(menu);
        }
    }
    const childrenEnter = () => {
        if (hoverItem) {
            hoverItem.selected = true;
            setHoverItem({...hoverItem})
        }
    }
    return (
        <ModalView className={className} direction={direction}>
            {
                menus.map((menu, idx) => (
                    <div className={`drop-item${menu.line ? ' drop-line' : ''}`} key={idx + '-menu'}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClickMenu(menu)
                        }}>
                        <div className={`drop-item-inner${menu.active ? ' active' : ''}${hoverItem && hoverItem.key === menu.key && hoverItem.hovered ? ' hovered' : ''}${hoverItem && hoverItem.key === menu.key && hoverItem.selected ? ' selected' : ''}`}
                            onPointerEnter={() => { pointerEnter(menu) }}>
                            <div className="drop-label">
                                {menu.text}
                            </div>
                            {
                                menu.children ? <i className="wd-arrow-left"></i> : menu.shortcutKey ? <span className='shortcut-key'>{menu.shortcutKey}</span> : undefined
                            }
                        </div>
                        {
                            hoverItem && hoverItem.key === menu.key && hoverItem.active && menu.children && (
                                <MenuView menus={menu.children} level={(level || 0) + 1} direction="right" ref={menu.ref} onChildrenEnter={childrenEnter}/>
                            )
                        }
                    </div>
                ))
            }
        </ModalView>
    )
})