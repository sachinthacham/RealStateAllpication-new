import mongoose from "mongoose";
import { MONGO_URI } from "./index";

export const connectDB = async () => {
  if (!MONGO_URI) throw new Error("MONGO_URI is required in env");
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
};
