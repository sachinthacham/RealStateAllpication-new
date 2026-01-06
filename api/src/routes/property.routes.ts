import { Router } from "express";
import { PropertyController } from "../controllers/property.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import {
  createPropertyValidation,
  updatePropertyValidation,
  propertyQueryValidation,
} from "../validations/property.validation";
import upload from '../middlewares/upload.middleware'; // 👈 IMPORT YOUR MULTER CONFIG

const router = Router();
const propertyController = new PropertyController();

/**
 * PUBLIC ROUTES
 */

// Important: Specific routes must come BEFORE parameterized routes (/:id)
router.get(
  "/nearby/search",
  propertyController.getNearbyProperties // Arrow functions in controller handle "this"
);

router.get(
  "/",
  validate(propertyQueryValidation),
  propertyController.getProperties
);

router.get(
  "/agent/:agentId",
  validate(propertyQueryValidation),
  propertyController.getPropertiesByAgent
);

router.get(
  "/:id", 
  propertyController.getPropertyById
);

/**
 * PROTECTED ROUTES (Require Login)
 */

router.post(
  '/', 
  authenticate,          // 1. Check if user is logged in
  upload.array('images'), // 2. ✅ CRITICAL: Parse the Multipart Data (Files + Body)
  //validate(createPropertyValidation), // 3. (Optional) Validate body AFTER Multer parses it
  propertyController.createProperty // 4. Finally, run the controller
);

router.put(
  "/:id",
  authenticate,
  validate(updatePropertyValidation),
  propertyController.updateProperty
);

router.delete(
  "/:id",
  authenticate,
  propertyController.deleteProperty
);

export default router;