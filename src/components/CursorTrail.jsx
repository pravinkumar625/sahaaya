import { useEffect, useRef } from 'react';
import { useRawCursorPos } from '../hooks/useCursorPos';

const TRAIL_LENGTH = 22;
const PARTICLE_RADIUS = 8;

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const trailRef = useRef([]);
  const cursorPosRef = useRawCursorPos();
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x, y } = cursorPosRef.current;

      // Push new position to trail
      trailRef.current.unshift({ x, y });
      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current.pop();
      }

      // Draw trail
      trailRef.current.forEach((point, i) => {
        const progress = 1 - i / TRAIL_LENGTH;
        const radius = PARTICLE_RADIUS * progress;
        const alpha = progress * 0.35;

        // Gradient from teal to violet along trail
        const t = i / TRAIL_LENGTH;
        const r = Math.round(0 + t * 124);
        const g = Math.round(245 - t * 187);
        const b = Math.round(212 - t * (212 - 237));

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 2.5);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cursorPosRef]);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-canvas"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
