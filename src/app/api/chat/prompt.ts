import { getConfig } from '@/lib/config-loader';
import { generateCompactSystemPrompt } from '@/lib/chat-prompts';

export const SYSTEM_PROMPT = {
  role: 'system' as const,
  content: generateCompactSystemPrompt(getConfig()),
};
