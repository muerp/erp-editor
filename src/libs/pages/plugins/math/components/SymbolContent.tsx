import { hfmath } from "../hfmath";
import { useEffect, useState } from "react"

interface SymbolContentProps {
    latex: string
}
export const SymbolContent = ({ latex }: SymbolContentProps) => {
    const [svg, setSvg] = useState('');
    useEffect(() => {
        const eq = new hfmath(latex)
        setSvg(eq.svg({
            SCALE_X: 10,
            SCALE_Y: 10,
        }))
    }, [])
    return (
        <div className="symbol-content" dangerouslySetInnerHTML={{ __html: svg }}></div>
    )
}