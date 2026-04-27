import User from '../models/User.model';
import { Types } from 'mongoose';
import { AppError } from '../utils/appError';
import Property from '../models/property.model';


const toggleSavedProperty = async (userId: string, propertyId: string) => {
  if (!Types.ObjectId.isValid(propertyId)) {
    throw new AppError('Invalid property id', 400);
  }
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  const property = await Property.findById(propertyId);
  if (!property) throw new AppError('Property not found', 404);

  // Check if already saved
  const isSaved = user.savedProperties.some((id) => id.toString() === propertyId);

  if (isSaved) {
    // Remove from saved
    user.savedProperties = user.savedProperties.filter((id) => id.toString() !== propertyId);
  } else {
    // Add to saved
    user.savedProperties.push(propertyId as any);
  }

  await user.save();
  return { isSaved: !isSaved, savedProperties: user.savedProperties };
};

// Get All Saved Properties
const getSavedProperties = async (userId: string) => {
  const user = await User.findById(userId).populate('savedProperties');
  if (!user) throw new AppError('User not found', 404);
  return user.savedProperties;
};

export default {
  // ... existing exports
  toggleSavedProperty,
  getSavedProperties,
};