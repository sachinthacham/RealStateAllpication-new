import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import {
  createReportValidation,
  moderatePropertyValidation,
  updateReportStatusValidation,
  updateUserStatusValidation,
} from '../validations/admin.validation';

const router = Router();
const adminController = new AdminController();

router.post('/reports', authenticate, validate(createReportValidation), adminController.createReport);
router.get('/reports', authenticate, authorize('admin'), adminController.listReports);
router.patch(
  '/reports/:id/status',
  authenticate,
  authorize('admin'),
  validate(updateReportStatusValidation),
  adminController.updateReportStatus
);
router.get('/dashboard/summary', authenticate, authorize('admin'), adminController.getDashboardSummary);
router.get('/users', authenticate, authorize('admin'), adminController.listUsers);
router.patch(
  '/users/:userId/status',
  authenticate,
  authorize('admin'),
  validate(updateUserStatusValidation),
  adminController.updateUserStatus
);
router.get('/properties', authenticate, authorize('admin'), adminController.listProperties);
router.patch(
  '/properties/:propertyId/moderate',
  authenticate,
  authorize('admin'),
  validate(moderatePropertyValidation),
  adminController.moderateProperty
);

export default router;
