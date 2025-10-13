import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { IUser } from "../interfaces/IUser";

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, default: "buyer" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    wishlist:[{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Optional helper to generate a reset token (not saving here)
UserSchema.statics.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
  return { resetToken, hashed };
};

export default mongoose.model<IUser>("User", UserSchema);
