
export interface MenuItem {
    key?: string
    text: string
    shortcutKey?: string
    children?: MenuItem[]
    line?: boolean
    active?: boolean
    ref?: React.MutableRefObject<any>
}