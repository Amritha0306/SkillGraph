import React from 'react';
import { Database, Network, GitCommit, Layers, Code, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 pt-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <Database className="w-4 h-4" />
          <span>Graph Data Model & openCypher Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Under the Hood: CognoDB
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          How SkillGraph leverages native graph relationships, multi-hop Cypher queries, and Bolt protocol to power real-time career intelligence.
        </p>
      </div>

      {/* Graph Schema Visual Diagram */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-800">
          <Layers className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Graph Schema Topology</h2>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto">
          <pre className="text-brand-300 whitespace-pre">
{`  (:User {id, name, email})
      |
   [:HAS_SKILL]
      |
      v
  (:Skill {id, name, category}) <---[:RELATED_TO]---> (:Skill {id, name, category})
      ^
      |
   [:REQUIRES]
      |
  (:Job {id, title, description, employmentType, experienceLevel, salaryMin, salaryMax})
      |                     |
  [:POSTED_BY]          [:LOCATED_IN]
      |                     |
      v                     v
  (:Company {id, name, industry}) ---> [:LOCATED_IN] ---> (:Location {id, city, country})`}
          </pre>
        </div>
      </div>

      {/* Why a Graph Database Essay & Comparison */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-800">
          <Network className="w-5 h-5 text-graph-purple" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Why a Graph Database for Skill Recommendations?</h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Traditional relational databases represent relationships through foreign key IDs and intermediary join tables (e.g., <code className="text-slate-200 bg-slate-900 px-1.5 py-0.5 rounded font-mono">user_skills</code>, <code className="text-slate-200 bg-slate-900 px-1.5 py-0.5 rounded font-mono">job_skills</code>, <code className="text-slate-200 bg-slate-900 px-1.5 py-0.5 rounded font-mono">skill_synonyms</code>). As queries grow to calculate multi-hop traversals (such as finding jobs requiring skills that are adjacent to the skills a user possesses), relational databases must execute cascading <code className="text-rose-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">JOIN</code> operations. This results in exponential execution overhead and complex SQL queries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
              <span className="font-bold text-rose-300 text-xs uppercase tracking-wider block">
                Relational (RDBMS) Drawbacks
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                <li>Requires 5+ expensive table joins for a single recommendation</li>
                <li>Related skills require self-referencing join tables & recursion</li>
                <li>Rigid table schemas make adding new relationship types painful</li>
                <li>Match explanations require separate ad-hoc aggregations</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <span className="font-bold text-emerald-300 text-xs uppercase tracking-wider block">
                CognoDB Graph Advantages
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                <li>Direct index-free adjacency traversal in constant time</li>
                <li>Natural multi-hop traversals: <code className="text-emerald-300 font-mono text-[11px]">User → Skill → Related → Job</code></li>
                <li>Exact match % calculated directly in parameterized openCypher</li>
                <li>Dynamic relationship properties and rich metadata graph nodes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Production Cypher Queries Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-800">
          <Code className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Live openCypher Queries in SkillGraph</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
              1. Multi-Hop Recommendation & Math Calculation Query:
            </span>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre className="text-emerald-400 whitespace-pre">
{`MATCH (j:Job)-[:REQUIRES]->(req:Skill)
OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)
OPTIONAL MATCH (j)-[:LOCATED_IN]->(l:Location)
WITH j, c, l, collect(DISTINCT req.name) AS allRequiredSkills
WITH j, c, l, allRequiredSkills,
     [s IN allRequiredSkills WHERE toLower(s) IN $userSkillsLower] AS matchedSkills,
     [s IN allRequiredSkills WHERE NOT toLower(s) IN $userSkillsLower] AS missingSkills
WHERE size(matchedSkills) > 0
WITH j, c, l, allRequiredSkills, matchedSkills, missingSkills,
     round((toFloat(size(matchedSkills)) / toFloat(size(allRequiredSkills))) * 100.0) AS matchPercentage
RETURN j, c, l, allRequiredSkills, matchedSkills, missingSkills, matchPercentage
ORDER BY matchPercentage DESC, size(matchedSkills) DESC`}
              </pre>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              2. Related Skill Bridge Discovery Query:
            </span>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre className="text-purple-300 whitespace-pre">
{`MATCH (uSkill:Skill)
WHERE toLower(uSkill.name) IN $userSkillsLower
MATCH (uSkill)-[:RELATED_TO]-(relSkill:Skill)
WHERE NOT toLower(relSkill.name) IN $userSkillsLower
MATCH (j:Job {id: $jobId})-[:REQUIRES]->(relSkill)
RETURN DISTINCT
  uSkill.name AS basedOnSkill,
  relSkill.name AS relatedSkillName,
  relSkill.category AS category`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
