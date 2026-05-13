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


      // Assign the validated data back to the request object
      // This ensures that the rest of the application uses clean, validated data
      req.body = validated.body;
      req.query = validated.query;
      req.params = validated.params;

      next();
    } catch (error) {
      // If validation fails, Zod throws a ZodError which is handled by our global errorHandler
      next(error);
    }
  };
