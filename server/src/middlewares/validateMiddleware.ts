import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";

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
      // Validate the request against the schema
      // We use parseAsync to support any potential async refinements in the schema
      const validated = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;


      // Assign the validated body back to the request object
      // We only do this for the body as query/params are often read-only in Express 5
      req.body = validated.body;

      next();

    } catch (error) {
      // If validation fails, Zod throws a ZodError which is handled by our global errorHandler
      next(error);
    }
  };
