export type ChatErrorType = 'rate_limit' | 'quota_exhausted' | 'network' | 'unknown';

export function classifyChatError(message: string): ChatErrorType {
  const lower = message.toLowerCase();

  if (lower.includes('network')) {
    return 'network';
  }

  if (
    /failed to call a function|failed_generation|failed generation|tool_use_failed/.test(
      lower
    )
  ) {
    return 'unknown';
  }

  // Temporary TPM burst — not a daily quota exhaustion
  if (
    /rate.?limit|tokens per minute|rate_limit_exceeded|too many requests|429/.test(
      lower
    ) &&
    !lower.includes('quota exceeded')
  ) {
    return 'rate_limit';
  }

  if (/quota.?exceeded|insufficient.?quota|billing/.test(lower)) {
    return 'quota_exhausted';
  }

  return 'unknown';
}

export function getRetryAfterSeconds(message: string): number | null {
  const match = message.match(/try again in ([\d.]+)s/i);
  if (match) {
    return Math.ceil(parseFloat(match[1]));
  }
  return null;
}
