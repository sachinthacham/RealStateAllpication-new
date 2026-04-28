import { Router } from 'express';
import { AdvancedController } from '../controllers/advanced.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import {
  createThreadValidation,
  notificationPreferencesValidation,
} from '../validations/advanced.validation';

const router = Router();
const advancedController = new AdvancedController();

router.get('/notifications/preferences', authenticate, advancedController.getNotificationPreferences);
router.put(
  '/notifications/preferences',
  authenticate,
  validate(notificationPreferencesValidation),
  advancedController.updateNotificationPreferences
);

router.get('/chat/threads', authenticate, advancedController.listThreads);
router.post('/chat/threads', authenticate, validate(createThreadValidation), advancedController.createThread);
router.post('/chat/threads/:threadId/escalate', authenticate, advancedController.escalateThread);

router.get('/risk-flags', authenticate, authorize('admin'), advancedController.getRiskFlags);
router.post('/risk-flags/scan', authenticate, authorize('admin'), advancedController.runRiskScan);

router.get('/geo/recommendations', authenticate, advancedController.getGeoRecommendations);

export default router;
