import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    property: z.string().min(1, "Property ID is required"),
    checkInDate: z.string().datetime("Invalid check-in date"),
    checkOutDate: z.string().datetime("Invalid check-out date"),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
      message: "Invalid booking status",
    }),
  }),
  params: z.object({
    id: z.string().min(1, { message: "Booking ID is required" }),
  }),
});
