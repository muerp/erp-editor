import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

interface TitleInputProps {
    className?: string
    children?: React.ReactNode
    title?: string
    readOnly?: boolean
    inputTag?: boolean
    [key: string]: any
}
export const TitleInput = forwardRef(({
    readOnly, className, children, title, onEnter,
    inputTag,
    ...props
}: TitleInputProps, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
        blur() {
            inputRef.current?.blur();
        }
    }))
    useEffect(() => {
        if (!inputRef.current) return;
        const val = (!title || title === '新建模型' ? '' : title).replace(/\n/g, '');
        if (val !== inputRef.current.innerText) {
            inputRef.current.innerText = val;
        }
    }, [title])
    return (
        <div className={`title-input erp-title ${className ? ' ' + className : ''}`}>
            {!inputTag && <div className="input-inner" ref={inputRef} contentEditable={!readOnly} {...props}></div>}
            {
                inputTag && <input ref={inputRef}
                    value={title}
                    {...props}
                />
            }
            {children}
        </div>
    )
})