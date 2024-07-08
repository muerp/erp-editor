import React, { forwardRef } from "react"
import { ReactNode } from "react"
import { DOMProps } from './interface'
export interface ButtonProps extends DOMProps {
    className?: string
    children?: ReactNode
    type?: string
    width?: number
    title?: string
    disabled?: boolean
    onClick?: (e: React.MouseEvent) => void
    active?: boolean
    id?: string
}
export const Button = forwardRef(({ id, className, children, type, onClick, width, title, active, disabled, ...props }: ButtonProps, ref: any) => {
    return (
        <div ref={ref} id={id}
        className={`btn${className ? ' ' + className : ''}${type ? ' btn-' + type : ''}${active? ' active':''}${disabled ? ' disabled' : ''}`} 
        onClick={(e) => { !disabled && onClick && onClick(e) }} style={{ width: width }} {...props}>
            {children}
            {title && <span className="ui-tips">{title}</span>}
        </div>
    )
})