import { Response, NextFunction } from 'express';
import userService from '../services/saved.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const toggleSaved = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { propertyId } = req.params;
    const result = await userService.toggleSavedProperty(req.user!._id, propertyId);
    
    res.status(200).json({
      success: true,
      message: result.isSaved ? 'Property saved to watchlist' : 'Property removed from watchlist',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Saved Controller
const getSaved = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const saved = await userService.getSavedProperties(req.user!._id);
    res.status(200).json({
      success: true,
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

export default {
  // ... existing exports
  toggleSaved,
  getSaved,
};