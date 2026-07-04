import { z } from 'zod';

/** Groq/Llama often sends null for parameterless tool calls; normalize to {} */
export const emptyToolParameters = z.preprocess(
  (val) => (val == null ? {} : val),
  z.object({})
);
