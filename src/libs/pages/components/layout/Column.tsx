import { DOMProps } from "../../interface";

export const Column = ({ children, className, ...props }: DOMProps) => {
    return (
        <div className={`d-column${className ? ' ' + className : ''}`} {...props}>
            {children}
        </div>
    )
}