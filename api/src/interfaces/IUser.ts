import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
  wishlist: string[];
}
