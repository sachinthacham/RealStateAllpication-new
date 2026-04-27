import { Router } from 'express';
import { VisitController } from '../controllers/visit.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { createVisitValidation, updateVisitStatusValidation } from '../validations/visit.validation';

const router = Router();
const visitController = new VisitController();

router.post('/', authenticate, validate(createVisitValidation), visitController.createVisit);
router.get('/me', authenticate, visitController.getMyVisits);
router.get('/assigned', authenticate, authorize('agent', 'admin'), visitController.getAssignedVisits);
router.patch(
  '/:id/status',
  authenticate,
  validate(updateVisitStatusValidation),
  visitController.updateVisitStatus
);

export default router;
