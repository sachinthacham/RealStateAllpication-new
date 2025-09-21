import type { Request, Response, NextFunction } from "express";
import * as emailService from "../services/email.service.js";

export const sendEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { to, subject, text } = req.body;
    await emailService.sendEmail(to, subject, text);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    next(error);
  }
};
