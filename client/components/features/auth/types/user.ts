export type UserRole = 'user' | 'agent' | 'admin';

export interface User {
  _id: string;
  id?: string; // Optional alias if you map _id to id in frontend
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string; // Matches backend "profileImage"
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  experience?: number;
  specialty?: string[];
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  createdAt?: string; // Backend sends dates as strings usually
  updatedAt?: string;
}

// Since AuthUser in your store represents the logged-in user, 
// it should match the "user" object from the login response exactly.
export interface AuthUser extends User {
  // If you decide to store tokens inside the user object in Zustand, add them here.
  // Otherwise, this can just extend User.
}

// --- Forms remain the same ---

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}