import { forwardRef } from "react";
import { DOMProps } from "../../interface";


export const Between = forwardRef(({children, className, ...props}: DOMProps, ref: any) => {
    return (
        <div ref={ref} className={`d-between${className? ' '+className:''}`} {...props}>
            {children}
        </div>
    )
})