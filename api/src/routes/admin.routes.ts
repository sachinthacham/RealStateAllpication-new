import express from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authenticate, authorize("admin"));

// Admin-only routes for user management
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Admin-only routes for property management
router.get("/properties", adminController.getAllProperties);
router.delete("/properties/:id", adminController.deleteProperty);

export default router;
