import express from 'express';
import userController from '../controllers/Favourite.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Toggle Favorite (POST /api/users/favorites/:propertyId)
router.post('/favorites/:propertyId', authenticate, userController.toggleFavorite);

// Get All Favorites (GET /api/users/favorites)
router.get('/favorites', authenticate, userController.getFavorites);

export default router;