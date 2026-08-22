import { ApiError, type Ctx } from '../server/middleware/auth';
import { matchRoute, type Method } from '../server/routes';
import { verifyToken } from '../server/security';
import { tokenStore } from './tokenStore';

/**
 * Axios-shaped client. `http.get/post/patch/delete` behave like an axios
 * instance with a baseURL of `/api`, a request interceptor that attaches the
 * bearer token, and a response interceptor that surfaces 401s to the auth layer.
 * Point `axios.create({ baseURL })` at the Express server and the callers in
 * services/api.ts stay identical.
 */

export interface RequestOptions {
  params?: Record<string, unknown>;
  data?: unknown;
}

type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

export function onUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

function latency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 240 + Math.random() * 320));
}

function clone<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value)) as T;
}

async function request<T>(
method: Method,
path: string,
options: RequestOptions = {})
: Promise<T> {
  await latency();

  // --- request interceptor -------------------------------------------------
  const token = tokenStore.get();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const match = matchRoute(method, path);
  if (!match) throw new ApiError(404, `Cannot ${method} ${path}`);

  const ctx: Ctx = {
    auth: verifyToken(headers.Authorization?.replace('Bearer ', '') ?? null),
    body: options.data ?? {},
    query: options.params ?? {},
    params: match.params
  };

  try {
    const result = match.route.handler(ctx);
    return clone(result) as T;
  } catch (error) {
    const apiError =
    error instanceof ApiError ?
    error :
    new ApiError(500, 'Something went wrong. Please try again.');
    // --- response interceptor ---------------------------------------------
    if (apiError.status === 401) {
      tokenStore.clear();
      unauthorizedListeners.forEach((listener) => listener());
    }
    throw apiError;
  }
}

export const http = {
  get: <T,>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T,>(path: string, data?: unknown, options?: RequestOptions) =>
  request<T>('POST', path, { ...options, data }),
  patch: <T,>(path: string, data?: unknown, options?: RequestOptions) =>
  request<T>('PATCH', path, { ...options, data }),
  delete: <T,>(path: string, options?: RequestOptions) =>
  request<T>('DELETE', path, options)
};

export { ApiError };

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}