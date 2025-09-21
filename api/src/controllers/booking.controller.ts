import type { Request, Response, NextFunction } from "express";
import * as bookingService from "../services/booking.service.js";
import { BadRequestError } from "../utils/errors.js";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const booking = await bookingService.createBooking(userId, req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookingsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const bookings = await bookingService.getBookingsByUser(userId);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const bookingId = req.params.id;
    if (!bookingId) throw new BadRequestError("Booking ID is required");
    await bookingService.cancelBooking(userId, bookingId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
