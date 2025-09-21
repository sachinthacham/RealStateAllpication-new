import type { Response } from "express";

export const successResponse = (
  res: Response,
  data: any,
  message = "Success",
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message = "Error",
  status = 500,
  errors?: any
) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
