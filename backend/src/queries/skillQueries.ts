export const skillQueries = {
  /**
   * Fetch all skills ordered by category and name
   */
  getAllSkills: `
    MATCH (s:Skill)
    RETURN s.id AS id, s.name AS name, s.category AS category
    ORDER BY s.category ASC, s.name ASC
  `,

  /**
   * Search skills by name prefix or substring
   */
  searchSkills: `
    MATCH (s:Skill)
    WHERE toLower(s.name) CONTAINS toLower($query)
    RETURN s.id AS id, s.name AS name, s.category AS category
    ORDER BY s.name ASC
    LIMIT 20
  `,

  /**
   * Find 1-hop and 2-hop related skills for a given skill
   */
  getRelatedSkillsByName: `
    MATCH (s:Skill)
    WHERE toLower(s.name) = toLower($skillName)
    MATCH (s)-[:RELATED_TO]-(related:Skill)
    RETURN DISTINCT
      related.id AS id,
      related.name AS name,
      related.category AS category,
      s.name AS relatedTo
    ORDER BY related.name ASC
  `,

  /**
   * Get all skills grouped by category
   */
  getSkillsGroupedByCategory: `
    MATCH (s:Skill)
    WITH s.category AS category, collect({ id: s.id, name: s.name, category: s.category }) AS skills
    RETURN category, skills
    ORDER BY category ASC
  `,
};
