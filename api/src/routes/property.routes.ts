import { Router } from "express";
import * as propertyController from "../controllers/property.controller";
import { authenticate } from "../middlewares/authTokenOnly.middleware"; // assuming you have this

const router = Router();

router.post("/", authenticate, propertyController.createProperty);
router.get("/", propertyController.getProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", authenticate, propertyController.updateProperty);
router.delete("/:id", authenticate, propertyController.deleteProperty);

export default router;
