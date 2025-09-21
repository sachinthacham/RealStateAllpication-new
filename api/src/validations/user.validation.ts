import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    profilePic: z.string().url("Invalid profile picture URL").optional(),
  }),
});

export const changeRoleSchema = z.object({
  body: z.object({
    role: z.enum(["buyer", "seller", "admin"], {
      message: "Invalid role specified",
    }),
  }),
  params: z.object({
    id: z.string().min(1, { message: "User ID is required" }),
  }),
});
