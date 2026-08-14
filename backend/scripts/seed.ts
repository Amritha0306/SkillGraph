import { db } from '../src/db/neo4j';
import {
  locations,
  skills,
  companies,
  users,
  jobs,
  skillRelations,
} from './seedData';

async function seed() {
  console.log('====================================================');
  console.log('🌱 Starting SkillGraph CognoDB Database Seeding');
  console.log('====================================================');

  const startTimestamp = Date.now();

  try {
    // 1. Verify Connectivity
    console.log('\n[1/6] Verifying connection to CognoDB Cloud...');
    const health = await db.verifyConnectivity();
    if (!health.connected) {
      throw new Error(`Cannot connect to database: ${health.message}`);
    }
    console.log(` Connected: ${health.message}`);

    // 2. Clear Existing Data Safely
    console.log('\n[2/6] Cleaning existing graph entities...');
    await db.runQuery(`
      MATCH (n)
      WHERE n:User OR n:Skill OR n:Job OR n:Company OR n:Location
      DETACH DELETE n
    `);
    console.log(' Cleared previous SkillGraph nodes and relationships.');

    // 3. Batched Seeding of Locations, Skills, and Skill Relations
    console.log('\n[3/6] Seeding Locations and Skills in batch...');
    
    // Batch Locations
    await db.runQuery(`
      UNWIND $batch AS loc
      MERGE (l:Location {id: loc.id})
      SET l.city = loc.city,
          l.country = loc.country
    `, { batch: locations });
    console.log(` Created ${locations.length} locations`);

    // Batch Skills
    await db.runQuery(`
      UNWIND $batch AS skill
      MERGE (s:Skill {id: skill.id})
      SET s.name = skill.name,
          s.category = skill.category
    `, { batch: skills });
    console.log(` Created ${skills.length} skills`);

    // Batch Bidirectional RELATED_TO relationships
    await db.runQuery(`
      UNWIND $batch AS rel
      MATCH (s1:Skill {id: rel.fromSkillId})
      MATCH (s2:Skill {id: rel.toSkillId})
      MERGE (s1)-[:RELATED_TO]->(s2)
      MERGE (s2)-[:RELATED_TO]->(s1)
    `, { batch: skillRelations });
    console.log(` Created ${skillRelations.length * 2} RELATED_TO skill relationships`);

    // 4. Batch Seeding of Companies & LOCATED_IN links
    console.log('\n[4/6] Seeding Companies...');
    await db.runQuery(`
      UNWIND $batch AS comp
      MERGE (c:Company {id: comp.id})
      SET c.name = comp.name,
          c.industry = comp.industry,
          c.description = comp.description
      WITH c, comp
      MATCH (l:Location {id: comp.locationId})
      MERGE (c)-[:LOCATED_IN]->(l)
    `, { batch: companies });
    console.log(` Created ${companies.length} companies and LOCATED_IN links`);

    // 5. Batch Seeding of Users & HAS_SKILL links
    console.log('\n[5/6] Seeding Users and Skills mappings...');
    const userSkillsFlattened: Array<{ userId: string; skillId: string }> = [];
    users.forEach((u) => {
      u.skillIds.forEach((sId) => {
        userSkillsFlattened.push({ userId: u.id, skillId: sId });
      });
    });

    await db.runQuery(`
      UNWIND $batch AS usr
      MERGE (u:User {id: usr.id})
      SET u.name = usr.name,
          u.email = usr.email
    `, { batch: users.map((u) => ({ id: u.id, name: u.name, email: u.email })) });

    await db.runQuery(`
      UNWIND $batch AS link
      MATCH (u:User {id: link.userId})
      MATCH (s:Skill {id: link.skillId})
      MERGE (u)-[:HAS_SKILL]->(s)
    `, { batch: userSkillsFlattened });
    console.log(` Created ${users.length} users and ${userSkillsFlattened.length} HAS_SKILL relationships`);

    // 6. Batch Seeding of Jobs, Companies, Locations & REQUIRES links
    console.log('\n[6/6] Seeding Jobs, POSTED_BY, LOCATED_IN, and REQUIRES relationships...');
    const jobSkillsFlattened: Array<{ jobId: string; skillId: string }> = [];
    const jobNodesData = jobs.map((j) => {
      j.requiredSkillIds.forEach((sId) => {
        jobSkillsFlattened.push({ jobId: j.id, skillId: sId });
      });
      return {
        id: j.id,
        title: j.title,
        description: j.description,
        employmentType: j.employmentType,
        experienceLevel: j.experienceLevel,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        companyId: j.companyId,
        locationId: j.locationId,
      };
    });

    // Create Job nodes and link to Company & Location in batch
    await db.runQuery(`
      UNWIND $batch AS j
      MERGE (job:Job {id: j.id})
      SET job.title = j.title,
          job.description = j.description,
          job.employmentType = j.employmentType,
          job.experienceLevel = j.experienceLevel,
          job.salaryMin = j.salaryMin,
          job.salaryMax = j.salaryMax
      WITH job, j
      MATCH (c:Company {id: j.companyId})
      MERGE (job)-[:POSTED_BY]->(c)
      WITH job, j
      MATCH (l:Location {id: j.locationId})
      MERGE (job)-[:LOCATED_IN]->(l)
    `, { batch: jobNodesData });

    // Link Job to required Skills in batch
    await db.runQuery(`
      UNWIND $batch AS link
      MATCH (j:Job {id: link.jobId})
      MATCH (s:Skill {id: link.skillId})
      MERGE (j)-[:REQUIRES]->(s)
    `, { batch: jobSkillsFlattened });

    console.log(` Created ${jobs.length} jobs, POSTED_BY, LOCATED_IN, and ${jobSkillsFlattened.length} REQUIRES relationships`);

    // Verification Summary Query
    const summaryRes = await db.runQuery(`
      MATCH (u:User) WITH count(u) AS usersCount
      MATCH (s:Skill) WITH usersCount, count(s) AS skillsCount
      MATCH (c:Company) WITH usersCount, skillsCount, count(c) AS companiesCount
      MATCH (l:Location) WITH usersCount, skillsCount, companiesCount, count(l) AS locationsCount
      MATCH (j:Job) WITH usersCount, skillsCount, companiesCount, locationsCount, count(j) AS jobsCount
      MATCH ()-[r]->() WITH usersCount, skillsCount, companiesCount, locationsCount, jobsCount, count(r) AS relsCount
      RETURN usersCount, skillsCount, companiesCount, locationsCount, jobsCount, relsCount
    `);

    const rec = summaryRes[0];
    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(2);

    console.log('\n====================================================');
    console.log('🎉 Seed completed successfully in ' + duration + 's');
    console.log('====================================================');
    console.log(`📊 Final Graph Stats in CognoDB:`);
    console.log(`   - Users:         ${rec.get('usersCount')}`);
    console.log(`   - Skills:        ${rec.get('skillsCount')}`);
    console.log(`   - Companies:     ${rec.get('companiesCount')}`);
    console.log(`   - Locations:     ${rec.get('locationsCount')}`);
    console.log(`   - Jobs:          ${rec.get('jobsCount')}`);
    console.log(`   - Relationships: ${rec.get('relsCount')}`);
    console.log('====================================================\n');

    await db.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Seed failed with error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    await db.close();
    process.exit(1);
  }
}

seed();
