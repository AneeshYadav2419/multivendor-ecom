import { z } from "zod";
import { registerBodySchema, loginBodySchema } from "./auth.validation.js";

// Inferred DTOs from the raw body validation schemas
export type RegisterDTO = z.infer<typeof registerBodySchema>;
export type LoginDTO = z.infer<typeof loginBodySchema>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserSessionPayload {
  userId: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
}
