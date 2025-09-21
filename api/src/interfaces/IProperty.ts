import type { IUser } from "./IUser.js";

export type PropertyStatus = "draft" | "published" | "sold" | "archived";

export interface IProperty {
  _id?: string;
  title: string;
  description: string;
  price: number;
  address: string;
  owner: string | IUser; // can be populated
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number; // in sqft or sqm
  type?: "house" | "apartment" | "land" | "commercial";
  status?: PropertyStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
