import React from "react"

interface ModalProps {
    className?: string
    children?: React.ReactNode
    width?: string
}
export const Modal = ({className, children, width}: ModalProps) => {
    return (
        <div className={`dialog-modal${className? ' '+className:''}`}>
            <div className="mask"></div>
            <div className="modal-content" style={{width: width}}>
                {children}
            </div>
        </div>
    )
}