import { z } from "zod";

// Create booking
export const createBookingSchema = z.object({
  body: z.object({
    property: z.string().min(1),
    startDate: z.string().optional(), // ISO string
    endDate: z.string().optional(),
    message: z.string().max(500).optional(),
  }),
});

// Update booking status
export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "confirmed", "cancelled", "rejected"]),
  }),
});
