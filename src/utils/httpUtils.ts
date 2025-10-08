export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export type FetchJSONOptions = RequestInit & {
  timeout?: number; // ms
};

/** Narrowing helpers */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractMessage(data: unknown): string | undefined {
  if (!isRecord(data)) return undefined;

  const msg = data.message;
  if (typeof msg === 'string') return msg;

  // some APIs return { message: [...] }
  if (Array.isArray(msg) && msg.every((m) => typeof m === 'string')) {
    return msg.join(', ');
  }

  // common alternative keys
  const alt = data.error ?? data.detail ?? data.title;
  if (typeof alt === 'string') return alt;

  return undefined;
}

/**
 * fetchJSON wraps fetch with:
 * - timeout via AbortController
 * - default headers (Content-Type: application/json)
 * - unified error handling returning JSON when possible
 */
export async function fetchJSON<T = unknown>(
  url: string,
  { timeout, headers, ...init }: FetchJSONOptions = {}
): Promise<T | undefined> {
  const controller = new AbortController();
  const timeoutId =
    typeof timeout === 'number'
      ? setTimeout(() => controller.abort(), timeout)
      : undefined;

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: init.credentials ?? 'include',
    });

    if (!res.ok) {
      let data: unknown;
      try {
        // try to parse error body, may throw if not JSON
        data = await res.json();
      } catch {
        data = undefined;
      }

      const message =
        extractMessage(data) ?? `HTTP ${res.status}: ${res.statusText}`;

      throw new HttpError(message, res.status, data);
    }

    // 204 No Content
    if (res.status === 204) return undefined;

    // Successful JSON parse
    return (await res.json()) as T;
  } catch (err: unknown) {
    // Normalize AbortError across environments
    const isAbort =
      (err instanceof DOMException && err.name === 'AbortError') ||
      (err instanceof Error && err.name === 'AbortError');

    if (isAbort) {
      throw new TimeoutError();
    }

    if (err instanceof Error) {
      // Re-throw real Errors as-is (preserves stack & type)
      throw err;
    }

    // Last resort: wrap non-Error throwables
    throw new Error('An unknown error occurred');
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
