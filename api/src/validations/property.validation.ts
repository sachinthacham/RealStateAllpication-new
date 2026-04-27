import Joi from 'joi';

export const createPropertyValidation = Joi.object({
  title: Joi.string().required().min(5).max(200),
  description: Joi.string().required().min(10).max(5000),
  type: Joi.string().valid('house', 'apartment', 'condo', 'land', 'commercial').required(),
  status: Joi.string().valid('for_sale', 'for_rent', 'sold', 'rented').default('for_sale'),
  price: Joi.number().required().min(0),
  bedrooms: Joi.number().min(0).default(0),
  bathrooms: Joi.number().min(0).default(0),
  area: Joi.number().required().min(0),
  yearBuilt: Joi.number().min(1800).max(new Date().getFullYear()),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
  amenities: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string().uri()),
});

export const updatePropertyValidation = Joi.object({
  title: Joi.string().min(5).max(200),
  description: Joi.string().min(10).max(5000),
  type: Joi.string().valid('house', 'apartment', 'condo', 'land', 'commercial'),
  status: Joi.string().valid('for_sale', 'for_rent', 'sold', 'rented'),
  price: Joi.number().min(0),
  bedrooms: Joi.number().min(0),
  bathrooms: Joi.number().min(0),
  area: Joi.number().min(0),
  yearBuilt: Joi.number().min(1800).max(new Date().getFullYear()),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string(),
  }),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
  amenities: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string().uri()),
});

export const propertyQueryValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  type: Joi.string().valid('house', 'apartment', 'condo', 'land', 'commercial'),
  status: Joi.string().valid('for_sale', 'for_rent', 'sold', 'rented'),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  bedrooms: Joi.number().min(0),
  bathrooms: Joi.number().min(0),
  city: Joi.string(),
  state: Joi.string(),
  search: Joi.string(),
  sortBy: Joi.string().valid('price', 'createdAt', 'area', 'bedrooms', 'bathrooms'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});