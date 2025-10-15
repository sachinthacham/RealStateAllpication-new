import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.number().positive("Price must be a positive number"),
  location: z.string().min(2, "Location is required"),
  propertyType: z.enum(["rent", "sale"], {
    errorMap: () => ({ message: "Property type must be either 'rent' or 'sale'" }),
  }),
  size: z.number().positive("Size must be a positive number"),
  images: z.array(z.string().url("Must be a valid image URL")).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();
