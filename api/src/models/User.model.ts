import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'agent' | 'admin';
  phone?: string;
  profileImage?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
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
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  generateEmailVerificationToken(): string;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    phone: String,
    profileImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    lastLogin: Date,
    company: String,
    licenseNumber: String,
    bio: { type: String, maxlength: 1000 },
    experience: { type: Number, default: 0 },
    specialty: { type: [String], enum: ['residential', 'commercial', 'luxury', 'rental', 'investment'] },
    socialMedia: { facebook: String, twitter: String, linkedin: String, instagram: String },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generatePasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

UserSchema.methods.generateEmailVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return verificationToken;
};

UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  if (this.lockUntil && this.lockUntil < new Date()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
  }
  if (this.loginAttempts >= 5 && !this.lockUntil) {
    this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000);
  }
  await this.save();
};

export default mongoose.model<IUser>('User', UserSchema);