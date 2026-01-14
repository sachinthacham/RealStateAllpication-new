import Joi from 'joi';

export const updateHeroSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),

  description: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters',
      'any.required': 'Description is required'
    }),

  imageUrl: Joi.string()
    .uri() 
    .required()
    .messages({
      'string.uri': 'Image URL must be a valid URL',
      'any.required': 'Image URL is required'
    }),

  isActive: Joi.boolean().optional()
});


export interface UpdateHeroInput {
  title: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
}