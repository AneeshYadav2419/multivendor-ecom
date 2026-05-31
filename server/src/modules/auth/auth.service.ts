import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../config/prismaClient.js";
import { env } from "../../config/env.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";
import { RegisterDTO, LoginDTO, TokenPair } from "./auth.dto.js";
import { Role } from "@prisma/client";
import { logger } from "../../utils/logger.js";

const JWT_ACCESS_SECRET = env.JWT_SECRET || "dev_access_secret";
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET || "dev_refresh_secret";
const ACCESS_TOKEN_EXPIRES_IN = env.JWT_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BCRYPT_SALT_ROUNDS = 12;

/**
 * Normalizes email address by trimming whitespace and converting to lowercase
 * to prevent duplicate account creation via case variations.
 */
const normalizeEmail = (email: string): string => email.toLowerCase().trim();

/**
 * Generates a short-lived cryptographically signed Access Token.
 */
const generateAccessToken = (userId: string, role: Role): string => {
  return jwt.sign({ userId, role }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as any,
    issuer: "multivendor-api",
    audience: "multivendor-client",
  });
};

/**
 * Generates a highly secure cryptographically random Refresh Token.
 */
const generateRawRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * Computes a secure SHA-256 hash of a raw token to prevent database leakage theft.
 */
const hashToken = (raw: string): string => {
  return crypto.createHash("sha256").update(raw).digest("hex");
};

/**
 * Garbage collection helper to prune expired used tokens and prevent table bloat.
 */
const pruneExpiredUsedTokens = async (): Promise<void> => {
  try {
    await prisma.usedRefreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch (err) {
    logger.error("Failed to prune expired used refresh tokens:", err);
  }
};

// ─────────────────────────────────────────────────────────
// Core Authentication Services
// ─────────────────────────────────────────────────────────

/**
 * Register a new user in the system.
 * If user registers with VENDOR role, a pending vendor store profile is generated atomically.
 */
export const registerUser = async (dto: RegisterDTO) => {
  const email = normalizeEmail(dto.email);
  const { name, role, storeName } = dto;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409, "DUPLICATE_EMAIL");
  }

  const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

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
                status: "PENDING", // Vendor must be approved by admin before operating
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

  logger.info(`User registered successfully: ${user.email} with role: ${user.role}`);
  return user;
};

/**
 * Authenticates user credentials and issues a valid token pair.
 * Utilizes constant-time dummy password comparison to protect against timing-based user-enumeration attacks.
 */
export const loginUser = async (dto: LoginDTO): Promise<{ tokens: TokenPair; user: any }> => {
  const email = normalizeEmail(dto.email);
  const user = await prisma.user.findUnique({ where: { email } });

  // Always compute bcrypt to prevent user timing profiling
  const dummyHash = "$2b$12$invalidhashinvalidhashinvalidhashinvalidhashinvalidhashxx";
  const passwordMatch = user
    ? await bcrypt.compare(dto.password, user.password)
    : await bcrypt.compare(dto.password, dummyHash).then(() => false);

  if (!user || !passwordMatch) {
    logger.warn(`Failed login attempt for: ${email}`);
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  if (!user.isActive) {
    logger.warn(`Inactive user login blocked: ${email}`);
    throw new AppError("Your account has been deactivated. Please contact support.", 403, "ACCOUNT_DEACTIVATED");
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const rawRefreshToken = generateRawRefreshToken();

  // Store only the secure SHA-256 hash of the refresh token in the database
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: hashToken(rawRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
    },
  });

  const { password: _pwd, ...safeUser } = user;
  logger.info(`User logged in successfully: ${user.email}`);

  return {
    tokens: { accessToken, refreshToken: rawRefreshToken },
    user: safeUser,
  };
};

/**
 * Refreshes session tokens.
 * Implements token rotation lineage checks to detect session theft and replay attacks.
 */
export const refreshAccessToken = async (rawRefreshToken: string): Promise<TokenPair> => {
  if (!rawRefreshToken) {
    throw new AppError("Refresh token is required.", 401, "MISSING_REFRESH_TOKEN");
  }

  const tokenHash = hashToken(rawRefreshToken);

  // 1. REPLAY ATTACK DETECTION
  // Check if this refresh token was already used and rotated previously
  const compromisedToken = await prisma.usedRefreshToken.findUnique({
    where: { tokenHash },
  });

  if (compromisedToken) {
    logger.error(
      `🚨 CRITICAL: Refresh token reuse detected for User ID ${compromisedToken.userId}! This indicates session theft.`
    );

    // Wipe out ALL active sessions and logged used tokens for this compromised user immediately
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId: compromisedToken.userId } }),
      prisma.usedRefreshToken.deleteMany({ where: { userId: compromisedToken.userId } }),
    ]);

    throw new AppError("Compromised session detected. All devices have been logged out.", 401, "SESSION_THEFT");
  }

  // 2. Fetch the active session matching the hash
  const session = await prisma.session.findUnique({
    where: { refreshToken: tokenHash },
    include: { user: { select: { id: true, role: true, isActive: true } } },
  });

  if (!session) {
    throw new AppError("Invalid or expired session. Please log in again.", 401, "INVALID_REFRESH_TOKEN");
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new AppError("Session has expired. Please log in again.", 401, "REFRESH_TOKEN_EXPIRED");
  }

  if (!session.user.isActive) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new AppError("Your account has been deactivated.", 403, "ACCOUNT_DEACTIVATED");
  }

  const newAccessToken = generateAccessToken(session.user.id, session.user.role);
  const newRawRefreshToken = generateRawRefreshToken();
  const newRefreshTokenHash = hashToken(newRawRefreshToken);

  // 3. SECURE ROTATION TRANSACTION
  // Move old token hash to UsedRefreshToken registry, update session to use new token hash
  await prisma.$transaction([
    prisma.usedRefreshToken.create({
      data: {
        tokenHash: session.refreshToken,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
    }),
    prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
      },
    }),
  ]);

  // Run asynchronous background pruning of expired tokens to maintain clean DB size
  pruneExpiredUsedTokens();

  return { accessToken: newAccessToken, refreshToken: newRawRefreshToken };
};

/**
 * Terminates a single session from a given refresh token hash.
 */
export const logoutUser = async (rawRefreshToken?: string): Promise<void> => {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  
  await prisma.session.deleteMany({
    where: { refreshToken: tokenHash },
  });
};

/**
 * Terminates all active sessions for a user (Terminates all devices).
 */
export const logoutAllSessions = async (userId: string): Promise<void> => {
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.usedRefreshToken.deleteMany({ where: { userId } });
  logger.info(`All active sessions terminated for user: ${userId}`);
};

/**
 * Fetches a public user profile from the database.
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
