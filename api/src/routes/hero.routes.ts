import { Router } from 'express';
import { heroController } from '../controllers/hero.controller';

const router = Router();

router.get('/herosection', heroController.getHero);
router.put('/herosection', heroController.updateHero);

export default router;