import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import favouriteRoutes from './routes/Favourites.routes';
import savedproperties from './routes/saved.routes';
import paymentroutes from './routes/payment.routes'; 
import { errorHandler } from './middlewares/errorHandler.middleware';
import { PORT, MONGO_URI, NODE_ENV, FRONTEND_URL } from './config';
import logger from './utils/logger';
import path from 'path';

const app = express();

/**
 * DATABASE CONNECTION
 */
mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI)
  .then(() => logger.info('Successfully connected to MongoDB.'))
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

/**
 * MIDDLEWARES
 */
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { 
  stream: { write: (message) => logger.info(message.trim()) } 
}));

// We must skip JSON parsing for the webhook route so the raw stream 
// is available for signature verification later in the router.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next(); // Skip JSON parsing for this specific route
  } else {
    express.json({ limit: '10kb' })(req, res, next); // Parse JSON for everything else
  }
});

app.use(express.urlencoded({ extended: true, limit: '10kb' }));


/**
 * API ROUTES
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', favouriteRoutes);
app.use('/api/saved', savedproperties);
app.use('/api/payment', paymentroutes);// The router file itself handles the /webhook and /create-checkout-session sub-paths.
 

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 Handler
app.all(/(.*)/, (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Can't find ${req.originalUrl} on this server!` });
});

// Global Error Handler
app.use(errorHandler);

// Server Startup
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
    mongoose.connection.close(false);
  });
});

export default app;