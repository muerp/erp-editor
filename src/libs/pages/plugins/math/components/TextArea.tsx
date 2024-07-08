import { forwardRef, useImperativeHandle, useRef } from "react"

interface TextAreaProps {
    placeholder?: string
    value?: string
    rows?: number
    disabled?: boolean
    resizable?: boolean
    onChange?: (e: React.FormEvent<HTMLTextAreaElement>)=>void
}
export const TextArea = forwardRef(({ placeholder, value, rows, disabled, resizable, onChange }: TextAreaProps, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(ref, () => ({
        focus: () => {
            textareaRef.current?.focus();
        }
    }))
    return (
        <textarea ref={textareaRef}
            className={`textarea${disabled ? ' disabled' : ''}${resizable ? ' resizable' : ''}`}
            disabled={disabled}
            value={value}
            rows={rows || 4}
            placeholder={placeholder}
            onInput={(e) => {
                onChange && onChange(e)
            }}
        ></textarea>
    )
})