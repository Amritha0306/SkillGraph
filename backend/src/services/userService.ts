import { db } from '../db/neo4j';
import { userQueries } from '../queries/userQueries';
import { UserProfile } from '../types';

export class UserService {
  public async getAllUsers(): Promise<UserProfile[]> {
    const records = await db.runQuery(userQueries.getAllUsers);
    return records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      email: record.get('email'),
      skills: record.get('skills') || [],
    }));
  }

  public async getUserById(userId: string): Promise<UserProfile | null> {
    const records = await db.runQuery(userQueries.getUserById, { userId });
    if (!records.length) {
      return null;
    }
    const record = records[0];
    return {
      id: record.get('id'),
      name: record.get('name'),
      email: record.get('email'),
      skills: record.get('skills') || [],
    };
  }

  public async addUserSkills(userId: string, skillNames: string[]): Promise<string[]> {
    const records = await db.runQuery(userQueries.addUserSkills, {
      userId,
      skillNames,
    });
    if (!records.length) {
      return [];
    }
    return records[0].get('attachedSkills') || [];
  }
}

export const userService = new UserService();
