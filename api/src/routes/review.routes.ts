import express from 'express';
import { addReview, getPropertyReviews } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware'; // Your auth middleware

// mergeParams: true is CRITICAL
// It allows this router to access params (like :id) from the parent router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getPropertyReviews)
  .post(authenticate, addReview); // Only logged-in users can post

export default router;