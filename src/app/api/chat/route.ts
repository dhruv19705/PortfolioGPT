import { createGroq } from '@ai-sdk/groq';
import { type CoreMessage, streamText } from 'ai';

import { SYSTEM_PROMPT } from './prompt';
import { createCachedStreamResponse } from '@/lib/cached-stream-response';
import {
  getOffTopicRefusal,
  isOffTopicQuestion,
} from '@/lib/chat-prompts';
import {
  getServerCachedResponse,
  setServerCachedResponse,
} from '@/lib/chat-cache';
import { getConfig } from '@/lib/config-loader';
import { trimMessagesForApi } from '@/lib/trim-chat-messages';
import { getAchievements } from './tools/getAchievements';
import { getContact } from './tools/getContact';
import { getInternship } from './tools/getIntership';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

function formatStreamError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null) {
    const record = error as Record<string, unknown>;

    if (typeof record.message === 'string') {
      return record.message;
    }

    if (
      typeof record.error === 'object' &&
      record.error !== null &&
      typeof (record.error as Record<string, unknown>).message === 'string'
    ) {
      return (record.error as Record<string, string>).message;
    }
  }

  return 'An error occurred while generating the response.';
}

function getLastUserQuery(
  messages: ReturnType<typeof trimMessagesForApi>
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  return lastUser && typeof lastUser.content === 'string'
    ? lastUser.content
    : '';
}

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, textOnly = false } = await req.json();
    const trimmedMessages = trimMessagesForApi(messages);
    const userQuery = getLastUserQuery(trimmedMessages);

    console.log(
      `[CHAT-API] Messages: ${messages.length} received → ${trimmedMessages.length} sent to model (textOnly: ${textOnly})`
    );

    if (!process.env.GROQ_API_KEY) {
      console.error('[CHAT-API] Missing GROQ_API_KEY environment variable');
      return new Response('Missing API key', { status: 500 });
    }

    if (textOnly && userQuery && isOffTopicQuestion(userQuery)) {
      console.log('[CHAT-API] Off-topic question — skipping Groq');
      return createCachedStreamResponse(getOffTopicRefusal(getConfig()));
    }

    if (textOnly && userQuery) {
      const cached = getServerCachedResponse(userQuery);
      if (cached) {
        console.log('[CHAT-API] Server cache hit');
        return createCachedStreamResponse(cached);
      }
    }

    trimmedMessages.unshift(SYSTEM_PROMPT);

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getInternship,
      getAchievements,
    };

    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      messages: trimmedMessages as CoreMessage[],
      tools,
      maxSteps: 2,
      onError: (error) => {
        console.error('[CHAT-API] Stream error:', error);
      },
      onFinish: async ({ text }) => {
        if (textOnly && userQuery && text.trim()) {
          setServerCachedResponse(userQuery, text);
          console.log('[CHAT-API] Cached response for:', userQuery.slice(0, 50));
        }
      },
    });

    const response = result.toDataStreamResponse({
      getErrorMessage: (error) => {
        const message = formatStreamError(error);
        console.error('[CHAT-API] Stream error message:', message, error);
        return message;
      },
    });

    return response;
  } catch (error) {
    console.error('Chat API error:', error);

    if (
      error instanceof Error &&
      /rate.?limit|429|too many requests/i.test(error.message)
    ) {
      return new Response(
        `Rate limit reached. ${error.message}`,
        { status: 429 }
      );
    }

    if (error instanceof Error && error.message?.includes('quota')) {
      return new Response('API quota exceeded. Please try again later.', {
        status: 429,
      });
    }

    if (error instanceof Error && error.message?.includes('network')) {
      return new Response(
        'Network error. Please check your connection and try again.',
        { status: 503 }
      );
    }

    return new Response(
      `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
