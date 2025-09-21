import express from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createBookingSchema, updateBookingStatusSchema } from "../validations/booking.validation.js";

const router = express.Router();

// All routes protected (only logged-in users)
router.use(authenticate);

// Buyer creates booking
router.post("/", validate(createBookingSchema), bookingController.createBooking);

// Buyer views their bookings
router.get("/me", bookingController.getBookingsByUser);

// Cancel booking
router.delete("/:id", bookingController.cancelBooking);

// Admin updates booking status (optional: you can create separate admin route)
router.put("/:id/status", authorize("admin"), validate(updateBookingStatusSchema), async (req, res) => {
  res.send("Update booking status - implement in bookingController");
});

export default router;
