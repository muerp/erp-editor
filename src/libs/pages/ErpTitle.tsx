import { ElementAttributes, useEditable } from "@editablejs/editor"
import { FC, useContext } from "react"
import { TitleInput } from "./TitleInput"
import { WindowContext } from "./plugins/window"
import React from "react"

export interface TitleComponentProps {
    attributes: ElementAttributes
    children: any
}

export const ErpTitle: FC<TitleComponentProps> = ({ children }) => {
    const { title, setTitle } = useContext(WindowContext);
    const editor = useEditable();
    const onEnter = () => {
        // console.log('---', editor.children)
        // Transforms.select(editor, Editor.range(editor, []))
    }
    return (
        <>
            <TitleInput title={title} placeholder='请提炼模型'
                onEnter={onEnter}></TitleInput>
            <div className='hidden absolute'>{children}</div>
        </>
    )
}