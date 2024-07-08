import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";



// const cursorLeft = 'w-resize';
// const cursorRight = 'e-resize';
// const cursorTop = 'n-resize';
// const cursorBottom = 's-resize';
// const cursorLeftTop = 'nw-resize';
// const cursorLeftBottom = 'sw-resize';
// const cursorRightTop = 'ne-resize';
// const cursorRightBottom = 'se-resize';

const cursorLeft = 'row-resize';
const cursorRight = 'row-resize';
const cursorTop = 'col-resize';
const cursorBottom = 'col-resize';
const cursorLeftTop = 'nwse-resize';
const cursorLeftBottom = 'nesw-resize';
const cursorRightTop = 'nesw-resize';
const cursorRightBottom = 'nwse-resize';


const CursorMap: { [key: string]: string } = {
  'left': cursorLeft,
  'right': cursorRight,
  'top': cursorTop,
  'bottom': cursorBottom,
  'left-top': cursorLeftTop,
  'left-bottom': cursorLeftBottom,
  'right-top': cursorRightTop,
  'right-bottom': cursorRightBottom,
  'box': 'move'
}

interface DragViewProps {
  type?: string
  className?: string;
  children?: ReactNode;
  width?: string | number;
  height?: string | number;
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  defaultCenter?: boolean
  direction?: 'right' | 'left' | 'bottom' | 'top' | 'around';
  lineHoverColor?: string;
  style?: any;
  isEqualRatio?: boolean
  onChangeSize?: (width: number, height: number) => void;
}
enum DragDirection {
  left = "left",
  top = "top",
  bottom = "bottom",
  right = "right",
}
export const DragView = ({
  type,
  className,
  children,
  width,
  height,
  minHeight = 0,
  maxHeight,
  style,
  direction = 'right',
  minWidth = 0,
  maxWidth,
  lineHoverColor = '',
  onChangeSize,
  defaultCenter,
  isEqualRatio
}: DragViewProps) => {
  useEffect(() => { }, []);
  const boxRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0 });
  const resizeRef = useRef(false);
  const [dragingDirection, setDragingDirection] = useState('');
  const dragingRef = useRef('');
  useEffect(() => {
    if (defaultCenter && direction === 'around' && boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      boxRef.current.style.left = `calc(50% - ${rect.width * 0.5}px)`;
      boxRef.current.style.top = `calc(50% - ${rect.height * 0.5}px)`;
    }
  }, [])
  useEffect(() => {
    if (!boxRef.current || !lineHoverColor) return;
    boxRef.current.style.setProperty(
      "--line-background-color",
      lineHoverColor
    );
  }, [lineHoverColor]);
  const setWidthFlex = (w: number) => {
    if (!boxRef.current) return;
    boxRef.current.style.width = `${w}px`;
    onChangeSize && onChangeSize(w, mouseRef.current.height);
  };
  const setHeightFlex = (h: number) => {
    if (!boxRef.current) return;
    boxRef.current.style.height = `${h}px`;
    onChangeSize && onChangeSize(mouseRef.current.width, h);
  };
  const onMouseUp = () => {
    dragingRef.current = '';
    resizeRef.current = false;
    window.document.body.style.cursor = "initial";
    window.document.body.classList.remove('drag-dragging');
    window.removeEventListener("mousemove", onMouseMove);
    setDragingDirection('');
    if (boxRef.current && boxRef.current.nextSibling) {
      (boxRef.current.nextSibling as HTMLDivElement).style.pointerEvents = "auto";
    }
  };
  const getMinWidth = () => {
    if (!boxRef.current) return 0;
    const style = window.getComputedStyle(boxRef.current);
    const min = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
    return Math.max(min, minWidth);
  }
  const getMinHeight = () => {
    if (!boxRef.current) return 0;
    const style = window.getComputedStyle(boxRef.current);
    const min = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
    return Math.max(min, minHeight || 0);
  }
  const onMouseMove = (e: MouseEvent) => {

    if (!resizeRef.current || !boxRef.current) return;
    if (dragingRef.current === 'box') {
      let dx = mouseRef.current.x - e.clientX;
      let dy = mouseRef.current.y - e.clientY;

      const pRect = (boxRef.current.parentNode as Element).getBoundingClientRect();
      
      const left = mouseRef.current.left - dx  - pRect.left;
      boxRef.current.style.left = `${left}px`;

      const top = mouseRef.current.top - dy - pRect.top;
      boxRef.current.style.top = `${top}px`;

      return;
    }
    if (isEqualRatio) {
      let sW = 0, sH = 0;
      if (dragingRef.current.includes(DragDirection.left)) {
        sW = mouseRef.current.width + mouseRef.current.x - e.clientX;
      } else if (dragingRef.current.includes(DragDirection.right)) {
        sW = mouseRef.current.width + e.clientX - mouseRef.current.x;
      }
      if (dragingRef.current.includes(DragDirection.top)) {
        sH = mouseRef.current.height + mouseRef.current.y - e.clientY;
      } else if (dragingRef.current.includes(DragDirection.bottom)) {
        sH = mouseRef.current.height + e.clientY - mouseRef.current.y;
      }
      const minW = getMinWidth();
      sW = sW < minW ? minW : sW;
      sW = maxWidth && sW > maxWidth ? maxWidth : sW;
      const minH = getMinHeight();
      sH = sH < minH ? minH : sH;
      sH = maxHeight && sH > maxHeight ? maxHeight : sH;

      const rect = boxRef.current.getBoundingClientRect();
      const pRect = (boxRef.current.parentNode as Element).getBoundingClientRect();
      if (sW / sH > rect.width / rect.height) {
        sW = rect.width / rect.height * sH;
        if (sW < minW) {
          sW = minW;
          sH = rect.height / rect.width * sW;
        }
      } else {
        sH = rect.height / rect.width * sW;
        if (sH < minH) {
          sH = minH;
          sW = rect.width / rect.height * sH;
        }
      }
      if (dragingRef.current.includes(DragDirection.left)) {
        const left = rect.right - sW - pRect.left;
        boxRef.current.style.left = `${left}px`;
      }
      setWidthFlex(sW);
      if (dragingRef.current.includes(DragDirection.top)) {
        const top = rect.bottom - sH - pRect.top;
        boxRef.current.style.top = `${top}px`;
      }
      setHeightFlex(sH);
      return;
    }
    if (dragingRef.current.includes(DragDirection.right)) {
      let sW = mouseRef.current.width + e.clientX - mouseRef.current.x;
      if (minWidth && sW < minWidth) {
        setWidthFlex(minWidth);
        return;
      }
      if (e.clientX !== mouseRef.current.x) {
        sW = minWidth && sW < minWidth ? minWidth : sW;
        sW = maxWidth && sW > maxWidth ? maxWidth : sW;
        setWidthFlex(sW);
      }
    }
    if (direction === 'around' && dragingRef.current.includes(DragDirection.left)) {
      const rect = boxRef.current.getBoundingClientRect();
      const pRect = (boxRef.current.parentNode as Element).getBoundingClientRect();
      let sW = mouseRef.current.width + mouseRef.current.x - e.clientX;
      const min = getMinWidth();
      sW = sW < min ? min : sW;
      sW = maxWidth && sW > maxWidth ? maxWidth : sW;
      const left = rect.right - sW - pRect.left;
      boxRef.current.style.left = `${left}px`;
      setWidthFlex(sW);
    } else if (dragingRef.current.includes(DragDirection.left)) {
      let sW = mouseRef.current.width + mouseRef.current.x - e.clientX;
      if (minWidth && sW < minWidth) {
        setWidthFlex(minWidth);
        return;
      }
      if (e.clientX !== mouseRef.current.x) {
        sW = minWidth && sW < minWidth ? minWidth : sW;
        sW = maxWidth && sW > maxWidth ? maxWidth : sW;
        setWidthFlex(sW);
      }
    }

    if (dragingRef.current.includes(DragDirection.bottom)) {
      let sW = mouseRef.current.height + e.clientY - mouseRef.current.y;
      if (minHeight && sW < minHeight) {
        setHeightFlex(minHeight);
        return;
      }
      if (e.clientY !== mouseRef.current.y) {
        sW = minHeight && sW < minHeight ? minHeight : sW;
        sW = maxHeight && sW > maxHeight ? maxHeight : sW;
        setHeightFlex(sW);
      }
    }

    if (direction === 'around' && dragingRef.current.includes(DragDirection.top)) {
      const rect = boxRef.current.getBoundingClientRect();
      const pRect = (boxRef.current.parentNode as Element).getBoundingClientRect();
      let sH = mouseRef.current.height + mouseRef.current.y - e.clientY;
      const min = getMinHeight();
      sH = sH < min ? min : sH;
      sH = maxHeight && sH > maxHeight ? maxHeight : sH;
      const top = rect.bottom - sH - pRect.top;
      boxRef.current.style.top = `${top}px`;
      setHeightFlex(sH);
    } else if (dragingRef.current.includes(DragDirection.top)) {
      let sH = mouseRef.current.height + mouseRef.current.y - e.clientY;
      if (minHeight && sH < minHeight) {
        setHeightFlex(minHeight);
        return;
      }
      if (e.clientY !== mouseRef.current.y) {
        sH = minHeight && sH < minHeight ? minHeight : sH;
        sH = maxHeight && sH > maxHeight ? maxHeight : sH;
        setHeightFlex(sH);
      }
    }
  };
  const onMouseDown = (e: any, direction: string) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    dragingRef.current = direction;
    resizeRef.current = true;

    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    mouseRef.current.top = rect.top;
    mouseRef.current.left = rect.left;
    mouseRef.current.width = rect.width;//boxRef.current.offsetWidth;
    mouseRef.current.height = rect.height;//boxRef.current.offsetHeight;
    window.document.body.style.cursor = CursorMap[dragingRef.current];
    window.document.body.classList.add('drag-dragging');
    setDragingDirection(direction);
    if (boxRef.current.nextSibling) {
      (boxRef.current.nextSibling as HTMLDivElement).style.pointerEvents = "none";
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp, { once: true });
  };
  useLayoutEffect(() => {
    if (!boxRef.current) return;
    const mousedown = (e: any) => {
      onMouseDown(e, 'box')
    }
    boxRef.current.querySelectorAll('.drag-unit').forEach(el => {
      el.removeEventListener('mousedown', mousedown);
      el.addEventListener('mousedown', mousedown);
    })
  }, [children])
  return (
    <div
      className={`drag-view${type ? ' drag-' + type : ''}${className ? ' ' + className : ''}`}
      ref={boxRef}
      style={{ ...style, width: width, height: height }}
    >
      {children}
      {
        direction === 'around' && !isEqualRatio &&
        <>
          <div
            className={`drag-line drag-left${dragingDirection === 'left' ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, 'left')
            }}
          />
          <div
            className={`drag-line drag-right${dragingDirection === 'right' ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, 'right')
            }}
          />
          <div
            className={`drag-line drag-top${dragingDirection === 'top' ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, 'top')
            }}
          />
          <div
            className={`drag-line drag-bottom${dragingDirection === 'bottom' ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, 'bottom')
            }}
          />
        </>
      }
      {
        (direction === 'around' || isEqualRatio) &&
        <>
          <div
            className={`drag-box drag-left-top${dragingDirection === 'left-top' ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, 'left-top')
            }}
          />
          <div
            className={`drag-box drag-left-bottom${dragingDirection === 'left-bottom' ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, 'left-bottom')
            }}
          />
          <div
            className={`drag-box drag-right-top${dragingDirection === 'right-top' ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, 'right-top')
            }}
          />
          <div
            className={`drag-box drag-right-bottom${dragingDirection === 'right-bottom' ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, 'right-bottom')
            }}
          />
        </>
      }
      {
        direction !== 'around' && !isEqualRatio &&
        <>
          <div
            className={`drag-line drag-${direction || "right"}${dragingDirection ? ' show' : ''}`}
            onMouseDown={(e) => {
              onMouseDown(e, direction)
            }}
          />
        </>
      }
    </div>
  );
};