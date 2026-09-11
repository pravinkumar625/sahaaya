import { useEffect, useRef, useState } from 'react';

/**
 * Hook that tracks global cursor position
 * @returns {{ x: number, y: number }} Cursor coordinates
 */
export function useCursorPos() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return pos;
}

/**
 * Hook that returns a ref and current cursor pos relative to the viewport.
 * Used internally by other hooks.
 */
export function useRawCursorPos() {
  const posRef = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return posRef;
}
