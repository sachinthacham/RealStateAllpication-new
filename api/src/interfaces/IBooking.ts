import type { IUser } from "./IUser.js";
import type { IProperty } from "./IProperty.js";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "rejected";

export interface IBooking {
  _id: string;
  property: string | IProperty; // can be populated
  user: string | IUser; // buyer id or populated
  startDate?: Date;
  endDate?: Date;
  message?: string;
  status?: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
