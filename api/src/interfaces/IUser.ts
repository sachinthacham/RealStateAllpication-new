export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IUserResponse {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'agent' | 'admin';
  phone?: string;
  profileImage?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  company?: string;
  licenseNumber?: string;
  bio?: string;
  experience?: number;
  specialty?: string[];
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: IUserResponse;
    tokens?: IAuthTokens;
  };
}

export interface ILoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'user' | 'agent';
  company?: string;
  licenseNumber?: string;
}

export interface IForgotPasswordData { email: string; }
export interface IResetPasswordData { token: string; password: string; }
export interface IChangePasswordData { currentPassword: string; newPassword: string; }
export interface IUpdateProfileData {
  name?: string;
  phone?: string;
  profileImage?: string;
  company?: string;
  bio?: string;
  experience?: number;
  specialty?: string[];
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}