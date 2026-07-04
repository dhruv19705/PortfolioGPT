'use client';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { PresetReply } from '@/components/chat/preset-reply';
import { presetReplies } from '@/lib/config-loader';
import {
  getClientCachedResponse,
  setClientCachedResponse,
} from '@/lib/chat-cache';
import {
  classifyChatError,
  getRetryAfterSeconds,
  type ChatErrorType,
} from '@/lib/chat-errors';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import HelperBoost from './HelperBoost';
import {
  ChatToolbar,
  FloatingExpandButton,
  getToolLabel,
} from './chat-toolbar';

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool }: AvatarProps) => {
      // Conditional rendering based on detection
      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <div
            className="relative cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <img
              src="/avatar.png"
              alt="Avatar"
              className="h-full w-full object-cover object-[center_top_-5%] scale-95 rounded-full"
            />
          </div>
        </div>
      );
    }),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut' as const,
  },
};


const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [presetReply, setPresetReply] = useState<{
    question: string;
    reply: string;
    tool: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<ChatErrorType | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(
    null
  );
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const [isImmersive, setIsImmersive] = useState(false);
  const lastCustomQueryRef = useRef<string | null>(null);
  const chatRootRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    maxSteps: 2,
    onResponse: () => {
      // Keep loading until onFinish — clearing here left a blank gap before streamed text arrives
    },
    onFinish: (message) => {
      setLoadingSubmit(false);
      setErrorMessage(null);
      setRetryAfterSeconds(null);

      const query = lastCustomQueryRef.current;
      if (query && message.content?.trim()) {
        setClientCachedResponse(query, message.content);
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);

      const errorText =
        error.message ||
        (error.cause instanceof Error
          ? error.cause.message
          : typeof error.cause === 'string'
            ? error.cause
            : 'Something went wrong. Please try again or use preset questions.');

      const errorType = classifyChatError(errorText);
      const retrySecs = getRetryAfterSeconds(errorText);

      if (errorType === 'rate_limit') {
        setRetryAfterSeconds(retrySecs ?? 45);
        setErrorMessage('rate_limit');
        toast.error(
          `Too many requests — wait ${retrySecs ?? 45}s and try again, or use preset questions.`,
          { duration: 5000 }
        );
      } else if (errorType === 'quota_exhausted') {
        setErrorMessage('quota_exhausted');
        toast.error(
          'API quota exhausted. Use preset questions or try again later.',
          { duration: 6000 }
        );
      } else if (errorType === 'network') {
        setErrorMessage('network');
        toast.error('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('unknown');
        toast.error(`Error: ${errorText}`);
      }
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  const { currentAIMessage, latestUserMessage } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
    };

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const completedToolPart = currentAIMessage?.parts?.find(
    (p) =>
      p.type === 'tool-invocation' &&
      p.toolInvocation?.state === 'result'
  );

  const activeToolName =
    presetReply?.tool ??
    (completedToolPart?.type === 'tool-invocation'
      ? completedToolPart.toolInvocation.toolName
      : undefined);

  const isContentFocus = Boolean(activeToolName);

  const hasToolUI = Boolean(
    currentAIMessage?.parts?.some(
      (p) =>
        p.type === 'tool-invocation' &&
        (p.toolInvocation?.state === 'result' || isLoading)
    )
  );

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  //@ts-ignore
  const startCustomChat = (query) => {
    if (!query.trim() || isToolInProgress) return;

    setErrorMessage(null);
    setRetryAfterSeconds(null);
    setLastFailedQuery(query);
    setPresetReply(null);
    lastCustomQueryRef.current = query;

    const cached = getClientCachedResponse(query);
    if (cached) {
      setMessages([
        { id: `user-${Date.now()}`, role: 'user', content: query },
        { id: `assistant-${Date.now()}`, role: 'assistant', content: cached },
      ]);
      setLoadingSubmit(false);
      return;
    }

    setLoadingSubmit(true);
    setMessages([]);
    append(
      { role: 'user', content: query },
      { body: { textOnly: true } }
    );
  };

  //@ts-ignore
  const submitQuery = (query) => {
    if (!query.trim() || isToolInProgress) return;

    setErrorMessage(null);
    setRetryAfterSeconds(null);

    if (presetReplies[query]) {
      const preset = presetReplies[query];
      setPresetReply({ question: query, reply: preset.reply, tool: preset.tool });
      setLoadingSubmit(false);
      return;
    }

    startCustomChat(query);
  };

  //@ts-ignore
  const submitQueryToAI = (query) => {
    startCustomChat(query);
  };

  //@ts-ignore
  const handlePresetReply = (question, reply, tool) => {
    setPresetReply({ question, reply, tool });
    setLoadingSubmit(false);
  };

  //@ts-ignore
  const handleGetAIResponse = (question, tool) => {
    setPresetReply(null);
    submitQueryToAI(question); // Use the new function that bypasses presets
  };

  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted]);

  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQueryToAI(input); // User input should go directly to AI
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
  };

  const isWaitingForResponse = isLoading || loadingSubmit;

  const hasVisibleChatContent = useMemo(() => {
    if (presetReply || errorMessage || isWaitingForResponse) return true;
    if (latestUserMessage) return true;
    if (!currentAIMessage) return false;

    const hasText = Boolean(currentAIMessage.content?.trim());
    const hasCompletedTools = Boolean(
      currentAIMessage.parts?.some(
        (p) =>
          p.type === 'tool-invocation' &&
          p.toolInvocation?.state === 'result'
      )
    );
    return hasText || hasCompletedTools || isLoading;
  }, [
    presetReply,
    errorMessage,
    isWaitingForResponse,
    latestUserMessage,
    currentAIMessage,
    isLoading,
  ]);

  const isEmptyState = !hasVisibleChatContent;

  const handleGoHome = () => {
    setPresetReply(null);
    setMessages([]);
    setErrorMessage(null);
    setIsImmersive(false);
  };

  const toggleImmersive = async () => {
    const next = !isImmersive;
    setIsImmersive(next);

    if (next && chatRootRef.current?.requestFullscreen) {
      try {
        await chatRootRef.current.requestFullscreen();
      } catch {
        // CSS immersive mode still applies when native fullscreen is blocked
      }
    } else if (!next && document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsImmersive(false);
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isImmersive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        setIsImmersive(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isImmersive]);

  const showToolbar = isContentFocus || isImmersive;
  const toolbarHeight = showToolbar ? 44 : 0;
  const headerHeight = showToolbar ? toolbarHeight : 140;

  return (
    <div
      ref={chatRootRef}
      className={`relative h-screen overflow-hidden bg-background transition-all duration-300 ${
        isImmersive ? 'fixed inset-0 z-[60]' : ''
      }`}
      style={
        {
          '--chat-chrome': isImmersive ? '5.5rem' : '7.5rem',
        } as React.CSSProperties
      }
    >
      {!showToolbar && (
        <FloatingExpandButton onToggleImmersive={toggleImmersive} />
      )}

      {showToolbar && (
        <div className="fixed top-0 right-0 left-0 z-50">
          <ChatToolbar
            isImmersive={isImmersive}
            onToggleImmersive={toggleImmersive}
            onHome={handleGoHome}
            onBack={() => setPresetReply(null)}
            showBack={Boolean(presetReply)}
            activeLabel={getToolLabel(activeToolName)}
          />
        </div>
      )}
      {/* Fixed Avatar Header with Gradient */}
      <div
        className={`fixed top-0 right-0 left-0 z-40 bg-gradient-to-b from-background via-background/95 to-transparent transition-all duration-300 ease-in-out ${
          isContentFocus || isImmersive
            ? 'pointer-events-none h-0 overflow-hidden opacity-0'
            : ''
        }`}
      >
        <div className="py-6 transition-all duration-300 ease-in-out">
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar hasActiveTool={false} />
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`container mx-auto flex h-full flex-col transition-all duration-300 ${
          isContentFocus || isImmersive ? 'max-w-6xl' : 'max-w-3xl'
        }`}
      >
        {/* Scrollable Chat Content */}
        <div
          className="flex-1 overflow-y-auto px-2 pb-4 transition-all duration-300"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex w-full flex-col items-center pt-2 pb-8"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
              >
                <ChatLanding 
                  submitQuery={submitQuery} 
                  handlePresetReply={handlePresetReply}
                />
              </motion.div>
            ) : (
              <div className="space-y-4 pb-4">
                {latestUserMessage && (
                  <motion.div
                    key="user-message"
                    {...MOTION_CONFIG}
                    className="px-4"
                  >
                    <ChatBubble variant="sent">
                      <ChatBubbleMessage>
                        <ChatMessageContent
                          message={latestUserMessage}
                          isLast={true}
                          isLoading={false}
                          reload={() => Promise.resolve(null)}
                        />
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                )}

                {presetReply && !latestUserMessage && (
                  <motion.div
                    key="preset-question"
                    {...MOTION_CONFIG}
                    className="px-4"
                  >
                    <ChatBubble variant="sent">
                      <ChatBubbleMessage>{presetReply.question}</ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {presetReply ? (
                    <motion.div key="preset-reply" {...MOTION_CONFIG}>
                      <PresetReply
                        question={presetReply.question}
                        reply={presetReply.reply}
                        tool={presetReply.tool}
                        onGetAIResponse={handleGetAIResponse}
                        onClose={() => setPresetReply(null)}
                      />
                    </motion.div>
                  ) : currentAIMessage ? (
                    <motion.div key="ai-reply" {...MOTION_CONFIG}>
                      <SimplifiedChatView
                        message={currentAIMessage}
                        isLoading={isLoading}
                        showToolUI={hasToolUI}
                        reload={reload}
                        addToolResult={addToolResult}
                      />
                    </motion.div>
                  ) : errorMessage ? (
                    <motion.div
                      key="error"
                      {...MOTION_CONFIG}
                      className="px-4"
                    >
                      <ChatBubble variant="received">
                        <ChatBubbleMessage className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                          <div className="space-y-4 p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                                <span className="text-white text-lg">⚠️</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                                  {errorMessage === 'rate_limit'
                                    ? 'Too Many Requests (Temporary)'
                                    : errorMessage === 'quota_exhausted'
                                      ? 'API Quota Exhausted'
                                      : 'Something Went Wrong'}
                                </h3>
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                  {errorMessage === 'rate_limit'
                                    ? 'Groq tokens-per-minute limit'
                                    : errorMessage === 'quota_exhausted'
                                      ? 'Daily or billing quota reached'
                                      : 'Please try again'}
                                </p>
                              </div>
                            </div>

                            <div className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                              {errorMessage === 'rate_limit' ? (
                                <p>
                                  You sent several AI questions quickly. Groq limits
                                  how many tokens can be processed per minute — this
                                  is <strong>not</strong> a permanent quota issue.
                                  {retryAfterSeconds
                                    ? ` Try again in about **${retryAfterSeconds} seconds**.`
                                    : ' Wait about a minute and retry.'}
                                </p>
                              ) : errorMessage === 'quota_exhausted' ? (
                                <p>
                                  The Groq API billing quota may be exhausted. Use
                                  preset questions below for instant answers.
                                </p>
                              ) : (
                                <p>
                                  The request failed. Check your connection or use
                                  preset questions below.
                                </p>
                              )}

                              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg mt-3">
                                <p className="font-medium mb-2">What you can do:</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                  {errorMessage === 'rate_limit' && (
                                    <li>Wait ~1 minute, then tap Retry</li>
                                  )}
                                  <li>Use preset questions for instant responses (no API)</li>
                                  <li>Ask shorter follow-ups after a brief pause</li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                              {errorMessage === 'rate_limit' && lastFailedQuery && (
                                <button
                                  onClick={() => {
                                    setErrorMessage(null);
                                    submitQueryToAI(lastFailedQuery);
                                  }}
                                  className="px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors font-medium"
                                >
                                  Retry
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setErrorMessage(null);
                                  const preset = presetReplies['How can I reach you?'];
                                  if (preset) {
                                    setPresetReply({
                                      question: 'How can I reach you?',
                                      reply: preset.reply,
                                      tool: preset.tool,
                                    });
                                  }
                                }}
                                className="px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors font-medium"
                              >
                                Contact me
                              </button>
                              <button
                                onClick={() => {
                                  setErrorMessage(null);
                                  setMessages([]);
                                  setPresetReply(null);
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                Use Presets
                              </button>
                            </div>

                            <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-3">
                              Thank you for your patience! 🙏
                            </p>
                          </div>
                        </ChatBubbleMessage>
                      </ChatBubble>
                    </motion.div>
                  ) : isWaitingForResponse ? (
                    <motion.div
                      key="loading"
                      {...MOTION_CONFIG}
                      className="px-4"
                    >
                      <ChatBubble variant="received">
                        <ChatBubbleMessage isLoading />
                      </ChatBubble>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div
          className={`sticky bottom-0 bg-background px-2 md:px-0 ${
            isContentFocus || isImmersive ? 'pt-1 pb-2' : 'pt-3 md:pb-4'
          }`}
        >
          <div className="relative flex flex-col items-center gap-2">
            <HelperBoost
              submitQuery={submitQuery}
              setInput={setInput}
              handlePresetReply={handlePresetReply}
              forceCollapsed={isContentFocus || isImmersive}
            />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
