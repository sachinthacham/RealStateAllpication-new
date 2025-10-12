import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../utils/error";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { id: string; role?: string };
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
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      id?: string;
      role?: string;
    };

    if (!decoded.id) {
      throw new UnauthorizedError("Invalid token payload");
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid token"));
  }
};
