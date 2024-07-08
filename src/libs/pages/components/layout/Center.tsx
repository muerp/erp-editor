import { DOMProps } from "../../interface";

export const Center = ({ children, className, ...props }: DOMProps) => {
    return (
        <div className={`d-center${className ? ' ' + className : ''}`} {...props}>
            {children}
        </div>
    )
}