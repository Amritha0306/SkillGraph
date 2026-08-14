import { db } from '../db/neo4j';
import { jobQueries } from '../queries/jobQueries';
import { Job, Company, Location, Skill, JobDetailResponse } from '../types';

export class JobService {
  public async getAllJobs(limit = 100): Promise<Array<{
    job: Job;
    company: Company | null;
    location: Location | null;
    requiredSkills: Skill[];
  }>> {
    const records = await db.runQuery(jobQueries.getAllJobs, { limit });
    return records.map((record) => {
      const companyId = record.get('companyId');
      const locationId = record.get('locationId');

      return {
        job: {
          id: record.get('id'),
          title: record.get('title'),
          description: record.get('description'),
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
        requiredSkills: record.get('requiredSkills') || [],
      };
    });
  }

  public async getJobById(jobId: string, userSkills: string[] = []): Promise<JobDetailResponse | null> {
    const records = await db.runQuery(jobQueries.getJobById, { jobId });
    if (!records.length) {
      return null;
    }

    const record = records[0];
    const companyId = record.get('companyId');
    const locationId = record.get('locationId');
    const requiredSkills: Skill[] = record.get('requiredSkills') || [];

    // Fetch related skill bridges for this job
    const relatedRecords = await db.runQuery(jobQueries.getRelatedSkillsForJob, { jobId });
    const relatedSkills = relatedRecords.map((r) => ({
      skillName: r.get('skillName'),
      category: r.get('category'),
      relatedTo: r.get('relatedTo'),
    }));

    // Build Connection Insight Subgraph
    const userSkillsLower = userSkills.map((s) => s.toLowerCase());
    const jobTitle = record.get('title');
    const companyName = record.get('companyName') || 'Company';
    const locationCity = record.get('locationCity') || 'Location';

    const matchedSkills = requiredSkills.filter((s) => userSkillsLower.includes(s.name.toLowerCase()));
    const missingSkills = requiredSkills.filter((s) => !userSkillsLower.includes(s.name.toLowerCase()));

    // Construct interactive graph nodes & links
    const nodes: Array<{ id: string; label: string; type: any }> = [];
    const links: Array<{ source: string; target: string; label: string }> = [];

    // Job Node
    nodes.push({ id: `job-${jobId}`, label: jobTitle, type: 'job' });

    // Company Node
    if (companyId) {
      nodes.push({ id: `comp-${companyId}`, label: companyName, type: 'company' });
      links.push({ source: `job-${jobId}`, target: `comp-${companyId}`, label: 'POSTED_BY' });
    }

    // Location Node
    if (locationId) {
      nodes.push({ id: `loc-${locationId}`, label: locationCity, type: 'location' });
      links.push({ source: `job-${jobId}`, target: `loc-${locationId}`, label: 'LOCATED_IN' });
    }

    // Required Skill Nodes
    requiredSkills.forEach((skill) => {
      const isMatched = userSkillsLower.includes(skill.name.toLowerCase());
      const nodeId = `skill-${skill.id}`;
      nodes.push({
        id: nodeId,
        label: skill.name,
        type: isMatched ? 'required_skill' : 'missing_skill',
      });
      links.push({ source: `job-${jobId}`, target: nodeId, label: 'REQUIRES' });
    });

    // User skills (if selected)
    userSkills.forEach((uSkill, idx) => {
      const uSkillNodeId = `user-skill-${idx}`;
      const isDirectMatch = requiredSkills.some((r) => r.name.toLowerCase() === uSkill.toLowerCase());
      if (!isDirectMatch) {
        // User skill that might relate to a required skill
        nodes.push({ id: uSkillNodeId, label: uSkill, type: 'user_skill' });
      }
    });

    // Build explanatory narrative
    const narrative: string[] = [];
    if (userSkills.length > 0) {
      narrative.push(
        `You match ${matchedSkills.length} of ${requiredSkills.length} required skills (${Math.round((matchedSkills.length / (requiredSkills.length || 1)) * 100)}% match).`
      );

      if (matchedSkills.length > 0) {
        narrative.push(`Direct skill matches: ${matchedSkills.map((s) => s.name).join(', ')}.`);
      }

      if (missingSkills.length > 0) {
        narrative.push(`Skills to acquire or highlight: ${missingSkills.map((s) => s.name).join(', ')}.`);
      }
    } else {
      narrative.push(`This position requires ${requiredSkills.length} key technical competencies.`);
    }

    return {
      job: {
        id: record.get('id'),
        title: jobTitle,
        description: record.get('description'),
        employmentType: record.get('employmentType'),
        experienceLevel: record.get('experienceLevel'),
        salaryMin: record.get('salaryMin'),
        salaryMax: record.get('salaryMax'),
      },
      company: companyId
        ? {
            id: companyId,
            name: companyName,
            industry: record.get('companyIndustry'),
            description: record.get('companyDescription'),
          }
        : null,
      location: locationId
        ? {
            id: locationId,
            city: locationCity,
            country: record.get('locationCountry'),
          }
        : null,
      requiredSkills,
      relatedSkills,
      connectionInsight: {
        nodes,
        links,
        narrative,
      },
    };
  }
}

export const jobService = new JobService();
