import Joi from 'joi';

export const createReviewValidation = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(3).max(500).required(),
});

export const updateReviewValidation = Joi.object({
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().min(3).max(500).optional(),
}).or('rating', 'comment');

export const reportReviewValidation = Joi.object({
  reason: Joi.string().min(3).max(200).required(),
});
