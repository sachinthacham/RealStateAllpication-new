import Joi from 'joi';

export const notificationPreferencesValidation = Joi.object({
  emailDigest: Joi.string().valid('instant', 'daily', 'weekly').optional(),
  pushEnabled: Joi.boolean().optional(),
  smsEnabled: Joi.boolean().optional(),
});

export const createThreadValidation = Joi.object({
  participants: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  propertyId: Joi.string().hex().length(24).optional(),
  initialMessage: Joi.string().allow('').max(2000).optional(),
});
