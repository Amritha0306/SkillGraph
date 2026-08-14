import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export class UserController {
  public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: `User with ID '${id}' was not found.`,
        });
        return;
      }
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public async addUserSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { skills } = req.body;

      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Please provide an array of skills to add.',
        });
        return;
      }

      const updated = await userService.addUserSkills(id, skills);
      res.json({
        success: true,
        message: `Updated skills for user ${id}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
