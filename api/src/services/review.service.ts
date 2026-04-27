import Review from '../models/review.model';
import Property from '../models/property.model';
import { Types } from 'mongoose';
import { AppError } from '../utils/appError';

// Create a new review
const createReview = async (propertyId: string, userId: string, data: { rating: number; comment: string }) => {
  if (!Types.ObjectId.isValid(propertyId)) {
    throw new AppError('Invalid property id', 400);
  }
  // 1. Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new AppError('Property not found', 404);
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
  if (!Types.ObjectId.isValid(propertyId)) {
    throw new AppError('Invalid property id', 400);
  }
  const reviews = await Review.find({ property: propertyId })
    .populate('user', 'name profileImage') // Get reviewer details
    .sort({ createdAt: -1 }); // Newest first

  return reviews;
};

const updateReview = async (
  reviewId: string,
  userId: string,
  role: string,
  payload: { rating?: number; comment?: string }
) => {
  if (!Types.ObjectId.isValid(reviewId)) {
    throw new AppError('Invalid review id', 400);
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  const canUpdate = role === 'admin' || String(review.user) === userId;
  if (!canUpdate) {
    throw new AppError('You do not have permission to update this review', 403);
  }

  if (payload.rating !== undefined) review.rating = payload.rating;
  if (payload.comment !== undefined) review.comment = payload.comment;
  await review.save();
  return review.populate('user', 'name profileImage');
};

const deleteReview = async (reviewId: string, userId: string, role: string) => {
  if (!Types.ObjectId.isValid(reviewId)) {
    throw new AppError('Invalid review id', 400);
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  const canDelete = role === 'admin' || String(review.user) === userId;
  if (!canDelete) {
    throw new AppError('You do not have permission to delete this review', 403);
  }

  await Review.findByIdAndDelete(reviewId);
};

const reportReview = async (reviewId: string) => {
  if (!Types.ObjectId.isValid(reviewId)) {
    throw new AppError('Invalid review id', 400);
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  return { success: true, reviewId };
};

export default {
  createReview,
  getReviewsByProperty,
  updateReview,
  deleteReview,
  reportReview,
};