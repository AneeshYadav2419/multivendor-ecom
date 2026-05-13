// Extend Express's Request interface to carry the verified user payload
// after the `protect` middleware runs.
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "CUSTOMER" | "VENDOR" | "ADMIN";
      };
    }
  }
}

// Required to make TypeScript treat this as an ambient module declaration
export {};
