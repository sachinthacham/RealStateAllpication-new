import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { PORT, MONGO_URI, NODE_ENV, FRONTEND_URL } from './config';
import logger from './utils/logger';
import path from 'path';

const app = express();

/**
 * DATABASE CONNECTION
 * Industry standard: Connect before starting the server to ensure 
 * the app doesn't accept requests without a working DB.
 */
mongoose.set('strictQuery', true); // Prepare for Mongoose 7/8
mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1); // Exit if DB connection fails
  });

/**
 * MIDDLEWARES
 */
// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logging (Morgan + Winston)
const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { 
  stream: { write: (message) => logger.info(message.trim()) } 
}));

// Body Parsers
app.use(express.json({ limit: '10kb' })); // Limit body size for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * HEALTH CHECK
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    env: NODE_ENV
  });
});

/**
 * API ROUTES
 */
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
/**
 * upload files
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
/**
 * 404 HANDLER
 */
app.all(/(.*)/, (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

/**
 * GLOBAL ERROR HANDLER
 * Catches all next(error) calls from controllers
 */
app.use(errorHandler);

/**
 * SERVER STARTUP
 */
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
});

/**
 * GRACEFUL SHUTDOWN
 * Industry standard: Close connections properly when the process is killed
 */
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
    mongoose.connection.close(false);
  });
});

export default app;