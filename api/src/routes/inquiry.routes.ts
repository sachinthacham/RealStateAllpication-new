import { Router } from 'express';
import { InquiryController } from '../controllers/inquiry.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { createInquiryValidation, updateInquiryStatusValidation } from '../validations/inquiry.validation';

const router = Router();
const inquiryController = new InquiryController();

router.post('/', authenticate, validate(createInquiryValidation), inquiryController.createInquiry);
router.get('/me', authenticate, inquiryController.getMyInquiries);
router.get('/assigned', authenticate, authorize('agent', 'admin'), inquiryController.getAssignedInquiries);
router.patch(
  '/:id/status',
  authenticate,
  authorize('agent', 'admin'),
  validate(updateInquiryStatusValidation),
  inquiryController.updateInquiryStatus
);

export default router;
