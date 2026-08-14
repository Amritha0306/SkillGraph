import { db } from '../db/neo4j';
import { recommendationQueries } from '../queries/recommendationQueries';
import { JobRecommendation, RelatedSkillBridge } from '../types';

export class RecommendationService {
  public async getRecommendations(options: {
    skills?: string[];
    userId?: string;
    limit?: number;
  }): Promise<{
    userSkills: string[];
    totalMatchedJobs: number;
    highestMatchPercentage: number;
    recommendations: JobRecommendation[];
  }> {
    let userSkills: string[] = options.skills || [];
    const limit = options.limit || 50;

    // If userId provided, fetch user skills from graph
    if (options.userId) {
      const userSkillRecords = await db.runQuery(recommendationQueries.getUserSkillsById, {
        userId: options.userId,
      });
      if (userSkillRecords.length && userSkillRecords[0].get('skillNames')) {
        userSkills = userSkillRecords[0].get('skillNames');
      }
    }

    // Clean & normalize user skills
    const sanitizedUserSkills = Array.from(
      new Set(userSkills.map((s) => s.trim()).filter((s) => s.length > 0))
    );

    if (sanitizedUserSkills.length === 0) {
      return {
        userSkills: [],
        totalMatchedJobs: 0,
        highestMatchPercentage: 0,
        recommendations: [],
      };
    }

    const userSkillsLower = sanitizedUserSkills.map((s) => s.toLowerCase());

    // 1. Run core parameterized recommendation Cypher query
    const records = await db.runQuery(recommendationQueries.getRecommendationsBySkills, {
      userSkillsLower,
      limit,
    });

    const recommendations: JobRecommendation[] = [];

    // 2. For each recommended job, fetch multi-hop related skill bridges and construct dynamic explanation
    for (const record of records) {
      const jobId = record.get('jobId');
      const companyId = record.get('companyId');
      const locationId = record.get('locationId');
      const allRequiredSkills: string[] = record.get('allRequiredSkills') || [];
      const matchedSkills: string[] = record.get('matchedSkills') || [];
      const missingSkills: string[] = record.get('missingSkills') || [];
      const matchPercentage: number = record.get('matchPercentage') || 0;

      // Multi-hop query: (UserSkill)-[:RELATED_TO]->(RelatedSkill)<-[:REQUIRES]-(Job)
      const bridgeRecords = await db.runQuery(
        recommendationQueries.getRelatedSkillBridgesForJob,
        {
          userSkillsLower,
          jobId,
        }
      );

      const relatedSkills: RelatedSkillBridge[] = bridgeRecords.map((br) => ({
        basedOnSkill: br.get('basedOnSkill'),
        relatedSkillName: br.get('relatedSkillName'),
        category: br.get('category'),
      }));

      // Construct authentic graph explanation
      const matchExplanation: string[] = [];
      matchExplanation.push(
        `You match ${matchedSkills.length} of ${allRequiredSkills.length} required skills for this role (${matchPercentage}% match).`
      );

      if (relatedSkills.length > 0) {
        relatedSkills.slice(0, 3).forEach((bridge) => {
          matchExplanation.push(
            `"${bridge.relatedSkillName}" is required for this role and closely connects to your known skill "${bridge.basedOnSkill}".`
          );
        });
      }

      if (missingSkills.length > 0 && relatedSkills.length === 0) {
        matchExplanation.push(
          `Closing the gap on "${missingSkills.slice(0, 2).join(', ')}" will boost your match to 100%.`
        );
      }

      recommendations.push({
        job: {
          id: jobId,
          title: record.get('jobTitle'),
          description: record.get('jobDescription'),
          employmentType: record.get('employmentType'),
          experienceLevel: record.get('experienceLevel'),
          salaryMin: record.get('salaryMin'),
          salaryMax: record.get('salaryMax'),
        },
        company: companyId
          ? {
              id: companyId,
              name: record.get('companyName'),
              industry: record.get('companyIndustry'),
              description: record.get('companyDescription'),
            }
          : null,
        location: locationId
          ? {
              id: locationId,
              city: record.get('locationCity'),
              country: record.get('locationCountry'),
            }
          : null,
        allRequiredSkills,
        totalRequiredSkills: allRequiredSkills.length,
        matchedSkills,
        missingSkills,
        matchPercentage,
        relatedSkills,
        matchExplanation,
      });
    }

    const highestMatchPercentage =
      recommendations.length > 0
        ? Math.max(...recommendations.map((r) => r.matchPercentage))
        : 0;

    return {
      userSkills: sanitizedUserSkills,
      totalMatchedJobs: recommendations.length,
      highestMatchPercentage,
      recommendations,
    };
  }
}

export const recommendationService = new RecommendationService();
