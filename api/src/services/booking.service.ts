// src/services/booking.service.ts
import Booking, { IBooking } from "../models/booking.model";
import Property from "../models/property.model";

export const createBooking = async (buyerId: string, propertyId: string) => {
  const property = await Property.findById(propertyId);
  if (!property) throw { status: 404, message: "Property not found" };

  // Optional: check if property is already booked
  const existingBooking = await Booking.findOne({ property: propertyId, status: "confirmed" });
  if (existingBooking) throw { status: 400, message: "Property already booked" };

  const booking = await Booking.create({ buyer: buyerId, property: propertyId });
  return booking;
};

export const getUserBookings = async (buyerId: string) => {
  const bookings = await Booking.find({ buyer: buyerId }).populate("property");
  return bookings;
};

export const cancelBooking = async (bookingId: string, buyerId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw { status: 404, message: "Booking not found" };
  if (booking.buyer.toString() !== buyerId) throw { status: 403, message: "Not authorized" };

  booking.status = "cancelled";
  await booking.save();
  return booking;
};
