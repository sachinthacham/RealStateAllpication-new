import { Router } from 'express';
import { SavedSearchController } from '../controllers/savedSearch.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import {
  createSavedSearchValidation,
  updateSavedSearchValidation,
} from '../validations/savedSearch.validation';

const router = Router();
const savedSearchController = new SavedSearchController();

router.post('/', authenticate, validate(createSavedSearchValidation), savedSearchController.createSavedSearch);
router.get('/', authenticate, savedSearchController.listSavedSearches);
router.put('/:id', authenticate, validate(updateSavedSearchValidation), savedSearchController.updateSavedSearch);
router.delete('/:id', authenticate, savedSearchController.deleteSavedSearch);
router.post('/:id/run', authenticate, savedSearchController.runSavedSearch);

export default router;
