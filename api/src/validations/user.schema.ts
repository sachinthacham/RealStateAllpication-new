import { z } from "zod";

// Update profile validation
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    profilePic: z.string().url().optional(),
  }),
});

// Admin change role
export const changeRoleSchema = z.object({
  body: z.object({
    role: z.enum(["buyer", "seller", "admin"]),
  }),
});
