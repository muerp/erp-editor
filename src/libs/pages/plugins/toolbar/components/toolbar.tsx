import { Button, ColorPicker, SvgIcon } from "../../../components"
import { SelectView } from "../SelectView"
import { ToolbarButtonItem, ToolbarSelectItem, ToolbarItem, ToolbarColorPickerItem } from './type'

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import React from "react"

export const ToolbarButtonDefault: React.FC<ToolbarButtonItem> = ({ icon, className, title, method, disabled, active, onToggle }) => {
    return <Button id={method || ''} className={`toolbar-item${className ? ' ' + className : ''}`} title={title} disabled={disabled}
        active={active}
        onClick={() => {
            if (disabled) return;
            onToggle && onToggle();
        }}>
        <SvgIcon iconClass={icon || ''}></SvgIcon>
    </Button>
}

export const ToolbarButton = React.memo(ToolbarButtonDefault, (prev, next) => {
    return (
        prev.active === next.active &&
        prev.disabled === next.disabled &&
        prev.onToggle === next.onToggle &&
        prev.title === next.title
    )
})

export const ToolbarSelectDefault: React.FC<ToolbarSelectItem> = ({ method, disabled, icon, layout, className, direction, hideValue, maxWidth, active, width, title, list, value, onToggle, valueWidth }) => {
    return (
        <SelectView type={method} list={list || []}
            width={width}
            disabled={disabled}
            maxWidth={maxWidth}
            direction={direction}
            layout={layout}
            value={{ value: active }}
            onChange={item => {
                if (disabled) return;
                onToggle && onToggle(item);
            }}>
            <Button disabled={disabled} className={`toolbar-item${className ? ' ' + className : ''}`} title={title} width={valueWidth}>
                {!hideValue && <div className="t-text text-hideen">{value}</div>}
                {icon && <SvgIcon iconClass={icon}></SvgIcon>}
                <Button disabled={disabled} className="toolbar-item toolbar-angle-button">
                    <SvgIcon iconClass="angle" className="toolbar-angle"></SvgIcon>
                </Button>
            </Button>
        </SelectView>
    )
}

export const ToolbarSelect = React.memo(ToolbarSelectDefault, (prev, next) => {
    return (
        prev.active === next.active &&
        prev.disabled === next.disabled &&
        prev.value === next.value &&
        prev.onToggle === next.onToggle &&
        prev.list === next.list
    )
})

export const ToolbarColorPickerDefault: React.FC<ToolbarColorPickerItem> = ({ className, defaultColor, icon, onToggle, color, method, title }) => {
    return (
        <ColorPicker id={method} defaultColor={defaultColor} color={color}
            onChange={color => {
                onToggle && onToggle(color)
            }}>
            <Button className={`toolbar-item${className ? ' ' + className : ''}`}
                title={title}>
                <div className="d-cloumn">
                    <SvgIcon iconClass={icon || ''}></SvgIcon>
                    <div className="target-color"></div>
                </div>
                <Button className="toolbar-item toolbar-angle-button">
                    <SvgIcon iconClass="angle" className="toolbar-angle"></SvgIcon>
                </Button>
            </Button>
        </ColorPicker>
    )
}

export const ToolbarColorPicker = React.memo(ToolbarColorPickerDefault, (prev, next) => {
    return (
        prev.color === next.color &&
        prev.onToggle === next.onToggle
    )
})

export interface ToolbarProps {
    items: ToolbarItem[],
    mode?: string
    onRefresh?: () => void
}
export const Toolbar = forwardRef(({ items, mode, onRefresh }: ToolbarProps, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => ({
        command: (key: string) => {
            if (key !== 'italic' && key !== 'underline' && key !== 'ordered' && key !== 'unordered') {
                const dom = containerRef.current?.querySelector<HTMLElement>('#' + key);
                if (dom) {
                    dom.click();
                }
            }
        }
    }))

    const defaultRenderItem = React.useCallback(
        (item: ToolbarItem, index: number) => {
            if (item.type === 'separator') return <div key={index} className="table-line" />
            const { type } = item
            switch (type) {
                case 'button':
                    return <ToolbarButton {...item} key={index} />
                case 'select':
                    return <ToolbarSelect {...item} key={index + ''} />
                case 'color':
                    return <ToolbarColorPicker key={index} {...item} />
            }
        },
        [],
    )
    const renderItem = React.useMemo(() => {
        return defaultRenderItem
    }, [defaultRenderItem])

    useEffect(() => {
        onRefresh && onRefresh();
    }, [items])

    return (
        <div ref={containerRef} className={`docx-toolbar${mode ? ' toolbar-' + mode : ''}`}>
            {
                items.map((item, index) => {
                    return renderItem(item, index);
                })
            }
        </div>
    )
})