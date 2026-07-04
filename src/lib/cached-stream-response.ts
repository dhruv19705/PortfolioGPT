import {
  createDataStreamResponse,
  formatDataStreamPart,
  generateId,
} from 'ai';

/** Return a useChat-compatible data stream for a pre-built text answer (0 Groq tokens). */
export function createCachedStreamResponse(text: string): Response {
  const messageId = generateId();

  return createDataStreamResponse({
    execute: (writer) => {
      writer.write(formatDataStreamPart('start_step', { messageId }));
      writer.write(formatDataStreamPart('text', text));
      writer.write(
        formatDataStreamPart('finish_step', {
          finishReason: 'stop',
          isContinued: false,
        })
      );
      writer.write(
        formatDataStreamPart('finish_message', { finishReason: 'stop' })
      );
    },
  });
}
