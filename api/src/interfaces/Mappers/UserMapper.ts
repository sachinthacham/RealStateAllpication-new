import { IUserResponse } from '../IUser';

/**
 * Converts a Mongoose User Document to a Clean API Response Object
 * @param user - The raw user document from the database
 * @returns A sanitized IUserResponse object
 */
export const toUserResponse = (user: any): IUserResponse => {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    profileImage: user.profileImage,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    lastLogin: user.lastLogin,
    company: user.company,
    licenseNumber: user.licenseNumber,
    bio: user.bio,
    experience: user.experience,
    specialty: user.specialty,
    socialMedia: user.socialMedia,
    // Note: Password and tokens are EXCLUDED here
  };
};