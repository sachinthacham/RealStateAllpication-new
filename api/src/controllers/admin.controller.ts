import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errors.js";

// Placeholder functions for Admin Controller
export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ message: "Get all users (Admin)" });
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ message: `Get user by ID: ${req.params.id} (Admin)` });
};

export const updateUserRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    message: `Update user ${req.params.id} role to ${req.body.role} (Admin)`,
  });
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  res
    .status(200)
    .json({ message: `Delete user by ID: ${req.params.id} (Admin)` });
};

export const getAllProperties = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ message: "Get all properties (Admin)" });
};

export const deleteProperty = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(200)
    .json({ message: `Delete property by ID: ${req.params.id} (Admin)` });
};
