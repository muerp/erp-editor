import { useCallback, useEffect, useRef, useState } from "react";
import { cssPx } from "../../utils";
import { SvgIcon } from "../../components";

export interface DropItem {
    title?: string
    icon?: string
    line?: boolean
    className?: string
    [key: string]: any
}
interface SelectViewProps {
    children?: any,
    className?: string
    list: DropItem[],
    onChange?: (item: any) => void,
    value?: DropItem
    direction?: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
    width?: number | string
    maxWidth?: number | string
    offsetX?: number
    offsetY?: number
    layout?: string
    id?: string
    type?: string
    disabled?: boolean
}
export const SelectView = ({
    id, type, list, onChange, value,
    maxWidth, children,
    layout,
    disabled,
    className, direction, width, offsetX, offsetY
}: SelectViewProps) => {
    const [show, setShow] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const timer = useRef<any>()
    const [hoverIdx, setHoverIdx] = useState<number>(-1)
    const onClickItem = (item: DropItem) => {
        onChange && onChange(item);
    }
    useEffect(() => {
        // layout
        const onKeyDown = (e: KeyboardEvent) => {
            if (!show) return;
            e.preventDefault();
            if (e.key === 'ArrowLeft') {
                if (layout !== 'row') return;
                if (hoverIdx > 0) {
                    setHoverIdx(hoverIdx - 1);
                } else {
                    setHoverIdx(list.length - 1);
                }
            } else if (e.key === 'ArrowRight') {
                if (layout !== 'row') return;
                if (hoverIdx < list.length - 1) {
                    setHoverIdx(hoverIdx + 1);
                } else {
                    setHoverIdx(0);
                }
            } else if (e.key === 'ArrowDown') {
                if (layout === 'row') return;
                if (hoverIdx < list.length - 1) {
                    setHoverIdx(hoverIdx + 1);
                } else {
                    setHoverIdx(0);
                }
            } else if (e.key === 'ArrowUp') {
                if (layout === 'row') return;
                if (hoverIdx > 0) {
                    setHoverIdx(hoverIdx - 1);
                } else {
                    setHoverIdx(list.length - 1);
                }
            } else if (e.key === 'Enter') {
                // console.log('-d-d--')
                if (hoverIdx > -1 && list[hoverIdx]) {
                    onClickItem(list[hoverIdx])
                    setShow(false);
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [hoverIdx, show])
    useEffect(() => {
        if (!contentRef.current) return;
        contentRef.current.style.setProperty('--offset-x', offsetX ? offsetX + 'px' : '0');
        contentRef.current.style.setProperty('--offset-y', offsetY ? offsetY + 'px' : '0');
    }, [offsetY, offsetX])
    const onClose = () => {
        if (!dropRef.current) return;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            if (!dropRef.current) return;
            dropRef.current.classList.remove('show');
            dropRef.current.classList.add('hide');
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                setShow(false);
            }, 250)
        }, 150);
    };
    useEffect(() => {
        if (show) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                window.addEventListener('mousedown', onClose);
            }, 50);
        } else {
            window.removeEventListener('mousedown', onClose);
        }
        return () => {
            window.removeEventListener('mousedown', onClose);
        }
    }, [show])
    const onClick = useCallback((e: React.MouseEvent) => {
        if (disabled) return;
        e.stopPropagation();
        
        clearTimeout(timer.current);
        if (show) {
            onClose();
        } else {
            setShow(true);
        }
    }, [show, disabled])
    useEffect(() => {
        if (!dropRef.current) return;
        if (show) {
            dropRef.current.classList.add('show');
        }
    }, [show]);
    return (
        <div ref={contentRef} className={`form-select ${className ? ' ' + className : ''}`}>
            {children ? <div id={id} onClick={onClick}>{children}</div> : <div className="drop-select d-flex" onClick={onClick}><span>{value && value.title}</span> <i className="icon-a11"></i></div>}
            {
                show && <div ref={dropRef}
                    className={`drop-view${direction ? ' ' + direction : ' bottom-right'}${layout ? ' layout-' + layout : ''}`}
                    style={{ width: cssPx(width), maxWidth: cssPx(maxWidth, 'auto') }}>
                    {
                        list.map((item: DropItem, i: any) => (
                            item.line ? (
                                <div className='drop-line' key={i + '-drop'}></div>) :
                                (
                                    <div className={`drop-item d-left-center${item.className ? ' ' + item.className : ''}${hoverIdx === i ? ' hovered' : ''}${value && ((value.value && value.value === item.value) || (value.icon && value.icon === item.icon)) ? ' active' : ''}`}
                                        key={i + '-drop'} onClick={(e) => {
                                            e.stopPropagation();
                                            onClickItem(item)
                                        }} onPointerEnter={() => {
                                            setHoverIdx(i);
                                        }} onPointerLeave={() => {
                                            setHoverIdx(-1);
                                        }}>
                                        {
                                            item.icon && <SvgIcon iconClass={`${item.icon}`}></SvgIcon>
                                        }
                                        {item.title && <span style={{ fontFamily: type === 'select-font' ? item.value : '' }}>{item.title}</span>}
                                    </div>
                                )
                        ))
                    }
                </div>
            }
        </div>
    )
}