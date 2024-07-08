import { forwardRef } from "react";
import { DOMProps } from "../../interface";


export const Row = forwardRef(({children, className, ...props}: DOMProps, ref: any) => {
    return (
        <div ref={ref} className={`d-flex${className? ' '+className:''}`} {...props}>
            {children}
        </div>
    )
})