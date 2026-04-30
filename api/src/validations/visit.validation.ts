import Joi from 'joi';

export const createVisitValidation = Joi.object({
  propertyId: Joi.string().hex().length(24).required(),
  requestedStartAt: Joi.date().iso().required(),
  requestedEndAt: Joi.date().iso().greater(Joi.ref('requestedStartAt')).required(),
  requesterNote: Joi.string().max(1200).allow('').optional(),
});

export const updateVisitStatusValidation = Joi.object({
  status: Joi.string()
    .valid('accepted', 'rejected', 'rescheduled', 'completed', 'cancelled')
    .required(),
  scheduledStartAt: Joi.date().iso().optional(),
  scheduledEndAt: Joi.date().iso().greater(Joi.ref('scheduledStartAt')).optional(),
  agentNote: Joi.string().max(1200).allow('').optional(),
  decisionReason: Joi.string().max(800).allow('').optional(),
}).custom((value, helpers) => {
  if (value.status === 'rescheduled' && (!value.scheduledStartAt || !value.scheduledEndAt)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Reschedule validation');
