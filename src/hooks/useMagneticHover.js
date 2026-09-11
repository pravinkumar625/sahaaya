import { useRef, useCallback } from 'react';

/**
 * Magnetic hover + 3D tilt effect hook
 * Attach `ref` to the element, use `handlers` for onMouseMove/Leave
 * Returns a `style` object to apply to the element
 *
 * @param {Object} options
 * @param {number} options.magnetStrength - How much the element moves (default: 0.25)
 * @param {number} options.tiltStrength  - How much the element tilts in degrees (default: 12)
 */
export function useMagneticHover({ magnetStrength = 0.25, tiltStrength = 12 } = {}) {
  const ref = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const tx = dx * magnetStrength;
      const ty = dy * magnetStrength;
      const rx = -(dy / rect.height) * tiltStrength;
      const ry = (dx / rect.width) * tiltStrength;

      ref.current.style.transform = `perspective(700px) translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      ref.current.style.transition = 'transform 0.1s ease-out';
    },
    [magnetStrength, tiltStrength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(700px) translate(0px, 0px) rotateX(0deg) rotateY(0deg)';
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
