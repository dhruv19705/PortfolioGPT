'use client';

import { animate, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/** Counts the leading number in `value` up from zero, keeping any suffix (e.g. "4th", "9.53"). */
export function CountUp({ value, duration = 1.2 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);

  useEffect(() => {
    if (!match || reduce || !ref.current) return;
    const target = Number.parseFloat(match[1]);
    const decimals = match[1].split('.')[1]?.length ?? 0;
    const el = ref.current;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${v.toFixed(decimals)}${match[2]}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce]);

  return <span ref={ref}>{value}</span>;
}
