import { Router } from 'express';
import { heroController } from '../controllers/hero.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/herosection', heroController.getHero);
router.put('/herosection', authenticate, authorize('admin'), heroController.updateHero);

export default router;