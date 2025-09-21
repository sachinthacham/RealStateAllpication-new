import bcrypt from "bcrypt";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
