'use client';

import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { getConfig } from '@/lib/config-loader';
import { markdownComponents } from '@/components/chat/chat-message-content';

// Import the same components that AI responses use
import { Presentation } from '@/components/presentation';
import AllProjects from '@/components/projects/AllProjects';
import Skills from '@/components/skills';
import { Contact } from '@/components/contact';
import Resume from '@/components/resume';
import AvailabilityCard from '@/components/AvailabilityCard';
import { Achievements } from '@/components/achievements';
import { Experience } from '@/components/experience';

interface PresetReplyProps {
  question: string;
  reply: string;
  tool: string;
  onGetAIResponse: (question: string, tool: string) => void;
  onClose?: () => void;
}

function renderPresetComponent(tool: string) {
  switch (tool) {
    case 'getPresentation':
      return <Presentation />;
    case 'getProjects':
      return (
        <div className="w-full min-w-0 overflow-visible">
          <AllProjects />
        </div>
      );
    case 'getSkills':
      return <Skills />;
    case 'getExperience':
      return <Experience />;
    case 'getContact':
      return <Contact />;
    case 'getResume':
      return <Resume embedded />;
    case 'getInternship':
      return <AvailabilityCard />;
    case 'getAchievements':
      return <Achievements />;
    default:
      return null;
  }
}

export function PresetReply({ question, reply, tool, onGetAIResponse }: PresetReplyProps) {
  const [showAIOption, setShowAIOption] = useState(true);

  const handleGetAIResponse = () => {
    setShowAIOption(false);
    onGetAIResponse(question, tool);
  };

  const presetComponent = renderPresetComponent(tool);
  // The About view already shows the full bio, so don't repeat it as text
  const showText = Boolean(reply.trim()) && reply !== getConfig().personal.bio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto mb-4 w-full space-y-4 px-4"
    >
      {showText && (
        <ChatBubble variant="received">
          <ChatBubbleMessage className="w-full">
            <div className="leading-relaxed [&_strong]:font-semibold">
              <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {reply}
              </Markdown>
            </div>
          </ChatBubbleMessage>
        </ChatBubble>
      )}

      {presetComponent && <div className="w-full">{presetComponent}</div>}

      {showAIOption && (
        <div className="bg-card flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Zap className="text-brand h-3.5 w-3.5 shrink-0" />
            Instant answer from my profile. Want a more conversational reply?
          </p>
          <button
            type="button"
            onClick={handleGetAIResponse}
            className="flex items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90 sm:self-auto"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            Ask the AI
          </button>
        </div>
      )}
    </motion.div>
  );
}
