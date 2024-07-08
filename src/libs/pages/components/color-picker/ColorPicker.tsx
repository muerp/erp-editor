import { RgbaStringColorPicker } from "react-colorful"
import { ReactNode, useEffect, useRef, useState } from "react"
import { Button, SvgIcon } from ".."
import { DropView, DropViewProps } from "../dialog"
import { Row } from "../layout/Row"
import { Palette } from "./palette"
import { Between } from "../layout/Between"
import { colord } from "colord"

interface ColorPickerProps extends DropViewProps {
  defaultColor?: string
  children?: ReactNode
  color?: string
  onChange?: (color: string) => void
  id?: string
}


export const ColorItem = ({ color, active, onClick }: { color: string, active?: boolean, onClick: () => void }) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    if (active) {
      ref.current.style.color = colord(color).isLight() ? '#000' : '#fff';
    }
  }, [active, color])
  return (
    <Button ref={ref} onClick={onClick}
      style={{ backgroundColor: color }}
      className={`color-item${active ? ' active-color' : ''}`} >
        {active && <SvgIcon iconClass="yes"></SvgIcon>}
      </Button>
  )
}

export const ColorPicker = ({ id, defaultColor, children, color, onChange }: ColorPickerProps) => {
  const [recents, setRecents] = useState<string[]>([])
  const [value, setValue] = useState('');
  const [inputColor, setInputColor] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLInputElement>(null);
  const [showRange, setShowRange] = useState(false);
  const dialogRef = useRef<any>()
  const [direction, setDirectrion] = useState('');
  useEffect(()=>{
    const targetColor = dialogRef.current?.query('.target-color');
    if (targetColor) {
      targetColor.style.backgroundColor = color || 'transparent';
    }
  }, [color])
  useEffect(() => {
    const initColor = color || defaultColor;
    setValue(initColor? colord(initColor).toRgbString():'');
    const r = localStorage.getItem('__colors')
    if (r) {
      try {
        setRecents(JSON.parse(r));
      } catch (e) {
        //
      }
    }
  }, [defaultColor])
  const onSelectColor = (color: string) => {
    const s = [...recents];
    const idx = s.findIndex(r => r === color);
    if (idx !== -1) {
      s.splice(idx, 1);
    }
    s.unshift(color);
    if (s.length > 30) {
      s.length = 30;
    }
    setRecents(s);
    setValue(color? colord(color).toRgbString(): '');
    onChangeColor(color);
    dialogRef.current?.close();
  }
  useEffect(() => {
    localStorage.setItem('__colors', JSON.stringify(recents))
  }, [recents])

  const onChangeColor = (color?: string) => {
    const targetColor = dialogRef.current?.query('.target-color');
    if (targetColor) {
      targetColor.style.backgroundColor = color || 'transparent';
    }
    onChange && onChange(color? colord(color).toHex():'')
  }
  return (
    <DropView id={id} ref={dialogRef} className="color-picker" button={children} onClose={() => {
      setShowRange(false);
    }}>
      {
        defaultColor && <Row className="default-color" onClick={()=> {
          onSelectColor(defaultColor||'');
         }}>
        <ColorItem color={defaultColor || '#000'} onClick={() => {
          onSelectColor(defaultColor || '#000');
        }}></ColorItem>
        <span>Default color</span>
      </Row>
      }
      {
         !defaultColor && <Row className="default-color" onClick={()=> {
          onSelectColor(defaultColor||'');
         }}>
         <span>No color</span>
       </Row>
      }
      
      <div className="color-grid">
        {
          Palette.colors.map(color => (
            <ColorItem color={color} key={color}
              active={colord(value).isEqual(color)}
              onClick={() => {
                onSelectColor(color);
              }}></ColorItem>
          ))
        }
      </div>
      {
        recents.length > 0 && <><div className="color-title">Recently used</div><div className="color-grid">
          {
            recents.map(color => (
              <ColorItem color={color} key={color}
                active={colord(value).isEqual(color)}
                onClick={() => {
                  onSelectColor(color);
                }}></ColorItem>
            ))
          }
        </div></>}
      <Between ref={moreRef} className="color-more" onClick={() => {
        if (!moreRef.current) return;
        const rect = moreRef.current.getBoundingClientRect()
        if (rect?.right > window.document.body.offsetWidth - 400) {
          setDirectrion('left')
        } else {
          setDirectrion('');
        }
        setShowRange(!showRange);
      }}>
        <span>More colors</span>
        <SvgIcon iconClass="arrow-right"></SvgIcon>
      </Between>

      <div className={`rgb-color absolute${showRange ? ' active' : ''}${direction? ' ' + direction:''}`}>
        <RgbaStringColorPicker color={value} onChange={color => {
          setValue(color);
        }}></RgbaStringColorPicker>
        <Row className="color-bottom">
          <input ref={inputRef} className="color-input" value={inputColor || colord(value).toHex() || ''} onChange={(e) => {
            const str = e.target.value;
            let color = '#'
            for (let i = 0; i < str.length; ++i) {
              const char = str[i].toUpperCase();
              if (i === 0 && char === '#') {
                continue;
              }
              if ((char >= "A" && char <= "F") || (char >= "0" && char <= "9")) {
                color += char;
              }
              if (color.length >= 9) {
                break;
              }
            }
            setInputColor(color);
          }} onBlur={() => {
            if (colord(inputColor).isValid()) {
              setValue(colord(inputColor).toRgbString());
              setInputColor('');
            } else {
              setInputColor('');
            }
          }} onKeyDown={e => {
            if (e.key === 'Enter') {
              inputRef.current?.blur();
            }
          }}></input>
          <Button type="font-bg-black" disabled={defaultColor? colord(value).isEqual(defaultColor):false} className="color-confirm" onClick={()=>{
            onSelectColor(value);
          }}>Confirm</Button>
        </Row>
      </div>
    </DropView >
  )
}