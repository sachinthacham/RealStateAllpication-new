// src/routes/wishlist.routes.ts
import express from "express";
import * as wishlistController from "../controllers/wishList.controller";
import { authenticate } from "../middlewares/authWithUserCheck.middleware"; // optional auth

const router = express.Router();

router.post("/:id/wishlist", authenticate, wishlistController.addWishlist);
router.delete("/:id/wishlist/:propertyId", authenticate, wishlistController.removeWishlist);
router.get("/:id/wishlist", authenticate, wishlistController.viewWishlist);

export default router;
