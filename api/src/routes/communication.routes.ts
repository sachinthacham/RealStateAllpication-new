import { Router } from 'express';
import { CommunicationController } from '../controllers/communication.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import {
  dispatchCommunicationValidation,
  whatsappLinkValidation,
} from '../validations/communication.validation';

const router = Router();
const communicationController = new CommunicationController();

router.post('/dispatch', authenticate, validate(dispatchCommunicationValidation), communicationController.dispatch);
router.post('/whatsapp-link', authenticate, validate(whatsappLinkValidation), communicationController.whatsappLink);

export default router;
