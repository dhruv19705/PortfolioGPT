'use client';

import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatRequestOptions } from 'ai';
import { Message } from 'ai/react';
import { motion } from 'framer-motion';
import ChatMessageContent from './chat-message-content';
import ToolRenderer from './tool-renderer';

interface SimplifiedChatViewProps {
  message: Message;
  isLoading: boolean;
  showToolUI?: boolean;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut' as const,
  },
};

export function SimplifiedChatView({
  message,
  isLoading,
  showToolUI = false,
  reload,
  addToolResult,
}: SimplifiedChatViewProps) {
  if (message.role !== 'assistant') return null;

  // Show completed tool UIs; while streaming, also show once the tool name is known
  const toolInvocations =
    message.parts
      ?.filter((part) => part.type === 'tool-invocation' && part.toolInvocation)
      .map((part) =>
        part.type === 'tool-invocation' ? part.toolInvocation : null
      )
      .filter((tool): tool is NonNullable<typeof tool> => {
        if (!tool) return false;
        return tool.state === 'result' || Boolean(tool.toolName);
      }) || [];

  const currentTools = toolInvocations.filter(
    (tool) => tool.state === 'result' || isLoading
  );

  const hasTextContent = message.content.trim().length > 0;
  const hasTools = currentTools.length > 0;
  const showTextContent = hasTextContent;

  if (!showTextContent && isLoading) {
    return (
      <motion.div {...MOTION_CONFIG} className="px-4">
        <ChatBubble variant="received">
          <ChatBubbleMessage isLoading />
        </ChatBubble>
      </motion.div>
    );
  }

  if (!showTextContent && !(showToolUI && hasTools)) {
    return (
      <motion.div {...MOTION_CONFIG} className="px-4">
        <ChatBubble variant="received">
          <ChatBubbleMessage>
            I couldn&apos;t generate a response. Try a preset question below or
            ask again in a moment.
          </ChatBubbleMessage>
        </ChatBubble>
      </motion.div>
    );
  }

  return (
    <motion.div {...MOTION_CONFIG} className="flex w-full flex-col px-4">
      {/* Single container for both tool and text content */}
      <div className="flex w-full flex-col">
        {/* Tool invocation result - displayed at the top */}
        {showToolUI && hasTools && (
          <div className="mb-4 w-full space-y-4">
            <ToolRenderer
              toolInvocations={currentTools}
              messageId={message.id || 'current-msg'}
            />
          </div>
        )}

        {/* Text content - only show if meaningful and not redundant with tools */}
        {showTextContent && (
          <div className="w-full">
            <ChatBubble variant="received" className="w-full">
              <ChatBubbleMessage className="w-full">
                <ChatMessageContent
                  message={message}
                  isLast={true}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                  skipToolRendering={true}
                />
              </ChatBubbleMessage>
            </ChatBubble>
          </div>
        )}

        {/* Add some padding at the bottom for better scrolling experience */}
        <div className="pb-4"></div>
      </div>
    </motion.div>
  );
}
