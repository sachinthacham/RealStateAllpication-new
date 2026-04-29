import User from '../models/User.model';
import { Types } from 'mongoose';
import { AppError } from '../utils/appError';
import Property from '../models/property.model';

// Toggle Favorite (Add/Remove)
const toggleFavorite = async (userId: string, propertyId: string) => {
  if (!Types.ObjectId.isValid(propertyId)) {
    throw new AppError('Invalid property id', 400);
  }
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  const property = await Property.findById(propertyId);
  if (!property) throw new AppError('Property not found', 404);

  // Check if already favorite
  const isFavorite = user.favorites.includes(propertyId as any);

  if (isFavorite) {
    // Remove it
    user.favorites = user.favorites.filter((id) => id.toString() !== propertyId);
  } else {
    // Add it
    user.favorites.push(propertyId as any);
  }

  await user.save();
  return { isFavorite: !isFavorite, favorites: user.favorites };
};

// Get All Favorites (Populated with details)
const getFavorites = async (userId: string) => {
  const user = await User.findById(userId).populate('favorites'); // "populate" fetches the full Property data
  if (!user) throw new AppError('User not found', 404);
  return user.favorites;
};

export default {
  toggleFavorite,
  getFavorites,
};