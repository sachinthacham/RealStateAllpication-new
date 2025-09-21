import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      role: string;
    };
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid token"));
  }
};

// Role-based authorization
export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError("Not authenticated"));
    if (!roles.includes(req.user.role))
      return next(new ForbiddenError("Access denied"));
    next();
  };
