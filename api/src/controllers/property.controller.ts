import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { IPropertyResponse } from '../interfaces/IProperty';


const propertyService = new PropertyService();

export class PropertyController {
  
  createProperty = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // 1. Parse JSON fields (Handle "Stringified" Objects)
      let address = req.body.address;
      let location = req.body.location;
      let amenities = req.body.amenities;

      try {
        if (typeof address === 'string') address = JSON.parse(address);
        if (typeof location === 'string') location = JSON.parse(location);
        if (typeof amenities === 'string') amenities = JSON.parse(amenities);
      } catch (e) {
        res.status(400).json({ success: false, message: "Invalid JSON format in address/location" });
        return; 
      }

      // 2. Extract Images
      const files = (req.files as Express.Multer.File[]) || [];
      const imageUrls = files.map(file => file.path); 

      // 3. ✅ FIX: Manually convert Numbers
      const propertyData = {
        ...req.body, // Spread first to get strings like title, description...
        
        // OVERWRITE the number fields by converting them
        price: Number(req.body.price),
        bedrooms: Number(req.body.bedrooms),
        bathrooms: Number(req.body.bathrooms),
        area: Number(req.body.area),
        // Handle optional number fields carefully
        yearBuilt: req.body.yearBuilt ? Number(req.body.yearBuilt) : undefined,

        // Add the parsed objects
        address: address,
        location: location,
        amenities: amenities,
        images: imageUrls,
        agent: req.user._id,
        createdBy: req.user._id,
      };

      const property = await propertyService.createProperty(propertyData);

      const response: IPropertyResponse = {
        success: true,
        message: 'Property created successfully',
        data: property,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Create Property Error:", error); // Helpful for debugging
      next(error);
    }
};

  /**
   * Get all properties with filters and pagination
   */
  getProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Pass the entire query object to the service
      const result = await propertyService.getProperties(req.query);
  
      const response: IPropertyResponse = {
        success: true,
        data: result.properties,
        pagination: {
          page: result.page,
          limit: req.query.limit ? Number(req.query.limit) : 10,
          total: result.total,
          totalPages: result.totalPages,
        },
      };
  
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a single property by ID
   */
  getPropertyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const property = await propertyService.getPropertyById(req.params.id);

      res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update property details
   * Standard: Business logic for ownership is handled in the Service
   */
  updateProperty = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const updatedProperty = await propertyService.updateProperty(
        req.params.id,
        req.body,
        req.user._id.toString(),
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        data: updatedProperty,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a property
   */
  deleteProperty = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      await propertyService.deleteProperty(
        req.params.id,
        req.user._id.toString(),
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: 'Property deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get properties by a specific Agent ID
   */
  getPropertiesByAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agentId } = req.params;
      const result = await propertyService.getPropertiesByAgent(agentId, req.query as any);

      res.status(200).json({
        success: true,
        data: result.properties,
        pagination: {
          page: result.page,
          limit: req.query.limit ? Number(req.query.limit) : 10,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Geospatial search for nearby properties
   */
  getNearbyProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { lng, lat, dist } = req.query;

      if (!lng || !lat) {
        res.status(400).json({
          success: false,
          message: 'Longitude and latitude are required',
        });
        return;
      }

      const properties = await propertyService.getNearbyProperties(
        Number(lng),
        Number(lat),
        dist ? Number(dist) : 10000 // Default 10km
      );

      res.status(200).json({
        success: true,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  };
}