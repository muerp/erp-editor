import { DropItem } from "../SelectView"

export interface ProvenanceItem {
    title: string
    type?: string
}
export interface ToolbarButtonItem {
    icon?: string,
    type: string,
    title?: string
    method?: string,
    active?: boolean | any
    className?: string
    width?: number
    disabled?: boolean
    onToggle?: (item?: any) => void
}
export interface ToolbarSelectItem {
    icon?: string,
    type: string,
    title?: string
    method?: string,
    active?: boolean | any
    className?: string
    value?: string
    width?: number
    valueWidth?: number
    layout?: string
    list?: DropItem[]
    maxWidth?: number
    disabled?: boolean
    hideValue?: boolean
    direction?: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
    onToggle?: (item?: any) => void
}
export interface Separatoritem {
    type: 'separator'
}
export interface ToolbarColorPickerItem {
    type: string
    icon?: string
    method?: string
    defaultColor?: string
    color?: string
    className?: string
    title?: string
    onToggle?: (item?: any) => void

}

export interface ToolbarOptions {
    accentColor?: string,
    majorContentColor?: string,
    provenances: ProvenanceItem[],
    imageBase64?: boolean,
    isReadOnly?: boolean
    onChange?: (type: string, value?: any) => void
}

export type ToolbarItem = ToolbarButtonItem | ToolbarSelectItem | Separatoritem | ToolbarColorPickerItem
