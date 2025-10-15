import Property, { IPropertyModel } from "../models/property.model";
import { IProperty } from "../interfaces/IProperty";

export const createProperty = async (
  data: IProperty
): Promise<IPropertyModel> => {
  const property = new Property(data);
  return property.save();
};

export const getProperties = async (): Promise<IPropertyModel[]> => {
  return Property.find().populate("createdBy", "name email");
};

export const getPropertyById = async (
  id: string
): Promise<IPropertyModel | null> => {
  return Property.findById(id).populate("createdBy", "name email");
};

export const updateProperty = async (
  id: string,
  data: Partial<IProperty>
): Promise<IPropertyModel | null> => {
  return Property.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProperty = async (
  id: string
): Promise<IPropertyModel | null> => {
  return Property.findByIdAndDelete(id);
};
