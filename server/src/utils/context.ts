import { AsyncLocalStorage } from "async_hooks";

export interface RequestContext {
  requestId: string;
}

// Global thread-safe async local storage for request execution context
export const requestContextStore = new AsyncLocalStorage<RequestContext>();

/**
 * Helper to fetch the current request's trace correlation ID.
 * Returns undefined if called outside an active HTTP request thread.
 */
export const getRequestId = (): string | undefined => {
  return requestContextStore.getStore()?.requestId;
};
