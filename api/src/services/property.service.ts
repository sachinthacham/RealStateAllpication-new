import PropertyModel from "../models/Property.model.js";
import type{ IProperty } from "../interfaces/IProperty.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../utils/errors.js";

export const createProperty = async (
  ownerId: string,
  propertyData: Partial<IProperty>
): Promise<IProperty> => {
  const newProperty = await PropertyModel.create({
    ...propertyData,
    owner: ownerId,
  });
  return newProperty;
};

export const getAllProperties = async (filters: any): Promise<IProperty[]> => {
  const properties = await PropertyModel.find(filters).populate(
    "owner",
    "name email"
  );
  return properties;
};

export const getPropertyById = async (
  propertyId: string
): Promise<IProperty> => {
  const property = await PropertyModel.findById(propertyId).populate(
    "owner",
    "name email"
  );
  if (!property) throw new NotFoundError("Property not found");
  return property;
};

export const updateProperty = async (
  propertyId: string,
  updateData: Partial<IProperty>
): Promise<IProperty> => {
  const property = await PropertyModel.findByIdAndUpdate(
    propertyId,
    updateData,
    { new: true }
  );
  if (!property) throw new NotFoundError("Property not found");
  return property;
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  const property = await PropertyModel.findByIdAndDelete(propertyId);
  if (!property) throw new NotFoundError("Property not found");
};
