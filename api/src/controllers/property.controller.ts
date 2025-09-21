import type { Request, Response, NextFunction } from "express";
import * as propertyService from "../services/property.service.js";
import { BadRequestError } from "../utils/errors.js";

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = (req as any).user.id;
    const property = await propertyService.createProperty(ownerId, req.body);
    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

export const getAllProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.query;
    const properties = await propertyService.getAllProperties(filters);
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.id;
    if (!propertyId) throw new BadRequestError("Property ID is required");
    const property = await propertyService.getPropertyById(propertyId);
    res.json(property);
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.id;
    if (!propertyId) throw new BadRequestError("Property ID is required");
    const property = await propertyService.updateProperty(propertyId, req.body);
    res.json(property);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.id;
    if (!propertyId) throw new BadRequestError("Property ID is required");
    await propertyService.deleteProperty(propertyId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
