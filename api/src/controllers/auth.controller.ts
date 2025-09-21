import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
};

export const googleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    const result = await authService.googleSignIn(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
