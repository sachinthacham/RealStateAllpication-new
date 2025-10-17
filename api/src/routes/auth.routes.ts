import { Router } from "express";
import * as ctrl from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation";

const router = Router();

router.post("/signup", validate(signupSchema), ctrl.signup);
router.post("/signin", validate(signinSchema), ctrl.signin);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  ctrl.forgotPassword
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  ctrl.resetPassword
);

export default router;
