import { z } from "zod";

// Signup validation
export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["buyer", "seller", "admin"]).optional(),
  }),
});

// Signin validation
export const signinSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// Google auth validation
export const googleAuthSchema = z.object({
  body: z.object({
    token: z.string().nonempty("Google token is required"),
  }),
});
