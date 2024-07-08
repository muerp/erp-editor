import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, ModalProps } from './Modal';
interface DialogProps extends ModalProps {
    show?: boolean,
    children?: any,
    [key: string]: any
}

export const Dialog = forwardRef(({ show, children, ...props }: DialogProps, ref) => {
    const modalRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        close: () => {
            modalRef.current?.close()
        }
    }))
    return (
        <>
            {
                show && <Modal {...props} ref={modalRef}>
                    {children}
                </Modal>
            }
        </>
    )
})