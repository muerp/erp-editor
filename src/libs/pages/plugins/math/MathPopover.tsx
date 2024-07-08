import { FC, useEffect, useState } from "react"
import { MathMLEditor } from './math-editor'
import {
    Popover,
    PopoverTrigger,
} from '@editablejs/ui'
import {
    useNodeFocused,
    useReadOnly,
} from '@editablejs/editor'
import React from "react"

export interface MathPopoverProps {
    editor: MathMLEditor,
    children?: React.ReactNode
}

export const MathPopover: FC<MathPopoverProps> = ({
    children,
}) => {
    const focused = useNodeFocused()
    const [readOnly] = useReadOnly()
    const [popoverOpen, setPopoverOpen] = useState(false)
    const handlePopoverOpenChange = (open: boolean) => {
        if (focused) {
            setPopoverOpen(true)
        } else {
            setPopoverOpen(open)
        }
    }
    useEffect(() => {
        // console.log("---focused--", focused, readOnly, popoverOpen)
      }, [focused, popoverOpen])
    return (
        <Popover
            open={readOnly ? false : popoverOpen}
            onOpenChange={handlePopoverOpenChange}
            trigger="hover"
        >
            <PopoverTrigger asChild>{children}</PopoverTrigger>
        </Popover>
    )
}
