import { NextFunction, Request, Response } from 'express';
import { CommunicationService } from '../services/communication.service';

const communicationService = new CommunicationService();

export class CommunicationController {
  dispatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await communicationService.dispatch(req.body);
      res.status(202).json({
        success: true,
        message: 'Communication accepted for processing',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  whatsappLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const link = communicationService.generateWhatsappLink(req.body.phone, req.body.text);
      res.status(200).json({
        success: true,
        data: { link },
      });
    } catch (error) {
      next(error);
    }
  };
}
