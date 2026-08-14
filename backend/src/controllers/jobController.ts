import { Request, Response, NextFunction } from 'express';
import { jobService } from '../services/jobService';

export class JobController {
  public async getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const jobs = await jobService.getAllJobs(limit);
      res.json({
        success: true,
        count: jobs.length,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userSkills = req.query.userSkills
        ? (req.query.userSkills as string).split(',').map((s) => s.trim())
        : [];

      const jobDetail = await jobService.getJobById(id, userSkills);
      if (!jobDetail) {
        res.status(404).json({
          success: false,
          error: `Job with ID '${id}' was not found.`,
        });
        return;
      }

      res.json({
        success: true,
        data: jobDetail,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const jobController = new JobController();
