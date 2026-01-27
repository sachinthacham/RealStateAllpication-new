export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public code?: string;
  
    constructor(message: string, statusCode: number, code?: string) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      this.code = code;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Common error types for authentication
  export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
      statusCode: 401,
    },
    ACCOUNT_LOCKED: {
      code: 'ACCOUNT_LOCKED',
      message: 'Account is temporarily locked',
      statusCode: 423,
    },
    ACCOUNT_DEACTIVATED: {
      code: 'ACCOUNT_DEACTIVATED',
      message: 'Account is deactivated',
      statusCode: 403,
    },
    EMAIL_NOT_VERIFIED: {
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Email not verified',
      statusCode: 403,
    },
    INVALID_TOKEN: {
      code: 'INVALID_TOKEN',
      message: 'Invalid token',
      statusCode: 401,
    },
    TOKEN_EXPIRED: {
      code: 'TOKEN_EXPIRED',
      message: 'Token expired',
      statusCode: 401,
    },
    INVALID_REFRESH_TOKEN: {
      code: 'INVALID_REFRESH_TOKEN',
      message: 'Invalid refresh token',
      statusCode: 401,
    },
    REFRESH_TOKEN_EXPIRED: {
      code: 'REFRESH_TOKEN_EXPIRED',
      message: 'Refresh token expired',
      statusCode: 401,
    },
    EMAIL_ALREADY_REGISTERED: {
      code: 'EMAIL_ALREADY_REGISTERED',
      message: 'Email already registered',
      statusCode: 400,
    },
    INVALID_RESET_TOKEN: {
      code: 'INVALID_RESET_TOKEN',
      message: 'Invalid or expired reset token',
      statusCode: 400,
    },
  };