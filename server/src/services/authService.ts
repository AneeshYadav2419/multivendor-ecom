import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../config/prismaClient.js";
import { AppError } from "../middlewares/errorMiddleware.js";
import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────
// Config — fail fast at startup, NEVER fall back to weak secrets in prod
// ─────────────────────────────────────────────────────────
const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET ?? "dev_access_secret_change_me";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "dev_refresh_secret_change_me";

if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    console.error(
      "FATAL: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in production."
    );
    process.exit(1);
  }
}

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BCRYPT_SALT_ROUNDS = 12;

// ─────────────────────────────────────────────────────────
// Input / Output Types
// ─────────────────────────────────────────────────────────
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
  storeName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string; // raw (only sent once — stored as hash in DB)
}

// ─────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────

/** Lowercase + trim to prevent duplicate accounts from case differences */
const normalizeEmail = (email: string): string => email.toLowerCase().trim();

/** Short-lived access token — verified on every protected request */
const generateAccessToken = (userId: string, role: Role): string =>
  jwt.sign({ userId, role }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    issuer: "multivendor-api",
    audience: "multivendor-client",
  });

/** Cryptographically random refresh token — stored as SHA-256 hash in DB */
const generateRawRefreshToken = (): string =>
  crypto.randomBytes(64).toString("hex");

const hashToken = (raw: string): string =>
  crypto.createHash("sha256").update(raw).digest("hex");

// ─────────────────────────────────────────────────────────
// Service Functions
// ─────────────────────────────────────────────────────────

/**
 * Register a new user.
 * If role is VENDOR, a pending (unapproved) vendor profile is created atomically.
 */
export const registerUser = async (input: RegisterInput) => {
  const email = normalizeEmail(input.email);
  const { name, role, storeName } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(
      "An account with this email already exists.",
      409,
      "DUPLICATE_EMAIL"
    );
  }

  const hashedPassword = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email,
      password: hashedPassword,
      role: role ?? "CUSTOMER",
      vendor:
        role === "VENDOR"
          ? {
              create: {
                storeName: storeName?.trim() || `${name.trim()}'s Store`,
                description: "Welcome to my store!",
                status: "PENDING", // Admin must approve before vendor can operate
              },
            }
          : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      vendor: {
        select: {
          id: true,
          storeName: true,
          status: true,
        },
      },
    },
  });

  return user;
};

/**
 * Authenticate a user and issue an access + refresh token pair.
 * Defends against user-enumeration via constant-time password comparison.
 */
export const loginUser = async (
  input: LoginInput
): Promise<{ tokens: TokenPair; user: object }> => {
  const email = normalizeEmail(input.email);

  const user = await prisma.user.findUnique({ where: { email } });

  // Always run bcrypt to prevent timing-based user enumeration attacks
  const dummyHash =
    "$2b$12$invalidhashinvalidhashinvalidhashinvalidhashinvalidhashxx";
  const passwordMatch = user
    ? await bcrypt.compare(input.password, user.password)
    : await bcrypt.compare(input.password, dummyHash).then(() => false);

  if (!user || !passwordMatch) {
    throw new AppError(
      "Invalid email or password.",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "Your account has been deactivated. Please contact support.",
      403,
      "ACCOUNT_DEACTIVATED"
    );
  }

  // Generate token pair
  const accessToken = generateAccessToken(user.id, user.role);
  const rawRefreshToken = generateRawRefreshToken();

  // Store the HASH of the refresh token (never the raw value)
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: hashToken(rawRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
    },
  });

  const { password: _pwd, ...safeUser } = user;

  return {
    tokens: { accessToken, refreshToken: rawRefreshToken },
    user: safeUser,
  };
};

/**
 * Issue a new access token from a valid refresh token.
 * Implements refresh token rotation: old token is invalidated, new one issued.
 */
export const refreshAccessToken = async (
  rawRefreshToken: string
): Promise<{ accessToken: string; newRefreshToken: string }> => {
  if (!rawRefreshToken) {
    throw new AppError(
      "Refresh token is required.",
      401,
      "MISSING_REFRESH_TOKEN"
    );
  }

  const tokenHash = hashToken(rawRefreshToken);

  const session = await prisma.session.findUnique({
    where: { refreshToken: tokenHash },
    include: {
      user: { select: { id: true, role: true, isActive: true } },
    },
  });

  // Detect reuse of an already-invalidated token — potential theft
  if (!session) {
    throw new AppError(
      "Invalid refresh token. Please log in again.",
      401,
      "INVALID_REFRESH_TOKEN"
    );
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new AppError(
      "Session expired. Please log in again.",
      401,
      "REFRESH_TOKEN_EXPIRED"
    );
  }

  if (!session.user.isActive) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new AppError(
      "Your account has been deactivated.",
      403,
      "ACCOUNT_DEACTIVATED"
    );
  }

  // Rotate: delete old session, issue new refresh token
  const newRawRefreshToken = generateRawRefreshToken();
  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: hashToken(newRawRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
    },
  });

  const accessToken = generateAccessToken(session.user.id, session.user.role);

  return { accessToken, newRefreshToken: newRawRefreshToken };
};

/**
 * Logout — invalidate a single session (current device).
 * Idempotent: safe to call even if the session doesn't exist.
 */
export const logoutUser = async (rawRefreshToken?: string): Promise<void> => {
  if (!rawRefreshToken) return;
  await prisma.session.deleteMany({
    where: { refreshToken: hashToken(rawRefreshToken) },
  });
};

/**
 * Logout all devices — nuke every active session for this user.
 */
export const logoutAllSessions = async (userId: string): Promise<void> => {
  await prisma.session.deleteMany({ where: { userId } });
};

/**
 * Fetch a sanitized public profile (no password, no internal fields).
 */
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      vendor: {
        select: {
          id: true,
          storeName: true,
          description: true,
          status: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }

  return user;
};
