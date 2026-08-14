import { Request, Response, NextFunction } from 'express';
import { skillService } from '../services/skillService';

export class SkillController {
  public async getAllSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { grouped, search } = req.query;

      if (typeof search === 'string' && search.trim()) {
        const skills = await skillService.searchSkills(search.trim());
        res.json({ success: true, count: skills.length, data: skills });
        return;
      }

      if (grouped === 'true') {
        const groups = await skillService.getGroupedSkills();
        res.json({ success: true, count: groups.length, data: groups });
        return;
      }

      const skills = await skillService.getAllSkills();
      res.json({ success: true, count: skills.length, data: skills });
    } catch (error) {
      next(error);
    }
  }

  public async getRelatedSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(400).json({ success: false, error: 'Skill name is required.' });
        return;
      }

      const relatedSkills = await skillService.getRelatedSkillsByName(name);
      res.json({
        success: true,
        skill: name,
        count: relatedSkills.length,
        data: relatedSkills,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const skillController = new SkillController();
