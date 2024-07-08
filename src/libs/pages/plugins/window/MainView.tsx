import { ReactNode, useEffect, useRef } from "react"
// import { Navigation } from "./Navigation"
import { WindowProvider } from './WindowContext'
import { ShortcutItem, ShortcutKey, isMac } from "."
interface MainProps {
    className?: string
    children?: ReactNode
    title?: string
    onChangeTitle?: (title: string) => void
    onShortcut?: (shortcut: ShortcutItem) => void
}


export const MainView = ({ className, children, title, onChangeTitle, onShortcut }: MainProps) => {
    const shortcutRef = useRef(false)


    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            
            if (!shortcutRef.current) return;
            let key=''
            if (isMac) {
                key += e.metaKey? 'cmd+':''
            } else {
                key += e.ctrlKey? 'Ctrl':''
            }
            if (!key) return;
            if (e.shiftKey) {
                key += 'shift+'
            } 
            if (e.altKey) {
                key += 'alt+'
            }
            key += e.key.toLowerCase();
            if (ShortcutKey[key]) {
                e.preventDefault();
                onShortcut && onShortcut(ShortcutKey[key])
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [])
    return (
        <WindowProvider name={title} onChangeTitle={onChangeTitle}>
            <div className={`${className || ''}`}
                onMouseEnter={() => {
                    shortcutRef.current = true;
                }}
                onMouseLeave={() => {
                    shortcutRef.current = false;
                }}>
                {/* <Navigation hideShortcut={true} /> */}
                {children}
            </div>
        </WindowProvider>
    )
}