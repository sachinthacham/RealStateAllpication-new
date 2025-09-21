export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: "buyer" | "seller" | "admin";
    googleId?: string;
    profilePic?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  