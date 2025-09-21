import { Router } from "express";
import {
  signup,
  signin,
  googleSignIn,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  signupSchema,
  signinSchema,
  googleAuthSchema,
} from "../validations/auth.schema.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(signinSchema), signin);
router.post("/google", validate(googleAuthSchema), googleSignIn);

export default router;
