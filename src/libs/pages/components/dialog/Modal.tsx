import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { Button } from ".."
import React from "react"

export interface ModalProps {
    children?: any,
    className?: string
    title?: string
    onClose?: () => void
    width?: number | string
    subTitle?: string
    hideShadow?: boolean
    hideCloseButton?: boolean
    contentClassName?: string
}
export const Modal = forwardRef(({ className, contentClassName, children, title, subTitle, onClose, hideCloseButton, width, hideShadow}: ModalProps, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({
        close: () => {
            closeHandle();
        }
    }))
    useEffect(() => {
        if (!contentRef.current) return;
        contentRef.current.classList.add('show')
        if (!modalRef.current) return;
        modalRef.current.style.width = width + (typeof width === 'number' ? 'px' : '')
    }, [width])
    const closeHandle = () => {
        if (!contentRef.current) return;
        contentRef.current.classList.remove('show');
        contentRef.current.classList.add('hide');
        setTimeout(() => {
            onClose && onClose();
        }, 300);
    }
    return (
        <div ref={contentRef} className={`modal-layer d-center${className ? ' ' + className : ''}${hideShadow ? ' hide-shadow' : ''}`}>
            <div ref={modalRef} className={`modal d-column${contentClassName? ' '+contentClassName:''}`}>
                {title && <div className="modal-title">{title}</div>}
                {subTitle && <div className="modal-sub-title">{subTitle}</div>}
                {!hideCloseButton && <Button className="btn-close" type="font-bg-black" onClick={closeHandle}><i className="icon-a3"></i></Button>}
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    )
})
