'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Home, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOOL_LABELS: Record<string, string> = {
  getPresentation: 'About Me',
  getProjects: 'Projects',
  getSkills: 'Skills',
  getResume: 'Resume',
  getContact: 'Contact',
  getInternship: 'Availability',
  getAchievements: 'Achievements',
};

interface ChatToolbarProps {
  isImmersive: boolean;
  onToggleImmersive: () => void;
  onBack?: () => void;
  onHome?: () => void;
  activeLabel?: string;
  showBack?: boolean;
  className?: string;
}

export function getToolLabel(tool?: string) {
  if (!tool) return undefined;
  return TOOL_LABELS[tool] ?? tool.replace(/^get/, '');
}

export function FloatingExpandButton({
  onToggleImmersive,
}: {
  onToggleImmersive: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed top-3 right-3 z-50">
      <button
        type="button"
        onClick={onToggleImmersive}
        suppressHydrationWarning
        className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted"
        aria-label="Enter fullscreen"
        title="Expand to fullscreen"
      >
        <Maximize2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Fullscreen</span>
      </button>
    </div>
  );
}

export function ChatToolbar({
  isImmersive,
  onToggleImmersive,
  onBack,
  onHome,
  activeLabel,
  showBack = false,
  className,
}: ChatToolbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between border-b border-border/60 bg-background/95 px-3 py-2 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-1">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            suppressHydrationWarning
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}
        {onHome && (
          <button
            type="button"
            onClick={onHome}
            suppressHydrationWarning
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </button>
        )}
        {activeLabel && (
          <span className="truncate pl-1 text-sm font-medium text-foreground">
            {activeLabel}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onToggleImmersive}
        suppressHydrationWarning
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        aria-label={isImmersive ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isImmersive ? (
          <>
            <Minimize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </>
        ) : (
          <>
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </>
        )}
      </button>
    </div>
  );
}
