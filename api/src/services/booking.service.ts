import { startSession } from "mongoose";
import BookingModel from "../models/Booking.model.js";
import type { IBooking } from "../interfaces/IBooking.js";
import PropertyModel from "../models/Property.model.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/errors.js";

export const createBooking = async (
  userId: string,
  bookingData: Partial<IBooking>
): Promise<IBooking> => {
  const { property, checkInDate, checkOutDate } = bookingData;

  const prop = await PropertyModel.findById(property);
  if (!prop) throw new NotFoundError("Property not found");

  // Basic date validation
  const checkIn = new Date(checkInDate as string);
  const checkOut = new Date(checkOutDate as string);
  if (checkIn >= checkOut)
    throw new BadRequestError("Check-out date must be after check-in date");

  const session = await startSession();
  session.startTransaction();

  try {
    // Check for overlapping bookings (simplified)
    const overlappingBookings = await BookingModel.find({
      property,
      $or: [{ checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }],
    }).session(session);

    if (overlappingBookings.length > 0) {
      throw new BadRequestError(
        "Property is not available for the selected dates"
      );
    }

    const newBooking = await BookingModel.create(
      [
        {
          ...bookingData,
          user: userId,
          property: prop._id,
          status: "pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return newBooking[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getBookingsByUser = async (
  userId: string
): Promise<IBooking[]> => {
  const bookings = await BookingModel.find({ user: userId }).populate(
    "property"
  );
  return bookings;
};

export const cancelBooking = async (
  userId: string,
  bookingId: string
): Promise<void> => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) throw new NotFoundError("Booking not found");
  if (booking.user.toString() !== userId)
    throw new ForbiddenError("Not authorized to cancel this booking");

  booking.status = "cancelled";
  await booking.save();
};

export const updateBookingStatus = async (
  bookingId: string,
  status: string
): Promise<IBooking> => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) throw new NotFoundError("Booking not found");

  // Add more robust status transition logic if needed
  booking.status = status as IBooking["status"];
  await booking.save();
  return booking;
};
