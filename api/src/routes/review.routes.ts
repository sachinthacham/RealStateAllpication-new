import express from 'express';
import {
  addReview,
  deleteReview,
  getPropertyReviews,
  reportReview,
  updateReview,
} from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware'; // Your auth middleware
import { validate } from '../middlewares/validate';
import {
  createReviewValidation,
  reportReviewValidation,
  updateReviewValidation,
} from '../validations/review.validation';

// mergeParams: true is CRITICAL
// It allows this router to access params (like :id) from the parent router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getPropertyReviews)
  .post(authenticate, validate(createReviewValidation), addReview); // Only logged-in users can post

router.patch('/:reviewId', authenticate, validate(updateReviewValidation), updateReview);
router.delete('/:reviewId', authenticate, deleteReview);
router.post('/:reviewId/report', authenticate, validate(reportReviewValidation), reportReview);

export default router;