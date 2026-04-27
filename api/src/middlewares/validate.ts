import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

type ValidationSource = 'body' | 'query' | 'params';

const runValidation = (source: ValidationSource, schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload =
      source === 'body' ? req.body : source === 'query' ? req.query : req.params;

    const { error, value } = schema.validate(payload, {
      abortEarly: false, // Include all errors, not just the first one
      stripUnknown: true, // Remove fields not defined in the schema
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message.replace(/"/g, ''))
        .join(', ');
      
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: errorMessage,
      });
    }

    if (source === 'body') {
      req.body = value;
    } else if (source === 'query') {
      // Express 5 exposes req.query as a getter, so mutate instead of reassigning.
      for (const key of Object.keys(req.query)) {
        delete (req.query as Record<string, unknown>)[key];
      }
      Object.assign(req.query as Record<string, unknown>, value);
    } else if (source === 'params') {
      req.params = value;
    }
    next();
  };
};

export const validate = (schema: Schema) => runValidation('body', schema);
export const validateQuery = (schema: Schema) => runValidation('query', schema);
export const validateParams = (schema: Schema) => runValidation('params', schema);