import React, { useState } from 'react';
import { Network, CheckCircle2, Circle, ArrowRight, Building2, MapPin, Briefcase, Sparkles, GitFork } from 'lucide-react';
import { JobDetailResponse, RelatedSkillBridge } from '../types';

interface GraphVisualizationProps {
  jobDetail: JobDetailResponse;
  userSkills: string[];
  relatedBridges?: RelatedSkillBridge[];
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  jobDetail,
  userSkills,
  relatedBridges = [],
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const { job, company, location, requiredSkills } = jobDetail;
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());

  const matchedRequired = requiredSkills.filter((s) => userSkillsLower.includes(s.name.toLowerCase()));
  const missingRequired = requiredSkills.filter((s) => !userSkillsLower.includes(s.name.toLowerCase()));

  return (
    <div className="w-full rounded-2xl glass-panel p-5 sm:p-7 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-graph-purple/15 text-graph-purple border border-graph-purple/30">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span>Graph Connection Insight</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Interactive Skill Map
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing how your skills connect directly to this job, company, and location
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 pt-2 sm:pt-0">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400"></span>
            <span>Your Skills</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Matched Requirement</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>Missing Requirement</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-graph-purple"></span>
            <span>Related Skill</span>
          </span>
        </div>
      </div>

      {/* Interactive Multi-Column Graph Canvas */}
      <div className="relative overflow-x-auto py-4 bg-slate-950/70 rounded-xl border border-slate-800/80 p-4 sm:p-6 bg-graph-grid">
        <div className="min-w-[700px] grid grid-cols-4 gap-6 items-center relative">

          {/* Column 1: User Skills */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-400 flex items-center space-x-1.5 pb-1 border-b border-brand-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Skills</span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {userSkills.length > 0 ? (
                userSkills.map((s, idx) => {
                  const isDirect = matchedRequired.some((mr) => mr.name.toLowerCase() === s.toLowerCase());
                  const isRelated = relatedBridges.some((rb) => rb.basedOnSkill.toLowerCase() === s.toLowerCase());

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedNode(s)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all shadow-sm flex items-center justify-between ${
                        isDirect
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                          : isRelated
                          ? 'bg-purple-950/50 border-purple-500/40 text-purple-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{s}</span>
                      {isDirect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : isRelated ? (
                        <GitFork className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-slate-800 text-xs text-slate-500 text-center">
                  No user skills selected
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Job Requirements & Relationships */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 pb-1 border-b border-slate-700">
              <Network className="w-3.5 h-3.5 text-graph-purple" />
              <span>Job Requirements</span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {requiredSkills.map((req) => {
                const isMatched = userSkillsLower.includes(req.name.toLowerCase());
                const relatedBridge = relatedBridges.find(
                  (rb) => rb.relatedSkillName.toLowerCase() === req.name.toLowerCase()
                );

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedNode(req.name)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all shadow-sm space-y-1 ${
                      isMatched
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 shadow-emerald-500/10'
                        : relatedBridge
                        ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{req.name}</span>
                      {isMatched ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                          MATCHED
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                          MISSING
                        </span>
                      )}
                    </div>
                    {relatedBridge && (
                      <div className="text-[11px] text-purple-300 flex items-center space-x-1">
                        <span>Connected with</span>
                        <span className="font-semibold text-white truncate">{relatedBridge.basedOnSkill}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Target Job Node */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5 pb-1 border-b border-cyan-500/20">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Target Job Role</span>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-b from-brand-950/80 to-slate-900 border border-brand-500/40 shadow-lg shadow-brand-500/10 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-300 mb-1">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white leading-snug">{job.title}</h4>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <p>Level: {job.experienceLevel}</p>
                <p>Type: {job.employmentType}</p>
              </div>
            </div>
          </div>

          {/* Column 4: Company & Location Nodes */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5 pb-1 border-b border-rose-500/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>Company & Location</span>
            </div>
            <div className="space-y-2.5">
              {company && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs space-y-1 shadow-sm">
                  <div className="flex items-center space-x-1.5 text-slate-200 font-bold">
                    <Building2 className="w-3.5 h-3.5 text-brand-400" />
                    <span>{company.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{company.industry}</p>
                </div>
              )}

              {location && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs space-y-1 shadow-sm">
                  <div className="flex items-center space-x-1.5 text-slate-200 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{location.city}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{location.country}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Graph Narrative Footnote */}
      <div className="p-3.5 rounded-xl bg-brand-950/40 border border-brand-500/20 text-xs text-slate-300 flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-brand-200">How This Match Was Calculated: </span>
          <span>
            SkillGraph checks your skills against the job requirements, highlights related skills you have that support the role, and connects you directly with the hiring company and location.
          </span>
        </div>
      </div>
    </div>
  );
};
