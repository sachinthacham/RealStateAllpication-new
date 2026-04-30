import Joi from 'joi';

export const createReportValidation = Joi.object({
  targetType: Joi.string().valid('property', 'user', 'review').required(),
  targetId: Joi.string().hex().length(24).required(),
  reason: Joi.string()
    .valid(
      'spam',
      'fraud',
      'misleading_information',
      'offensive_content',
      'duplicate_listing',
      'other'
    )
    .required(),
  description: Joi.string().max(1200).allow('').optional(),
});

export const updateReportStatusValidation = Joi.object({
  status: Joi.string().valid('open', 'in_review', 'resolved', 'rejected').required(),
  resolutionNote: Joi.string().max(1200).allow('').optional(),
});

export const updateUserStatusValidation = Joi.object({
  isActive: Joi.boolean().required(),
  note: Joi.string().max(600).allow('').optional(),
});

export const moderatePropertyValidation = Joi.object({
  moderationStatus: Joi.string().valid('pending', 'approved', 'rejected').required(),
  moderationNotes: Joi.string().max(1000).allow('').optional(),
});
