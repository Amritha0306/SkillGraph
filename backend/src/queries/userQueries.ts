export const userQueries = {
  /**
   * Get all demo users with their skills
   */
  getAllUsers: `
    MATCH (u:User)
    OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
    WITH u, collect(DISTINCT { id: s.id, name: s.name, category: s.category }) AS skills
    RETURN
      u.id AS id,
      u.name AS name,
      u.email AS email,
      skills
    ORDER BY u.name ASC
  `,

  /**
   * Get user by ID with their skills
   */
  getUserById: `
    MATCH (u:User {id: $userId})
    OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
    WITH u, collect(DISTINCT { id: s.id, name: s.name, category: s.category }) AS skills
    RETURN
      u.id AS id,
      u.name AS name,
      u.email AS email,
      skills
  `,

  /**
   * Add skills to a user profile
   */
  addUserSkills: `
    MATCH (u:User {id: $userId})
    UNWIND $skillNames AS skillName
    MATCH (s:Skill) WHERE toLower(s.name) = toLower(skillName)
    MERGE (u)-[:HAS_SKILL]->(s)
    RETURN u.id AS userId, collect(s.name) AS attachedSkills
  `,
};
