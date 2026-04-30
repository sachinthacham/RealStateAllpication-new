import Joi from 'joi';

export const createSavedSearchValidation = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  filters: Joi.object().required(),
  isAlertEnabled: Joi.boolean().default(true),
  frequency: Joi.string().valid('instant', 'daily', 'weekly').default('daily'),
});

export const updateSavedSearchValidation = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
  filters: Joi.object().optional(),
  isAlertEnabled: Joi.boolean().optional(),
  frequency: Joi.string().valid('instant', 'daily', 'weekly').optional(),
  isActive: Joi.boolean().optional(),
});
