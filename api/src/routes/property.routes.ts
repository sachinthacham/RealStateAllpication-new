import express from "express";
import * as propertyController from "../controllers/property.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createPropertySchema, updatePropertySchema } from "../validations/property.validation";

const router = express.Router();

// Public routes
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);

// Protected routes
router.post("/", authenticate, authorize("seller", "admin"), validate(createPropertySchema), propertyController.createProperty);
router.put("/:id", authenticate, authorize("seller", "admin"), validate(updatePropertySchema), propertyController.updateProperty);
router.delete("/:id", authenticate, authorize("seller", "admin"), propertyController.deleteProperty);

export default router;
