import Joi from 'joi';

export const registerValidation = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required().trim(),
  phone: Joi.string().allow('', null),
  role: Joi.string().valid('user', 'agent').default('user'),
  company: Joi.string().when('role', { is: 'agent', then: Joi.required() }),
  licenseNumber: Joi.string().when('role', { is: 'agent', then: Joi.required() }),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().default(false),
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
});

export const resetPasswordValidation = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const changePasswordValidation = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

export const updateProfileValidation = Joi.object({
  name: Joi.string().trim(),
  phone: Joi.string().allow('', null),
  profileImage: Joi.string().uri().allow(''),
  company: Joi.string().allow(''),
  bio: Joi.string().max(1000).allow(''),
  experience: Joi.number().min(0),
  specialty: Joi.array().items(Joi.string().valid('residential', 'commercial', 'luxury', 'rental', 'investment')),
  socialMedia: Joi.object({
    facebook: Joi.string().uri().allow(''),
    twitter: Joi.string().uri().allow(''),
    linkedin: Joi.string().uri().allow(''),
    instagram: Joi.string().uri().allow(''),
  }),
});