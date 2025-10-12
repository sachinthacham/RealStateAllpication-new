import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/index";

export const generateToken = (payload: { id: string}) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
  return jwt.sign(payload, JWT_SECRET as Secret, options);
};
