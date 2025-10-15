import mongoose, { Schema, Document } from "mongoose";
import { IProperty } from "../interfaces/IProperty";

export interface IPropertyModel extends IProperty, Document {}

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, enum: ["rent", "sale"], required: true },
    size: { type: Number, required: true },
    images: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPropertyModel>("Property", PropertySchema);
