import { RefObject, useEffect, useRef, useState } from 'react';

export function useResizeObserver(): {ref: RefObject<HTMLDivElement>, width: number, height: number} {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const observerRef: any = useRef();
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        // observerRef.current.unobserve(ref);
        observerRef.current.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    observerRef.current = new ResizeObserver(() => {
      if (!ref.current) return;
      setWidth(ref.current.offsetWidth)
      setHeight(ref.current.offsetHeight)
    });
    observerRef.current.observe(ref.current);
    return () => {
      observerRef.current.disconnect();
    }
  }, [ref]);
  return {ref, width, height};
}
