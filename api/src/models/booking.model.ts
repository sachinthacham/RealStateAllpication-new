// src/models/booking.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  buyer: string; // user ID
  property: string; // property ID
  status: "pending" | "confirmed" | "cancelled";
  bookedAt: Date;
}

const BookingSchema: Schema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  bookedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBooking>("Booking", BookingSchema);
