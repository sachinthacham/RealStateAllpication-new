import { z } from "zod";

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["user", "seller", "admin"], { message: "Invalid role specified" }),
  }),
  params: z.object({
    id: z.string().min(1, { message: "User ID is required" }),
  }),
});
