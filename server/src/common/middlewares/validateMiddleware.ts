import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

interface ValidatedRequestParts {
  body?: unknown;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

/**
 * Reusable validation middleware.
 * It takes a Zod schema and validates the request body, params, and query.
 * If validation fails, it passes the error to the global error handler.
 *
 * @param schema - The Zod schema to validate against
 */
export const validate =
  (schema: ZodTypeAny) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = (await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,

        })) as ValidatedRequestParts;

        if (validated.body !== undefined) {
          req.body = validated.body;
        }

        // Express 5: req.query and req.params are read-only — store parsed values separately
        if (validated.query !== undefined) {
          req.validatedQuery = validated.query;
        }

        if (validated.params !== undefined) {
          req.validatedParams = validated.params;
        }

        next();
      } catch (error) {
        next(error);
      }
    };
