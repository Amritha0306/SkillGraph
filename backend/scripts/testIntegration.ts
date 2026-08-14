async function runIntegrationTests() {
  console.log('🧪 Starting SkillGraph End-to-End API Integration Tests...\n');
  const baseUrl = 'http://localhost:5000/api';

  try {
    // 1. Health Check
    console.log('1️⃣ Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = (await healthRes.json()) as any;
    console.log('   Status:', healthRes.status, JSON.stringify(healthJson));
    if (healthRes.status !== 200 || !healthJson.database?.connected) {
      throw new Error('Health check failed: Database not connected.');
    }
    console.log('   ✅ Health check passed!\n');

    // 2. All Skills
    console.log('2️⃣ Testing GET /api/skills...');
    const skillsRes = await fetch(`${baseUrl}/skills`);
    const skillsJson = (await skillsRes.json()) as any;
    console.log(`   Count: ${skillsJson.count} skills returned`);
    console.log('   Sample:', skillsJson.data?.slice(0, 3));
    if (!skillsJson.success || skillsJson.count < 50) {
      throw new Error('Skills endpoint failed or returned insufficient skills.');
    }
    console.log('   ✅ Skills endpoint passed!\n');

    // 3. Related Skills
    console.log('3️⃣ Testing GET /api/skills/React/related...');
    const relRes = await fetch(`${baseUrl}/skills/React/related`);
    const relJson = (await relRes.json()) as any;
    console.log(`   React Related Skills (${relJson.count}):`, relJson.data);
    if (!relJson.success || relJson.count === 0) {
      throw new Error('Related skills query returned no results.');
    }
    console.log('   ✅ Related skills query passed!\n');

    // 4. Jobs List
    console.log('4️⃣ Testing GET /api/jobs?limit=5...');
    const jobsRes = await fetch(`${baseUrl}/jobs?limit=5`);
    const jobsJson = (await jobsRes.json()) as any;
    console.log(`   Sample Jobs (${jobsJson.count}):`, jobsJson.data?.map((j: any) => ({
      title: j.job.title,
      company: j.company?.name,
      location: j.location?.city,
      requiredSkillsCount: j.requiredSkills?.length
    })));
    if (!jobsJson.success || jobsJson.count === 0) {
      throw new Error('Jobs endpoint failed.');
    }
    console.log('   ✅ Jobs list endpoint passed!\n');

    // 5. Recommendations Query (The core graph feature)
    console.log('5️⃣ Testing POST /api/recommendations for ["React", "TypeScript", "JavaScript"]...');
    const recRes = await fetch(`${baseUrl}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: ['React', 'TypeScript', 'JavaScript'] })
    });
    const recJson = (await recRes.json()) as any;
    console.log(`   Matched Jobs: ${recJson.data?.totalMatchedJobs}`);
    console.log(`   Peak Match: ${recJson.data?.highestMatchPercentage}%`);
    console.log('   Top 2 Recommendations:', recJson.data?.recommendations?.slice(0, 2).map((r: any) => ({
      title: r.job.title,
      company: r.company?.name,
      matchPercentage: `${r.matchPercentage}%`,
      matched: r.matchedSkills,
      missing: r.missingSkills,
      relatedBridges: r.relatedSkills,
      explanation: r.matchExplanation
    })));
    if (!recJson.success || recJson.data?.totalMatchedJobs === 0) {
      throw new Error('Recommendations endpoint returned zero jobs.');
    }
    console.log('   ✅ Recommendations query passed!\n');

    // 6. Job Details & Graph Traversal Insight
    const firstJobId = recJson.data?.recommendations[0]?.job?.id || 'job-1';
    console.log(`6️⃣ Testing GET /api/jobs/${firstJobId}?userSkills=React,TypeScript,JavaScript...`);
    const detailRes = await fetch(`${baseUrl}/jobs/${firstJobId}?userSkills=React,TypeScript,JavaScript`);
    const detailJson = (await detailRes.json()) as any;
    console.log('   Job Details:', {
      title: detailJson.data?.job?.title,
      company: detailJson.data?.company?.name,
      location: detailJson.data?.location?.city,
      requiredSkills: detailJson.data?.requiredSkills?.map((s: any) => s.name),
      narrative: detailJson.data?.connectionInsight?.narrative,
      subgraphNodesCount: detailJson.data?.connectionInsight?.nodes?.length
    });
    if (!detailJson.success) {
      throw new Error('Job details endpoint failed.');
    }
    console.log('   ✅ Job details & Graph Traversal Insight passed!\n');

    console.log('====================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Integration test failed:', err);
    process.exit(1);
  }
}

runIntegrationTests();
