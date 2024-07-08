import { CSSProperties } from "styled-components"

export interface TabItem {
    key: string
    label: string
    color?: string
}
interface TabsProps {
    value: string
    tabs: TabItem[]
    card?: boolean
    tabsStyle?: CSSProperties
    tabStyle?: CSSProperties
    spaceAround?: boolean
    spaceBetween?: boolean
    onChange?: (key: string) => void
}
export const Tabs = ({ card, spaceAround, spaceBetween, tabsStyle, value, tabs, tabStyle, onChange }: TabsProps) => {
    return (
        <div className={`tabs${card ? ' card' : ''}${spaceAround ? ' space-around' : ''}${spaceBetween ? ' space-between' : ''}`}
            style={tabsStyle || {}}>
            {
                tabs.map(tab => (
                    <div
                        className={`tab${tab.key === value ? ' active' : ''}`}
                        key={tab.key}
                        style={{ ...(tabStyle || {}), '--color': tab.color } as any}
                        onClick={() => {
                            onChange && onChange(tab.key)
                        }}
                    >
                        {tab.label}
                    </div >
                ))
            }
        </div >
    )
}