import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";
import { BadRequestError } from "../utils/errors.js";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const user = await userService.getProfile(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const updated = await userService.updateProfile(userId, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!userId) throw new BadRequestError("User ID is required");
    await userService.deleteUser(userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
