// src/components/chat/chat-bottombar.tsx
'use client';

import { ChatRequestOptions } from 'ai';
import { motion } from 'framer-motion';
import { ArrowUp, Square } from 'lucide-react';
import React, { useEffect } from 'react';

interface ChatBottombarProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  stop: () => void;
  input: string;
  isToolInProgress: boolean;
}

export default function ChatBottombar({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  isToolInProgress,
}: ChatBottombarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      !e.nativeEvent.isComposing &&
      !isToolInProgress &&
      input.trim()
    ) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  useEffect(() => {
    // Skip on touch devices so the keyboard doesn't cover the landing page
    if (inputRef.current && window.matchMedia('(pointer: fine)').matches) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full pb-2 md:pb-8"
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-full md:px-4"
        autoComplete="off"
        data-lpignore="true"
      >
        <div className="glow-ring mx-auto flex items-center rounded-full border border-border bg-muted/80 py-1.5 pr-1.5 pl-5 shadow-lg shadow-black/20 backdrop-blur-xl transition-colors focus-within:border-transparent">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={
              isLoading
                ? 'Thinking…'
                : 'Ask about my projects, experience, skills…'
            }
            aria-label="Ask a question"
            enterKeyHint="send"
            className="w-full border-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            disabled={isToolInProgress || isLoading}
            autoComplete="off"
            suppressHydrationWarning
          />

          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop generating"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              suppressHydrationWarning
              disabled={!input.trim() || isToolInProgress}
              aria-label="Send"
              className="bg-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-[0_0_20px_-4px_var(--brand)] transition-all duration-300 enabled:hover:scale-105 disabled:opacity-40 disabled:shadow-none"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
