import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AuthUser,
  LoginFormData,
  RegisterFormData,
} from "@/components/features/auth/types/user";
import { authAPI } from "@/lib/api/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Simplified Actions
  login: (data: LoginFormData) => Promise<AuthUser>;
  register: (data: RegisterFormData) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginFormData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(data);
          
          // 1. Extract data correctly (handling nested 'data' if needed)
          const { user, accessToken, refreshToken } = response;

          // 2. Save BOTH tokens
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          document.cookie = `token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;

          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterFormData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(data);
          
          // Assuming register response also returns tokens (Auto-login)
          const { user, accessToken, refreshToken } = response;

          if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            document.cookie = `token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
            set({ user, isAuthenticated: true, isLoading: false });
            return user;
          } else {
            // If register doesn't return tokens (requires email verify first)
            set({ isLoading: false }); 
            return null;
          }
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },
      checkAuth: async () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          set({ isAuthenticated: true }); // "Okay, found a token, you stay logged in."
        } else {
          set({ isAuthenticated: false }); // "No token? You are logged out."
        }
      }
,
      logout: async () => {
        set({ isLoading: true });
        try {
          // Attempt backend logout (optional but good)
          try {
            await authAPI.logout();
          } catch (err) {
            console.warn("Backend logout failed, clearing local state anyway");
          }

          // 3. Remove BOTH tokens
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          document.cookie = "token=; path=/; max-age=0";
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          // Calls the API to send the reset link
          await authAPI.forgotPassword(email);
          set({ isLoading: false });
          // Note: We don't usually set 'user' here, as they aren't logged in yet
        } catch (error: any) {
          set({
            error: error.message || "Failed to send reset email",
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          // Calls the API to finalize the password change
          await authAPI.resetPassword(token, newPassword);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to reset password",
            isLoading: false,
          });
          throw error;
        }
      },


      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);