// src/controllers/wishlist.controller.ts
import { Request, Response } from "express";
import * as wishlistService from "../services/wishList.service";

export const addWishlist = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { propertyId } = req.body;

  const wishlist = await wishlistService.addToWishlist(userId, propertyId);
  res.status(200).json({ message: "Added to wishlist", wishlist });
};

export const removeWishlist = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const propertyId = req.params.propertyId;

  const wishlist = await wishlistService.removeFromWishlist(userId, propertyId);
  res.status(200).json({ message: "Removed from wishlist", wishlist });
};

export const viewWishlist = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const wishlist = await wishlistService.getWishlist(userId);
  res.status(200).json({ wishlist });
};
