import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(['house', 'apartment', 'condo', 'land', 'commercial']),
  status: z.enum(['for_sale', 'for_rent', 'sold', 'rented']),
  price: z.number().min(1, "Price is required"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  area: z.number().min(1, "Area is required"),
  yearBuilt: z.number().optional(),
  
  // Nested Address Object
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip Code is required"),
    country: z.string().min(1, "Country is required"),
  }),

  // Flattened Location for Form (will be converted to GeoJSON later)
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),

  amenities: z.array(z.string()),
  whatsappNumber: z.string().optional(),
  emailContact: z.string().email().optional().or(z.literal("")),

  // File Validation
  // React Hook Form returns a FileList, not a single File
  image: z
    .any()
    .refine((files) => files?.length > 0, "Image is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max image size is 5MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type PropertyFormData = z.infer<typeof propertySchema>;