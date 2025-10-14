import express from "express";
import {
  createVisit,
  getMyVisits,
  confirmVisit,
  cancelVisit,
  completeVisit,
} from "../controllers/visit.controller";
import { authenticate } from "../middlewares/authTokenOnly.middleware";

const router = express.Router();

router.post("/", authenticate, createVisit); // buyer requests a visit
router.get("/", authenticate, getMyVisits); // buyer views all visit requests
router.patch("/:id/confirm", authenticate, confirmVisit); // admin/seller confirms
router.patch("/:id/cancel", authenticate, cancelVisit); // buyer cancels
router.patch("/:id/complete", authenticate, completeVisit); // mark as completed

export default router;
