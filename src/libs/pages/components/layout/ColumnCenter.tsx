import { DOMProps } from "../../interface";

export const ColumnCenter= ({ children, className, ...props }: DOMProps) => {
    return (
        <div className={`d-column-center${className ? ' ' + className : ''}`} {...props}>
            {children}
        </div>
    )
}