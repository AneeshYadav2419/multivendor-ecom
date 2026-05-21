// Extend Express's Request interface to carry the verified user payload
// after the `protect` middleware runs.
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "CUSTOMER" | "VENDOR" | "ADMIN";
      };
      /** Parsed query from validate() — Express 5 req.query is read-only */
      validatedQuery?: Record<string, unknown>;
      /** Parsed route params from validate() */
      validatedParams?: Record<string, unknown>;
    }
  }
}

// Required to make TypeScript treat this as an ambient module declaration
export {};
