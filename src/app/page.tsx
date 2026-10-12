'use client';

import { MotionConfig } from 'framer-motion';
import { Suspense } from 'react';
import Chat from '@/components/chat/chat';

export default function Home() {
  return (
    // Respect the OS "reduce motion" setting for every framer-motion animation
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<div className="bg-background h-dvh" />}>
        <Chat />
      </Suspense>
    </MotionConfig>
  );
}
