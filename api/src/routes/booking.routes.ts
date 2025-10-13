// src/routes/booking.routes.ts
import express from "express";
import * as bookingController from "../controllers/booking.controller";
import { authenticate } from "../middlewares/authTokenOnly.middleware";

const router = express.Router();

router.post("/", authenticate, bookingController.bookProperty); // book a property
router.get("/", authenticate, bookingController.getBookings); // list user bookings
router.delete("/:bookingId", authenticate, bookingController.cancelBooking); // cancel booking

export default router;
