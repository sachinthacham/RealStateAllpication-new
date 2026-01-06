import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { toUserResponse } from '../interfaces/Mappers/UserMapper';

const authService = new AuthService();

export class AuthController {
  /**
   * Register a new user
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, tokens } = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: {
          user: toUserResponse(user),
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, tokens } = await authService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: toUserResponse(user),
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh Access Token
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await authService.refresh(req.body.refreshToken);
      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get Current User Profile
   */
  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getProfile(req.user!._id);
      res.status(200).json({
        success: true,
        data: { user: toUserResponse(user) },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update User Profile
   */
  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await authService.updateProfile(req.user!._id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: toUserResponse(user) },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify Email Address
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.verifyEmail(req.body.token);
      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resend Verification Email
   */
  resendVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.resendVerification(req.body.email);
      res.status(200).json({
        success: true,
        message: 'Verification email sent if account exists',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Forgot Password
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.forgotPassword(req.body);
      res.status(200).json({
        success: true,
        message: 'Password reset link sent if account exists',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reset Password
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.resetPassword(req.body);
      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change Password (Authenticated)
   */
  changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await authService.changePassword(req.user!._id, req.body);
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout User
   */
  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await authService.logout(req.user!._id);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}