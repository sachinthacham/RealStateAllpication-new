import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User.model';
import { JWT_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY, FRONTEND_URL } from '../config';
import { ILoginCredentials, IRegisterData, IAuthTokens, IForgotPasswordData, IResetPasswordData, IChangePasswordData } from '../interfaces/IUser';
import { AppError } from '../utils/appError';
import { sendEmail } from '../utils/sendEmail';
import { IUpdateProfileData } from '../interfaces/IUser';

export class AuthService {
 
  private generateTokens(user: IUser): IAuthTokens {
    const accessOptions: SignOptions = { 
      expiresIn: JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'] 
    };
    
    const refreshOptions: SignOptions = { 
      expiresIn: JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'] 
    };

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role, type: 'access' },
      JWT_SECRET,
      accessOptions
    );

    const refreshToken = jwt.sign(
      { id: user._id, type: 'refresh' },
      JWT_SECRET,
      refreshOptions
    );
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  // Register new user
  async register(userData: IRegisterData): Promise<{ user: IUser; tokens: IAuthTokens }> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = new User(userData);
    
    // In production, you would generate a verification token here
    user.isEmailVerified = false; 
    await user.save();

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  // Login user
  async login(credentials: ILoginCredentials): Promise<{ user: IUser; tokens: IAuthTokens }> {
    const user = await User.findOne({ email: credentials.email })
      .select('+password +isActive +lockUntil +loginAttempts');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    const isMatch = await user.comparePassword(credentials.password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      throw new AppError('Invalid email or password', 401);
    }

    // Reset attempts on success
    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  // Refresh Token Logic
  async refresh(token: string): Promise<IAuthTokens> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; type: string };
      
      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 400);
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }


  /**
   * Resend Verification Email
   */
  async resendVerification(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) return; // Silent return for security
    if (user.isEmailVerified) throw new AppError('Email already verified', 400);

    const token = user.generateEmailVerificationToken();
    await user.save();

    const url = `${FRONTEND_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`
    });
  }

  /**
   * Forgot Password - Generate Reset Token
   */
  async forgotPassword(data: IForgotPasswordData): Promise<void> {
    const user = await User.findOne({ email: data.email });
    if (!user) return; // Do not reveal user existence

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const url = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${url}">here</a> to reset it. This link expires in 10 minutes.</p>`
    });
  }

  /**
   * Reset Password using Token
   */
  async resetPassword(data: IResetPasswordData): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) throw new AppError('Token is invalid or has expired', 400);

    user.password = data.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }

  /**
   * Change Password (Authenticated users)
   */
  async changePassword(userId: string, data: IChangePasswordData): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect', 401);

    user.password = data.newPassword;
    await user.save();
  }

  /**
   * Logout - Optional DB cleanup
   */
  async logout(userId: string): Promise<void> {
    // If you store refresh tokens in DB, nullify them here
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  // ... (previous methods like login, register, generateTokens)

  /**
   * Get User Profile
   * Purpose: Fetch the most up-to-date user data from the database.
   */
  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Update User Profile
   * Purpose: Update allowed fields and return the updated document.
   */
  async updateProfile(userId: string, data: IUpdateProfileData): Promise<IUser> {
    // We use findByIdAndUpdate with { new: true } to get the updated doc
    // and { runValidators: true } to ensure schema rules are followed.
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!user) {
      throw new AppError('User not found or update failed', 404);
    }

    return user;
  }

  /**
   * Verify Email / Verify Profile
   * Purpose: Mark a user as verified using a token sent to their email.
   */
  async verifyEmail(token: string): Promise<void> {
    // 1. Hash the incoming token to match the stored hash in DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 2. Find user with valid token and check expiry
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Verification token is invalid or has expired', 400);
    }

    // 3. Update verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined; // Clear the token
    user.emailVerificationExpires = undefined;

    await user.save();
  }
}