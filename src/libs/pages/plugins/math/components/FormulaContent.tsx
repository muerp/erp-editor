import { hfmath } from '../hfmath';
import { useEffect, useMemo, useState } from "react"

interface FormulaContentProps {
  latex: string
  width: number
  height: number
}
export const FormulaContent = ({ latex, width, height }: FormulaContentProps) => {
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const [pathd, setPathd] = useState('');
  useEffect(() => {
    const eq = new hfmath(latex);
    setPathd(eq.pathd({}));
    const box = eq.box({})
    setBox(box);
  }, [latex])

  const scale = useMemo(() => {
    const boxW = box.w + 32
    const boxH = box.h + 32

    if (boxW > width || boxH > height) {
      if (boxW / boxH > width / height) {
        return width / boxW;
      }
      return height / boxH;
    }
    return 1;
  }, [box])
  return (
    <svg
      className="formula-content"
      overflow="hidden"
      width={box.w + 32}
      height={box.h + 32}
      stroke="#000"
      strokeWidth={1}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform={`scale(${scale}, ${scale}) translate(0,0) matrix(1,0,0,1,0,0)`}
        transform-origin="0 50%"
      >
        <path d={pathd}></path>
      </g>
    </svg>
  )
}