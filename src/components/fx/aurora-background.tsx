'use client';

import { useEffect, useRef } from 'react';

/**
 * Fixed decorative backdrop: drifting aurora blobs, a dot grid, and a soft
 * spotlight that follows the pointer. Pure CSS animation + one rAF-throttled
 * CSS variable update, so it stays cheap. Disabled under reduced motion.
 */
export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="aurora pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-grid absolute inset-0" />
      <div className="aurora-spotlight absolute inset-0" />
    </div>
  );
}
