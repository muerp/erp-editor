import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
export interface DropViewProps {
    children?: any,
    className?: string
    button?: React.ReactNode
    direction?: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
    onClose?: () => void
    id?: string
}
export const DropView = forwardRef(({ id, children, className, button, direction, onClose }: DropViewProps, ref: any) => {
    const [show, setShow] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null);
    const timer = useRef<any>()
    const closeHandler = () => {
        if (!dropRef.current) return;
        dropRef.current.classList.remove('show');
        dropRef.current.classList.add('hide');
        clearTimeout(timer.current);
        onClose && onClose();
        timer.current = setTimeout(() => {
            setShow(false);
        }, 250)
    };
    useImperativeHandle(ref, () => ({
        show: () => {
            onClick();
        },
        close: () => {
            closeHandler();
        },
        query(filter: string) {
            return containerRef.current?.querySelector(filter);
        }
    }))
    useEffect(() => {
        if (show) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                window.addEventListener('mousedown', closeHandler);
            }, 50);
        } else {
            window.removeEventListener('mousedown', closeHandler);
        }
        return () => {
            window.removeEventListener('mousedown', closeHandler);
        }
    }, [show])
    const onClick = useCallback(() => {
        clearTimeout(timer.current);
        if (show) {
            closeHandler();
        } else {
            setShow(true);
        }
    }, [show])
    useEffect(() => {
        if (!dropRef.current) return;
        if (show) {
            dropRef.current.classList.add('show');
            const els = dropRef.current.querySelectorAll('.close')
            els.forEach(el => {
                el.addEventListener('click', () => {
                    closeHandler();
                })
            })
        }
    }, [onClick, show]);
    const topClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }
    return (
        <div ref={containerRef} className={`form-select drop${className ? ' ' + className : ''}`} onClick={topClick}>
            {button && <div id={id} onClick={onClick}>{button}</div>}
            {
                show && 
                <div ref={dropRef} className={`drop-view${direction? ' '+direction:' bottom-right'}`} 
                onMouseDown={e => e.stopPropagation()}>
                    {children}
                </div>
            }
        </div>
    )
})