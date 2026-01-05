import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
} from '../validations/auth.validation';

const router = Router();
const auth = new AuthController();

/**
 * PUBLIC ROUTES
 * No authentication required
 */
router.post('/register', validate(registerValidation), auth.register);
router.post('/login', validate(loginValidation), auth.login);
router.post('/refresh-token', auth.refreshToken);

// Email Verification
router.post('/verify-email', auth.verifyEmail);
router.post('/resend-verification', auth.resendVerification);

// Password Recovery
router.post('/forgot-password', validate(forgotPasswordValidation), auth.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), auth.resetPassword);

/**
 * PROTECTED ROUTES
 * User must be logged in (Bearer Token required)
 */
router.get('/profile', authenticate, auth.getProfile);
router.put('/profile', authenticate, validate(updateProfileValidation), auth.updateProfile);
router.put('/change-password', authenticate, validate(changePasswordValidation), auth.changePassword);
router.post('/logout', authenticate, auth.logout);

/**
 * ADMIN ONLY ROUTES
 */
router.get(
  '/admin/users', 
  authenticate, 
  authorize('admin'), 
  (req, res) => {
    res.json({ success: true, message: 'Admin access granted' });
  }
);

export default router;