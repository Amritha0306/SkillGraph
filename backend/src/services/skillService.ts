import { db } from '../db/neo4j';
import { skillQueries } from '../queries/skillQueries';
import { Skill, SkillCategoryGroup } from '../types';

export class SkillService {
  public async getAllSkills(): Promise<Skill[]> {
    const records = await db.runQuery(skillQueries.getAllSkills);
    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      category: record.get('category'),
    }));
  }

  public async getGroupedSkills(): Promise<SkillCategoryGroup[]> {
    const records = await db.runQuery(skillQueries.getSkillsGroupedByCategory);
    return records.map((record) => ({
      category: record.get('category'),
      skills: record.get('skills'),
    }));
  }

  public async searchSkills(query: string): Promise<Skill[]> {
    const records = await db.runQuery(skillQueries.searchSkills, { query });
    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      category: record.get('category'),
    }));
  }

  public async getRelatedSkillsByName(skillName: string): Promise<Array<{
    id: string;
    name: string;
    category: string;
    relatedTo: string;
  }>> {
    const records = await db.runQuery(skillQueries.getRelatedSkillsByName, { skillName });
    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      category: record.get('category'),
      relatedTo: record.get('relatedTo'),
    }));
  }
}

export const skillService = new SkillService();
