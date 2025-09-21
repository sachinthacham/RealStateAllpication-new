import { Schema, model, Document, Types } from "mongoose";

export interface IProperty extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  address: string;
  price: number;
  type: "apartment" | "house" | "condo" | "land";
  status: "available" | "rented" | "sold";
  images: string[];
  features: { bedrooms?: number; bathrooms?: number; area?: number };
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    type: {
      type: String,
      enum: ["apartment", "house", "condo", "land"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "rented", "sold"],
      default: "available",
    },
    images: [{ type: String }],
    features: {
      bedrooms: { type: Number },
      bathrooms: { type: Number },
      area: { type: Number },
    },
  },
  { timestamps: true }
);

const PropertyModel = model<IProperty>("Property", propertySchema);

export default PropertyModel;
