import { ReactNode } from "react"

interface ModalViewProps {
    className?: string
    children: ReactNode
    key?: string
    options?: any
    type?: string | number,
    direction?: string
}

export const ModalView = ({ children, className, direction }: ModalViewProps) => {
    return (
        <div className={`modal-view${className? ' '+className:''}${direction? ' dir-' + direction : ''}`}>
            {children}
        </div>
    )
}