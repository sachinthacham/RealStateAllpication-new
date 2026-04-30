import Joi from 'joi';

export const createInquiryValidation = Joi.object({
  propertyId: Joi.string().hex().length(24).required(),
  message: Joi.string().min(10).max(1500).required(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().min(7).max(20).optional(),
});

export const updateInquiryStatusValidation = Joi.object({
  status: Joi.string().valid('new', 'contacted', 'closed').required(),
  statusNote: Joi.string().max(800).allow('').optional(),
});
