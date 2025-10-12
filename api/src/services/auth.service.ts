import crypto from "crypto";
import User from "../models/User.model";
import { generateToken } from "../utils/generateToken";
import { sendEmail } from "../utils/sendEmail";
import { CLIENT_URL } from "../config/index";

export const signup = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw { status: 400, message: "Email already registered" };
  const user = await User.create({ name, email, password });
  const token = generateToken({ id: user._id.toString()});
  return {
    user: { id: user._id, name: user.name, email: user.email},
    token,
  };
};

export const signin = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 400, message: "Invalid credentials" };
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw { status: 400, message: "Invalid credentials" };
  const token = generateToken({ id: user._id.toString() });
  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 400, message: "No account with that email" };

  // generate token and save hashed into DB
  // We send raw to user
  const resetTokenRaw = crypto.randomBytes(32).toString("hex");
  const hashed = crypto
    .createHash("sha256")
    .update(resetTokenRaw)
    .digest("hex");
  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
  await user.save();

  const resetUrl = `${CLIENT_URL}/reset-password?token=${resetTokenRaw}&id=${user._id}`;
  const html = `<p>You requested a password reset. Click link to reset password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you didn't request, ignore this email.</p>`;

  await sendEmail(user.email, "Password Reset", html);
  return;
};

// reset password using the token
// Token is sent in raw form, we hash and compare to DB
// Also check expiry
export const resetPassword = async (
  userId: string,
  tokenRaw: string,
  newPassword: string
) => {
  const hashed = crypto.createHash("sha256").update(tokenRaw).digest("hex");
  const user = await User.findOne({
    _id: userId,
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) throw { status: 400, message: "Token invalid or expired" };

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  // Optionally return a JWT to auto-login after reset:
  const token = generateToken({ id: user._id.toString()});
  return { user: { id: user._id, name: user.name, email: user.email }, token };
};
