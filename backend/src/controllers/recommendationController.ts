import { Request, Response, NextFunction } from 'express';
import { recommendationService } from '../services/recommendationService';

export class RecommendationController {
  public async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { skills, userId, limit } = req.body;

      if ((!skills || !Array.isArray(skills) || skills.length === 0) && !userId) {
        res.status(400).json({
          success: false,
          error: 'Please provide an array of skills or a valid userId.',
        });
        return;
      }

      const result = await recommendationService.getRecommendations({
        skills: Array.isArray(skills) ? skills : [],
        userId: typeof userId === 'string' ? userId : undefined,
        limit: typeof limit === 'number' ? limit : 50,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const recommendationController = new RecommendationController();
