import express from "express";
import * as userController from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema, changeRoleSchema } from "../validations/user.validation";

const router = express.Router();

// All routes protected
router.use(authenticate);

// User profile
router.get("/me", userController.getProfile);
router.put("/me", validate(updateProfileSchema), userController.updateProfile);

// Admin-only routes
router.get("/", authorize("admin"), userController.getAllUsers);
router.delete("/:id", authorize("admin"), userController.deleteUser);
// Optional: change user role
router.put("/:id/role", authorize("admin"), validate(changeRoleSchema), async (req, res) => {
  res.send("Change role - implement in userController");
});

export default router;
