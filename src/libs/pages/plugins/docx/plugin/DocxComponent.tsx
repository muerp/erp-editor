import { RenderElementProps } from '@editablejs/editor'
import { Docx } from '../interfaces/docx'
// import React from 'react';
export interface DocxProps extends RenderElementProps<Docx> {
    
}

export const DocxComponent = ({ children, attributes, element }: DocxProps) => {
    const Tag = element.tagName || 'span';
    return (
        <Tag {...attributes} style={{...element.style}} className={(element.classList? element.classList?.join(' '):'')}>
            {children}
            {/* {Tag==='span'? children: <div tw="hidden absolute">{children}</div>} */}
            {/* <div tw="hidden absolute">{children}</div> */}
        </Tag>
    )
}