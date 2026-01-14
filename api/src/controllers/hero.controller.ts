import { Request, Response } from 'express';
import { heroService } from '../services/hero.service';
import { updateHeroSchema, UpdateHeroInput } from '../validations/hero.validation';

class HeroController {
  
  // GET /api/hero (No changes here)
  public getHero = async (req: Request, res: Response): Promise<Response> => {
    try {
      const hero = await heroService.getHeroSection();

      if (!hero) {
        return res.status(200).json({
          title: "Welcome to RealEstate",
          description: "Find your dream home today.",
          imageUrl: "",
          isActive: true,
        });
      }

      return res.status(200).json(hero);
    } catch (error: any) {
      return res.status(500).json({ 
        message: "Error fetching hero data", 
        error: error.message 
      });
    }
  };

  // PUT /api/hero (Updated for Joi)
  public updateHero = async (req: Request, res: Response): Promise<Response> => {
    try {
      // 1. Validate Input with Joi
      // abortEarly: false ensures we collect ALL errors, not just the first one
      const { error, value } = updateHeroSchema.validate(req.body, { abortEarly: false });

      if (error) {
        // Joi returns details in error.details array
        const errorMessages = error.details.map((detail) => detail.message);
        
        return res.status(400).json({
          message: "Validation Error",
          errors: errorMessages,
        });
      }

      // 2. Call Service with the validated 'value'
      // We cast 'value' to UpdateHeroInput for TypeScript safety
      const updatedHero = await heroService.updateHeroSection(value as UpdateHeroInput);

      return res.status(200).json({
        message: "Hero section updated successfully",
        data: updatedHero,
      });

    } catch (error: any) {
      return res.status(500).json({ 
        message: "Error updating hero data", 
        error: error.message 
      });
    }
  };
}

export const heroController = new HeroController();