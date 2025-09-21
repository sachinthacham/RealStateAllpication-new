import { z } from "zod";

// Create property
export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    price: z.number().positive(),
    address: z.string().min(5),
    type: z.enum(["house", "apartment", "land", "commercial"]).optional(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    area: z.number().optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

// Update property
export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    address: z.string().min(5).optional(),
    type: z.enum(["house", "apartment", "land", "commercial"]).optional(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    area: z.number().optional(),
    images: z.array(z.string().url()).optional(),
    status: z.enum(["draft", "published", "sold", "archived"]).optional(),
  }),
});
