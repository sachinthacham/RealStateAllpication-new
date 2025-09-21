import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import UserModel from "../models/User.model.js";
import type { IUser } from "../models/User.model.js";
import type { LoginInput } from "../interfaces/auth.interface.js";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "../utils/errors.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const signup = async (
  payload: Partial<IUser>
): Promise<Partial<IUser>> => {
  const { name, email, password, role } = payload;

  const existing = await UserModel.findOne({ email });
  if (existing) throw new ConflictError("Email already registered");

  if (!password) throw new BadRequestError("Password is required");

  const hashed = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, password: hashed, role });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic,
  };
};

export const signin = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new NotFoundError("User not found");

  const valid = await bcrypt.compare(password, user.password || "");
  if (!valid) throw new BadRequestError("Invalid credentials");

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return { token };
};

export const googleSignIn = async (
  idToken: string
): Promise<{ token: string }> => {
  if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID not configured");

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new BadRequestError("Invalid Google token");

  const email = payload.email;
  const name = payload.name || "Google User";
  const picture = payload.picture;
  const googleId = payload.sub;

  if (!email) throw new BadRequestError("Google token did not contain email");

  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({
      name,
      email,
      googleId,
      profilePic: picture,
      role: "buyer",
    });
  } else if (!user.googleId) {
    // attach google id if user previously signed up with email
    user.googleId = googleId;
    if (!user.profilePic && picture) user.profilePic = picture;
    await user.save();
  }

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return { token };
};

export const refreshToken = async (
  userId: string
): Promise<{ token: string }> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return { token };
};
