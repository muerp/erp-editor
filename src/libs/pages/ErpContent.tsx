import { useEffect, useState } from "react"
import {
    ContentEditable,
    useEditable,
    useReadOnly,
} from '@editablejs/editor'

import {
    InlineToolbar
} from './plugins'

interface ErpContentProps {
    theme?: string
    readOnly?: boolean
}
export const ErpContent = ({theme, readOnly}: ErpContentProps) => {
    const [selectionDrawingStyle, setSelectionDrawingStyle] = useState({})
    const editor = useEditable()
    const [_, setReadOnly] = useReadOnly()
    useEffect(()=>{
        setReadOnly(!!readOnly)
    }, [editor, readOnly])
    useEffect(() => {
        if (theme === 'dark') {
            setSelectionDrawingStyle({
                focusColor: 'rgba(149, 195, 257, 0.4)',
                blurColor: 'rgba(136, 136, 136, 0.3)',
                caretColor: '#fff',
                caretWidth: 1,
                dragColor: 'rgb(37, 99, 235)',
                touchWidth: 2,
                touchColor: 'rgb(37, 99, 235)',
            })
        } else {
            setSelectionDrawingStyle({
                focusColor: 'rgba(0,127,255,0.3)',
                blurColor: 'rgba(136, 136, 136, 0.3)',
                caretColor: '#000',
                caretWidth: 1,
                dragColor: 'rgb(37, 99, 235)',
                touchWidth: 2,
                touchColor: 'rgb(37, 99, 235)',
            })
        }
        InlineToolbar.setTheme(editor, theme || 'light');
    }, [theme])
    return (
        <ContentEditable
            lang={'en-US'}
            className='dox-inner'
            autoFocus={!readOnly}
            readOnly={readOnly}
            placeholder={readOnly ? '' : '请输入存量'}
            selectionDrawingStyle={selectionDrawingStyle}
        ></ContentEditable>
    )
}