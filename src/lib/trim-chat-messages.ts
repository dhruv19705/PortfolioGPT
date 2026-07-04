const MAX_MESSAGES = 6;
const MAX_CONTENT_LENGTH = 800;

type ChatMessage = {
  role: string;
  content?: string | unknown;
  parts?: unknown;
  toolInvocations?: unknown;
  [key: string]: unknown;
};

export function extractMessageText(message: ChatMessage): string {
  if (typeof message.content === 'string' && message.content.trim()) {
    return message.content;
  }

  if (Array.isArray(message.parts)) {
    return message.parts
      .filter(
        (part): part is { type: string; text?: string } =>
          typeof part === 'object' &&
          part !== null &&
          'type' in part &&
          part.type === 'text' &&
          typeof (part as { text?: string }).text === 'string'
      )
      .map((part) => part.text ?? '')
      .join('');
  }

  return '';
}

/** Strip tool metadata and truncate long text to reduce Groq TPM usage. */
export function trimMessagesForApi(messages: ChatMessage[]): ChatMessage[] {
  return messages.slice(-MAX_MESSAGES).map((message) => {
    const content = extractMessageText(message);

    const trimmedContent =
      content.length > MAX_CONTENT_LENGTH
        ? `${content.slice(0, MAX_CONTENT_LENGTH)}… [truncated]`
        : content;

    return {
      role: message.role as 'user' | 'assistant' | 'system',
      content: trimmedContent,
    };
  });
}
