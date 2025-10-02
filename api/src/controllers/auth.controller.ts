import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signup(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.signin(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.json({ message: "Password reset email sent (if account exists)" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password, id } = req.body;
    if (!id) throw { status: 400, message: "User id required" };
    const result = await authService.resetPassword(id, token, password);
    res.json({ message: "Password reset successful", ...result });
  } catch (err) {
    next(err);
  }
};
