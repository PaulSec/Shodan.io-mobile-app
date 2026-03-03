import type { AxiosError } from 'axios';
export class ShodanApiError extends Error {
  public readonly status: number; public readonly isRateLimit: boolean; public readonly isUnauthorized: boolean;
  constructor(status: number, message: string) {
    super(message); this.name = 'ShodanApiError'; this.status = status;
    this.isRateLimit = status === 429; this.isUnauthorized = status === 401 || status === 403;
    Object.setPrototypeOf(this, ShodanApiError.prototype);
  }
}
export function parseApiError(error: unknown): ShodanApiError {
  if (error instanceof ShodanApiError) return error;
  const e = error as AxiosError<{ error?: string }>;
  if (e.response) {
    const s = e.response.status;
    const apiMessage = e.response.data?.error?.trim();
    if (apiMessage) return new ShodanApiError(s, apiMessage);
    if (s === 503) return new ShodanApiError(s, 'Shodan API is temporarily unavailable (503). Please try again in a few minutes.');
    if (s === 502 || s === 504) return new ShodanApiError(s, 'Shodan API gateway is temporarily unavailable. Please try again shortly.');
    if (s >= 500) return new ShodanApiError(s, `Shodan API server error (${s}). Please retry shortly.`);
    return new ShodanApiError(s, e.message ?? `Request failed with status ${s}`);
  }
  if (e.code === 'ECONNABORTED' || e.code === 'ETIMEDOUT') return new ShodanApiError(408, 'Request timed out.');
  return new ShodanApiError(0, e.message ?? 'Network error.');
}
export function isRateLimitError(e: unknown): boolean { return e instanceof ShodanApiError ? e.isRateLimit : (e as AxiosError)?.response?.status === 429; }
export function isAuthError(e: unknown): boolean { return e instanceof ShodanApiError ? e.isUnauthorized : [401,403].includes((e as AxiosError)?.response?.status ?? 0); }
export async function withRetry<T>(fn: () => Promise<T>, opts: { maxAttempts?: number; baseDelayMs?: number } = {}): Promise<T> {
  const { maxAttempts = 3, baseDelayMs = 1000 } = opts; let last: ShodanApiError | undefined;
  for (let i = 1; i <= maxAttempts; i++) {
    try { return await fn(); } catch (err) {
      last = parseApiError(err);
      if (last.isUnauthorized || i >= maxAttempts) throw last;
      const retryable = last.isRateLimit || last.status === 0 || last.status === 408 || [500, 502, 503, 504].includes(last.status);
      if (!retryable) throw last;
      await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, i - 1) + Math.random() * 500));
    }
  }
  throw last!;
}
