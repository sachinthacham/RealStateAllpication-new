import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

// 1. Essential validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(5000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required().min(32),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// 2. Exported constants (Used in your Services & Middlewares)
export const NODE_ENV = envVars.NODE_ENV as string;
export const PORT = envVars.PORT as number;
export const MONGO_URI = envVars.MONGODB_URI as string;
export const JWT_SECRET = envVars.JWT_SECRET as string;
export const JWT_ACCESS_EXPIRY = envVars.JWT_ACCESS_EXPIRY as string;
export const JWT_REFRESH_EXPIRY = envVars.JWT_REFRESH_EXPIRY as string;
export const FRONTEND_URL = envVars.FRONTEND_URL as string;

// 3. Simplified config object for easy access
export const config = {
  isProduction: NODE_ENV === 'production',
  jwt: {
    secret: JWT_SECRET,
    accessExpiry: JWT_ACCESS_EXPIRY,
    refreshExpiry: JWT_REFRESH_EXPIRY,
  },
};