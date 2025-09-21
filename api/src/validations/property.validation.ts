import { z } from "zod";

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    address: z.string().min(1, "Address is required"),
    price: z.number().positive("Price must be a positive number"),
    type: z.enum(["apartment", "house", "condo", "land"], {
      message: "Invalid property type",
    }),
    images: z.array(z.string().url("Invalid image URL")).optional(),
    features: z
      .object({
        bedrooms: z
          .number()
          .int()
          .positive("Bedrooms must be a positive integer")
          .optional(),
        bathrooms: z
          .number()
          .int()
          .positive("Bathrooms must be a positive integer")
          .optional(),
        area: z.number().positive("Area must be a positive number").optional(),
      })
      .optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    address: z.string().min(1, "Address is required").optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    type: z
      .enum(["apartment", "house", "condo", "land"], {
        message: "Invalid property type",
      })
      .optional(),
    images: z.array(z.string().url("Invalid image URL")).optional(),
    features: z
      .object({
        bedrooms: z
          .number()
          .int()
          .positive("Bedrooms must be a positive integer")
          .optional(),
        bathrooms: z
          .number()
          .int()
          .positive("Bathrooms must be a positive integer")
          .optional(),
        area: z.number().positive("Area must be a positive number").optional(),
      })
      .optional(),
    status: z
      .enum(["available", "rented", "sold"], {
        message: "Invalid property status",
      })
      .optional(),
  }),
  params: z.object({
    id: z.string().min(1, { message: "Property ID is required" }),
  }),
});
