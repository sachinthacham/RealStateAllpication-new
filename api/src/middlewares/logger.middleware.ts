import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
};
