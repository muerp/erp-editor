import { ReactNode, forwardRef, useEffect, useRef, useState, useMemo } from 'react'
// import { DocxEditor } from './docx-editor'
import { Editable, ElementAttributes, useIsomorphicLayoutEffect, useNodeFocused, useReadOnly } from '@editablejs/editor'
import { MathML } from '../interface/math'
import { hfmath } from '../hfmath'
import { MathMLEditor } from '../plugin/math-editor'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Toolbar,
  Tooltip,
  ToolbarButton,
} from '@editablejs/ui'
import { EditButton } from './EditButton'
import { DATA_MATH_KEY } from '../constants'
import { useMathViewer } from '../hooks/use-math-viewer'

export interface MathMLProps extends ElementAttributes<MathML> {
  element: MathML,
  children?: ReactNode
  editor: MathMLEditor
}
export const MathMLComponent = forwardRef<{ current: HTMLDivElement }, MathMLProps>(
  ({ children, element, editor, ...props }, ref: any) => {
    const [latex, setLatex] = useState('');
    const [box, setBox] = useState<{ w: number, h: number }>({ w: 0, h: 0 })
    const focused = useNodeFocused()
    const [readOnly] = useReadOnly()
    const [popoverOpen, setPopoverOpen] = useState(false)
    const isFocusedMouseDownBefore = useRef(false);
    const [latexSize, setLatexSize] = useState<{ w: number, h: number }>({ w: 0, h: 0 })
    const viewer = useMathViewer();
    useEffect(() => {
      if (element.latex && ref) {
        const eq = new hfmath(element.latex)
        setLatex(eq.pathd({}))
        const box = eq.box({})
        setBox(box);
      }
    }, [element.latex])



    const scale = useMemo(() => {
      if (!ref.current) return 1;
      const boxW = box.w + 32;
      const width = ref.current.parentNode.getBoundingClientRect().width;
      let bw = boxW;
      let bh = box.h + 32;
      let scale = 1;
      if (boxW > width) {
        bh = bh /bw  * width;
        bw = width;
        scale = width / boxW;
      }
      setLatexSize({w: bw, h: bh});
      return scale;
    }, [box.h, box.w])

    const renderMath = () => {
      const atts = {
        [DATA_MATH_KEY]: Editable.findKey(editor, element).id,
      }
      return (
        <svg
          {...atts}
          // pointerEvents={'none'}
          width={latexSize.w}
          height={latexSize.h}
          // className="formula-content"
          strokeWidth={1}
          strokeLinecap='round'
          strokeLinejoin='round'
          stroke="#000"
          fill="none">
          <g transform={`scale(${scale}, ${scale}) translate(0,0) matrix(1,0,0,1,0,0)`}
            transform-origin="0 50%">
            <path d={latex}></path>
          </g>
        </svg>
      )
    }
    useIsomorphicLayoutEffect(() => {
      setPopoverOpen(focused)
    }, [focused])
    const handlePopoverOpenChange = (open: boolean) => {
      if (focused) {
        setPopoverOpen(true)
      } else {
        setPopoverOpen(open)
      }
    }
    const handleDown = () => {
      // editor
      isFocusedMouseDownBefore.current = focused
    }
    return (
      <Popover
        open={readOnly ? false : popoverOpen}
        onOpenChange={handlePopoverOpenChange}
        trigger="hover"
      >
        <PopoverTrigger asChild>
          <div {...props} ref={ref} className={`docx-math`} onMouseDown={handleDown}>
            <div className={`math-block${focused ? ' active' : ''}`}>
              {renderMath()}
              <div className='hidden absolute'>{children}</div>
            </div>
          </div >
        </PopoverTrigger>
        <PopoverContent className='math-popover' autoUpdate={true} side="bottom" sideOffset={5}>
          <Toolbar mode="inline">
            <Tooltip content={'修改'} side="top" sideOffset={5} arrow={false}>
              <ToolbarButton
                icon={<EditButton />}
                onToggle={() => { 
                  viewer.open(Editable.findPath(editor, element), element.latex) 
                }}
              />
            </Tooltip>
          </Toolbar>
        </PopoverContent>
      </Popover>
    )
  })