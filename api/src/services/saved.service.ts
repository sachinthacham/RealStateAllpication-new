import User from '../models/User.model';


const toggleSavedProperty = async (userId: string, propertyId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

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
  if (!user) throw new Error('User not found');
  return user.savedProperties;
};

export default {
  // ... existing exports
  toggleSavedProperty,
  getSavedProperties,
};