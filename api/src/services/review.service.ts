import Review from '../models/review.model';
import Property from '../models/property.model';

// Create a new review
const createReview = async (propertyId: string, userId: string, data: { rating: number; comment: string }) => {
  // 1. Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error('Property not found');
  }

  // 2. Create Review
  // Note: The Schema's compound index will automatically throw an error 
  // if this user already reviewed this property.
  const review = await Review.create({
    property: propertyId,
    user: userId,
    rating: data.rating,
    comment: data.comment,
  });

  // 3. Populate user details immediately so the frontend can display the name/image
  await review.populate('user', 'name profileImage');

  return review;
};

// Get all reviews for a property
const getReviewsByProperty = async (propertyId: string) => {
  const reviews = await Review.find({ property: propertyId })
    .populate('user', 'name profileImage') // Get reviewer details
    .sort({ createdAt: -1 }); // Newest first

  return reviews;
};

export default {
  createReview,
  getReviewsByProperty,
};