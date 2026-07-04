import { normalizeQuery } from '@/lib/chat-cache';

const GPA_QUERY_PATTERN = /\b(cgpa|gpa)\b/i;

/** True when the user is asking only about CGPA/GPA, not full skills or education. */
export function isGpaOnlyQuestion(query: string): boolean {
  const normalized = normalizeQuery(query);
  if (!GPA_QUERY_PATTERN.test(normalized)) return false;

  if (
    /\b(skill|education|background|degree|university|college|qualification|certif|experience|hire)\b/i.test(
      normalized
    )
  ) {
    return false;
  }

  return true;
}

/** Map free-form questions to exact preset keys when possible. */
export function resolvePresetQuery(
  query: string,
  presetKeys: Record<string, unknown>
): string | null {
  const trimmed = query.trim();
  if (presetKeys[trimmed]) return trimmed;

  if (isGpaOnlyQuestion(trimmed) && presetKeys['What is your CGPA?']) {
    return 'What is your CGPA?';
  }

  return null;
}
