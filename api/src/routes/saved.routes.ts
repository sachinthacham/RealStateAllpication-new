import express from 'express';
import userController from '../controllers/saved.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/saved/:propertyId', authenticate, userController.toggleSaved);
router.get('/saved', authenticate, userController.getSaved);

export default router;