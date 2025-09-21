import type { AnyZodObject } from "zod";
import type { Request, Response, NextFunction } from "express";

// Middleware to validate Zod schemas
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      const errors = err.errors?.map((e: any) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({ success: false, errors });
    }
  };
