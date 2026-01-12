import mongoose, { Schema, Model } from 'mongoose';
import { IReview } from '../interfaces/IReview'; // Import the interface above

// 1. Define the Schema
const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Must match your User model name exactly
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property', // Must match your Property model name exactly
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      trim: true,
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// 2. Prevent Duplicate Reviews
// This ensures one user can only leave ONE review per property
ReviewSchema.index({ property: 1, user: 1 }, { unique: true });

// 3. Static Method: Calculate Average Rating
// This runs on the database side to keep your Property stats fast
ReviewSchema.statics.getAverageRating = async function (propertyId: string) {
  const obj = await this.aggregate([
    {
      $match: { property: propertyId },
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }, // Count total reviews
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      // Update the Property model with new stats
      // Note: You might need to add 'averageRating' and 'numReviews' to your Property Schema if they aren't there
      await mongoose.model('Property').findByIdAndUpdate(propertyId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10, // Round to 1 decimal
        numReviews: obj[0].numReviews,
      });
    } else {
      // Reset if no reviews left
      await mongoose.model('Property').findByIdAndUpdate(propertyId, {
        averageRating: 0,
        numReviews: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// 4. Middleware to Trigger Calculation
// Run after saving a new review
ReviewSchema.post('save', function (this: IReview) {
  (this.constructor as any).getAverageRating(this.property);
});

// Run before deleting a review (if using findOneAndRemove or similar)
// Note: In modern Mongoose, you might need post('findOneAndDelete') depending on your controller
ReviewSchema.post(/^findOneAnd/, async function (doc: IReview) {
  if (doc) {
    await (doc.constructor as any).getAverageRating(doc.property);
  }
});

// Create and export the model
const ReviewModel: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);
export default ReviewModel;