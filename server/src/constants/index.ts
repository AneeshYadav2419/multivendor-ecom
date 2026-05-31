// ─────────────────────────────────────────────────────────
// JWT Constants
// ─────────────────────────────────────────────────────────

/** Identifies the API as the token issuer — verified on every JWT decode. */
export const JWT_ISSUER = "multivendor-api" as const;

/** Identifies the intended audience of the token — verified on every JWT decode. */
export const JWT_AUDIENCE = "multivendor-client" as const;

/** Number of bcrypt salt rounds. 12 is the production-safe minimum. */
export const BCRYPT_SALT_ROUNDS = 12 as const;

/** Refresh token lifetime in milliseconds (7 days = 604_800_000 ms). */
export const REFRESH_TOKEN_TTL_MS = 604_800_000 as const;

/** Length (bytes) of the raw random refresh token before hex encoding. */
export const REFRESH_TOKEN_BYTES = 64 as const;

// ─────────────────────────────────────────────────────────
// Cookie Constants
// ─────────────────────────────────────────────────────────

/** Name of the httpOnly refresh token cookie. */
export const REFRESH_TOKEN_COOKIE = "refresh_token" as const;

/** Path scope for the refresh token cookie — limits exposure to auth endpoints only. */
export const REFRESH_COOKIE_PATH = "/api/auth" as const;

// ─────────────────────────────────────────────────────────
// Cache Constants
// ─────────────────────────────────────────────────────────

/** Redis TTL (seconds) for cached user sessions. */
export const USER_SESSION_CACHE_TTL = 300 as const;

/** Redis TTL (seconds) for cached vendor approval status. */
export const VENDOR_STATUS_CACHE_TTL = 300 as const;

// ─────────────────────────────────────────────────────────
// Pagination Defaults
// ─────────────────────────────────────────────────────────

export const DEFAULT_PAGE = 1 as const;
export const DEFAULT_PAGE_LIMIT = 10 as const;

// ─────────────────────────────────────────────────────────
// HTTP Status Codes (named aliases for readability)
// ─────────────────────────────────────────────────────────

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
