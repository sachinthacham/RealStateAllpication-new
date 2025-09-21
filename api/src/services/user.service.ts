import UserModel from "../models/User.model.js";
import type  { IUser } from "../interfaces/IUser.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

export const getProfile = async (userId: string): Promise<IUser> => {
  const user = await UserModel.findById(userId).select("-password");
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const updateProfile = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<IUser> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await UserModel.findOne({ email: updateData.email });
    if (existingUser) throw new BadRequestError("Email already in use");
  }

  Object.assign(user, updateData);
  await user.save();
  return user;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  const users = await UserModel.find().select("-password");
  return users;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await UserModel.findByIdAndDelete(userId);
  if (!user) throw new NotFoundError("User not found");
};
