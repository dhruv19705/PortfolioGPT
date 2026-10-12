'use client';

import { cn } from '@/lib/utils';
import React from 'react';

/** Sets --sx/--sy on the element so `.spotlight-card` can light up its border under the cursor. */
export function trackSpotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--sx', `${e.clientX - r.left}px`);
  el.style.setProperty('--sy', `${e.clientY - r.top}px`);
}

export function SpotlightCard({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div onPointerMove={trackSpotlight} className={cn('spotlight-card', className)} {...rest}>
      {children}
    </div>
  );
}
