# Auth Implementation — File-by-File Learning Order

Study and trace code in this order. Each step maps to the authentication tutorial theory.

**Rule:** Open the file → read comments → test the endpoint in browser/Postman → move to next step.

---

## Part A — Database & config (backend)

### Step 1 — Prisma schema (identity + sessions)

**File:** `server/prisma/schema.prisma`

| Model | Theory section | What to notice |
|-------|----------------|----------------|
| `User` | Register / login | `password` stores bcrypt hash only |
| `Session` | Refresh token | `refreshToken` = SHA-256 hash, not raw token |
| `UsedRefreshToken` | Replay detection | Old rotated hashes land here |
| `Role` enum | RBAC | CUSTOMER, VENDOR, ADMIN |

**Exercise:** Run `npx prisma studio` and inspect tables after register + login.

---

### Step 2 — Environment validation

**File:** `server/src/config/env.ts`

- Zod parses `JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`, `CORS_ORIGIN`
- Server exits early if env is invalid (fail-fast)

**Exercise:** Remove `JWT_SECRET` from `.env` and watch server refuse to start.

---

### Step 3 — Prisma client

**File:** `server/src/config/prismaClient.ts`

- Single Prisma instance for the app

---

### Step 4 — Redis cache (optional but used in auth)

**File:** `server/src/config/redis.ts`

- Used by `protect` middleware to cache `user:session:{id}`
- Falls back to in-memory if no `REDIS_URL`

---

## Part B — Shared middleware (backend)

### Step 5 — Request tracing

**File:** `server/src/middlewares/traceMiddleware.ts`  
**File:** `server/src/utils/context.ts`

- Assigns `x-request-id` for logs across async calls

---

### Step 6 — Validation middleware

**File:** `server/src/middlewares/validateMiddleware.ts`

```text
req.body → Zod parse → req.body = validated.body → next()
```

Used on register/login before controller runs.

---

### Step 7 — Error handling

**File:** `server/src/middlewares/errorMiddleware.ts`

| Error type | HTTP | When |
|------------|------|------|
| `AppError` | your choice | Wrong password, session theft |
| `ZodError` | 422 | Invalid email format |
| Prisma P2002 | 409 | Duplicate email |

---

### Step 8 — JWT protection (RBAC)

**File:** `server/src/middlewares/authMiddleware.ts`

| Export | Purpose |
|--------|---------|
| `protect` | Verify Bearer JWT, load user, check `isActive` |
| `restrictTo("ADMIN")` | Authorization after authentication |
| `checkVendorApproval` | Vendor must be APPROVED |

**Exercise:** Call `GET /api/auth/me` without token → 401. With token → 200.

---

### Step 9 — Async wrapper

**File:** `server/src/utils/catchAsync.ts`

- Wraps async controllers so errors reach `errorHandler`

---

## Part C — Auth module (backend) — the reference implementation

### Step 10 — Validation schemas

**File:** `server/src/modules/auth/auth.validation.ts`

- `registerBodySchema`, `loginBodySchema`
- Wrapped as `{ body: schema }` for validate middleware
- Zod v4: use `{ message: "..." }` not `errorMap`

---

### Step 11 — DTOs

**File:** `server/src/modules/auth/auth.dto.ts`

- Types inferred from Zod: `RegisterDTO`, `LoginDTO`
- `TokenPair` for login response internals

---

### Step 12 — Business logic (most important)

**File:** `server/src/modules/auth/auth.service.ts`

Read in this order inside the file:

| Function | Theory |
|----------|--------|
| `normalizeEmail` | Prevent duplicate accounts |
| `generateAccessToken` | Short-lived JWT |
| `generateRawRefreshToken` | Opaque 64-byte hex |
| `hashToken` | SHA-256 before DB storage |
| `registerUser` | bcrypt hash + create user |
| `loginUser` | Timing-safe compare + create Session |
| `refreshAccessToken` | Rotation + replay detection |
| `logoutUser` | Delete one session |
| `logoutAllSessions` | Delete all devices |
| `getUserById` | Profile for `/me` |

**Exercise:** Login twice from two browsers → two rows in `Session` table.

---

### Step 13 — HTTP layer (thin)

**File:** `server/src/modules/auth/auth.controller.ts`

| Handler | Sets cookie? | Returns |
|---------|--------------|---------|
| `register` | No | `{ user }` |
| `login` | Yes `refresh_token` | `{ accessToken, user }` |
| `refresh` | Rotates cookie | `{ accessToken }` |
| `logout` | Clears cookie | message |
| `logoutAll` | Clears cookie | needs `protect` |
| `getMe` | No | `{ user }` |

---

### Step 14 — Routes

**File:** `server/src/modules/auth/auth.routes.ts`

- Rate limiter on register/login/refresh
- `validate(loginSchema)` before controller

---

### Step 15 — App wiring

**Files:**  
`server/src/routes/index.ts` → `server/src/app.ts` → `server/src/server.ts`

Trace: middleware order → `registerRoutes(app)` → listen on PORT.

---

## Part D — Frontend auth

### Step 16 — Types

**File:** `client/src/features/auth/types/index.ts`

- `AuthResponse`, `RegisterResponse` match API shape

---

### Step 17 — Form validation (client Zod)

**File:** `client/src/features/auth/validations/auth-schemas.ts`

- Mirrors server rules for UX (not security — server re-validates)

---

### Step 18 — API functions

**File:** `client/src/lib/api/auth.ts`

- Thin wrappers: `loginUser`, `registerUser`, `logoutUser`, `refreshAccessToken`

---

### Step 19 — Axios client + refresh queue

**File:** `client/src/lib/api/axios.ts`

| Piece | Theory |
|-------|--------|
| `withCredentials: true` | Send HttpOnly cookie |
| Request interceptor | Attach `Bearer` access token |
| Response interceptor | 401 → refresh → retry queue |
| `AUTH_NO_REFRESH_PATHS` | Login 401 ≠ expired token |

**Exercise:** Log in, wait 15m (or shorten JWT in env), trigger any API call → watch refresh in Network tab.

---

### Step 20 — Zustand store

**File:** `client/src/store/useAuthStore.ts`

- `partialize: { user }` only — **no access token in localStorage**

---

### Step 21 — React Query mutations

**File:** `client/src/features/auth/hooks/use-auth-mutations.ts`

- `useLoginMutation` → set token + user + toast
- `useRegisterMutation` → redirect to login
- `useLogoutMutation` → clear store

---

### Step 22 — UI forms

**Files:**  
`client/src/features/auth/components/login-form.tsx`  
`client/src/features/auth/components/register-form.tsx`

- react-hook-form + zodResolver
- Role-based redirect after login

---

### Step 23 — Pages (thin routes)

**Files:**  
`client/src/app/(auth)/login/page.tsx`  
`client/src/app/(auth)/register/page.tsx`

- Only layout + import form component

---

### Step 24 — Providers

**Files:**  
`client/src/providers/query-provider.tsx`  
`client/src/providers/auth-hydration-provider.tsx`  
`client/src/app/layout.tsx`

| Provider | Why |
|----------|-----|
| QueryProvider | React Query for mutations |
| AuthHydrationProvider | Wait for Zustand persist before render |
| Root layout | **Only place** with `<html>` and `<body>` |

---

## Part E — End-to-end test script

Do this manually once:

```text
1. POST /api/auth/register     → 201
2. POST /api/auth/login        → 200 + Set-Cookie + accessToken in body
3. GET  /api/auth/me           → 200 with Authorization header
4. POST /api/auth/refresh      → 200 new accessToken
5. POST /api/auth/logout       → 200 cookie cleared
6. GET  /api/auth/me           → 401
```

---

## What to build next (not in repo yet)

| File | Purpose |
|------|---------|
| `client/middleware.ts` | Edge protect `/admin`, `/vendor` |
| `client/src/providers/auth-bootstrap-provider.tsx` | Silent refresh if `user` exists but no token |
| `server/src/modules/auth/auth.middleware.ts` | Move `protect` here (optional colocation) |

Use **products module migration** as your second learning project: [MIGRATION-PLAYBOOK.md](./MIGRATION-PLAYBOOK.md).
