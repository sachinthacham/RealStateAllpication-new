import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const signJwt = (payload: object, expiresIn?: string) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn || JWT_EXPIRES_IN });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
