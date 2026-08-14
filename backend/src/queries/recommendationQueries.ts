export const recommendationQueries = {
  /**
   * Core Recommendation Cypher Query:
   * Traverses Job -> REQUIRES -> Skill, Job -> POSTED_BY -> Company, Job -> LOCATED_IN -> Location
   * Computes matched skills, missing skills, and exact graph match percentage.
   */
  getRecommendationsBySkills: `
    MATCH (j:Job)-[:REQUIRES]->(req:Skill)
    OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(l:Location)
    WITH j, c, l, collect(DISTINCT req.name) AS allRequiredSkills
    WITH j, c, l, allRequiredSkills,
         [s IN allRequiredSkills WHERE toLower(s) IN $userSkillsLower] AS matchedSkills,
         [s IN allRequiredSkills WHERE NOT toLower(s) IN $userSkillsLower] AS missingSkills
    WHERE size(matchedSkills) > 0
    WITH j, c, l, allRequiredSkills, matchedSkills, missingSkills,
         round((toFloat(size(matchedSkills)) / toFloat(size(allRequiredSkills))) * 100.0) AS matchPercentage
    RETURN
      j.id AS jobId,
      j.title AS jobTitle,
      j.description AS jobDescription,
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
      allRequiredSkills,
      matchedSkills,
      missingSkills,
      matchPercentage
    ORDER BY matchPercentage DESC, size(matchedSkills) DESC, j.title ASC
    LIMIT $limit
  `,

  /**
   * Multi-Hop Traversal Query:
   * Finds related skills connecting user's known skills with the job's missing skills via [:RELATED_TO].
   * Traversal: (UserSkill:Skill)-[:RELATED_TO]-(BridgeSkill:Skill)<-[:REQUIRES]-(Job)
   */
  getRelatedSkillBridgesForJob: `
    MATCH (uSkill:Skill)
    WHERE toLower(uSkill.name) IN $userSkillsLower
    MATCH (uSkill)-[:RELATED_TO]-(relSkill:Skill)
    WHERE NOT toLower(relSkill.name) IN $userSkillsLower
    MATCH (j:Job {id: $jobId})-[:REQUIRES]->(relSkill)
    RETURN DISTINCT
      uSkill.name AS basedOnSkill,
      relSkill.name AS relatedSkillName,
      relSkill.category AS category
  `,

  /**
   * Get user skills by User ID for user-based recommendation
   */
  getUserSkillsById: `
    MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)
    RETURN collect(s.name) AS skillNames
  `,

  /**
   * Full Graph Topology Insight for a Job & User Skillset:
   * Returns graph nodes and relationships for visual interactive rendering
   */
  getConnectionInsightGraph: `
    MATCH (j:Job {id: $jobId})
    OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(l:Location)
    MATCH (j)-[:REQUIRES]->(req:Skill)
    OPTIONAL MATCH (req)-[:RELATED_TO]-(userRelated:Skill)
    WHERE toLower(userRelated.name) IN $userSkillsLower
    RETURN
      j.id AS jobId,
      j.title AS jobTitle,
      c.id AS companyId,
      c.name AS companyName,
      l.id AS locationId,
      l.city AS locationCity,
      collect(DISTINCT {
        id: req.id,
        name: req.name,
        category: req.category,
        isMatched: toLower(req.name) IN $userSkillsLower
      }) AS requiredSkillsData,
      collect(DISTINCT {
        userSkill: userRelated.name,
        requiredSkill: req.name
      }) AS relatedBridges
  `,
};
