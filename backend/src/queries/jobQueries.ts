export const jobQueries = {
  /**
   * Get all jobs with their company, location, and required skills
   */
  getAllJobs: `
    MATCH (j:Job)
    OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(l:Location)
    OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
    WITH j, c, l, collect(DISTINCT { id: s.id, name: s.name, category: s.category }) AS requiredSkills
    RETURN
      j.id AS id,
      j.title AS title,
      j.description AS description,
      j.employmentType AS employmentType,
      j.experienceLevel AS experienceLevel,
      j.salaryMin AS salaryMin,
      j.salaryMax AS salaryMax,
      c.id AS companyId,
      c.name AS companyName,
      c.industry AS companyIndustry,
      c.description AS companyDescription,
      l.id AS locationId,
      l.city AS locationCity,
      l.country AS locationCountry,
      requiredSkills
    ORDER BY j.title ASC
    LIMIT $limit
  `,

  /**
   * Get complete single job detail including company, location, required skills,
   * and related skill bridges
   */
  getJobById: `
    MATCH (j:Job {id: $jobId})
    OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(l:Location)
    OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
    WITH j, c, l, collect(DISTINCT { id: s.id, name: s.name, category: s.category }) AS requiredSkills
    RETURN
      j.id AS id,
      j.title AS title,
      j.description AS description,
      j.employmentType AS employmentType,
      j.experienceLevel AS experienceLevel,
      j.salaryMin AS salaryMin,
      j.salaryMax AS salaryMax,
      c.id AS companyId,
      c.name AS companyName,
      c.industry AS companyIndustry,
      c.description AS companyDescription,
      l.id AS locationId,
      l.city AS locationCity,
      l.country AS locationCountry,
      requiredSkills
  `,

  /**
   * Multi-hop query: Find related skills for a specific job's missing requirements
   */
  getRelatedSkillsForJob: `
    MATCH (j:Job {id: $jobId})-[:REQUIRES]->(req:Skill)
    MATCH (req)-[:RELATED_TO]-(rel:Skill)
    WHERE NOT (j)-[:REQUIRES]->(rel)
    RETURN DISTINCT
      rel.name AS skillName,
      rel.category AS category,
      req.name AS relatedTo
    LIMIT 10
  `,
};
