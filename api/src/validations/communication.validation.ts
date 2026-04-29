import Joi from 'joi';

export const dispatchCommunicationValidation = Joi.object({
  channel: Joi.string().valid('email', 'whatsapp').required(),
  recipient: Joi.string().required(),
  subject: Joi.string().max(200).allow('').optional(),
  message: Joi.string().min(1).max(5000).required(),
  context: Joi.object().optional(),
});

export const whatsappLinkValidation = Joi.object({
  phone: Joi.string().required(),
  text: Joi.string().required(),
});
