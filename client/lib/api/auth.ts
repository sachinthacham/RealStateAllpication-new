// src/lib/api/auth.ts
import apiClient from "./client";
import {
  LoginFormData,
  RegisterFormData,
  AuthUser,
} from "@/components/features/auth/types/user";
import {
  loginSchema,
  registerSchema,
} from "@/components/features/auth/schemas/auth";
import { refresh } from "next/cache";

// Define the shape of your Backend Response
interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

export const authAPI = {
  login: async (data: LoginFormData) => {
    const validatedData = loginSchema.parse(data);

    // 1. Get the raw response
    const response = await apiClient.post<BackendAuthResponse>(
      "/auth/login",
      validatedData
    );

    // 2.  Extract the nested data correctly
    // We map 'accessToken' to 'token' so Zustand finds it easily
    return {
      user: response.data.data.user,
      accessToken: response.data.data.tokens.accessToken,
      refreshToken: response.data.data.tokens.refreshToken,
    };
  },

  register: async (data: RegisterFormData) => {
    const validatedData = registerSchema.parse(data);

    const response = await apiClient.post<BackendAuthResponse>(
      "/auth/register",
      validatedData
    );

    //  Same mapping for register
    return {
      user: response.data.data.user,
      accessToken: response.data.data.tokens.accessToken,
      refreshToken: response.data.data.tokens.refreshToken,
    };
  },

  logout: async () => {
    // Check your backend route: is it /auth/logout or /api/auth/logout?
    // Based on previous code, likely:
    await apiClient.post("/auth/logout");
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", {
      email,
    });
    return response.data.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  // Note: Verify what your /verify endpoint returns.
  // If it matches the login structure, apply the same mapping.
  verifyToken: async (token: string) => {
    const response = await apiClient.get<AuthUser>("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // If backend returns { success: true, data: { user... } }
    // use: return response.data.data;
    // If backend returns direct user object:
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post<BackendAuthResponse>("/auth/refresh");
    // Return just the new token string for the interceptor
    return {
      token: response.data.data.tokens.accessToken,
    };
  },
};
