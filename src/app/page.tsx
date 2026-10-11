'use client';

import { Suspense } from 'react';
import Chat from '@/components/chat/chat';

export default function Home() {
  return (
    <Suspense fallback={<div className="bg-background h-dvh" />}>
      <Chat />
    </Suspense>
  );
}
