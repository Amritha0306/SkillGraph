import React from 'react';
import { Building2, MapPin, Briefcase, DollarSign, CheckCircle2, Circle, Sparkles, ArrowRight, GitFork } from 'lucide-react';
import { JobRecommendation } from '../types';
import { MatchBadge } from './MatchBadge';

interface JobCardProps {
  recommendation: JobRecommendation;
  onViewDetails: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ recommendation, onViewDetails }) => {
  const { job, company, location, matchedSkills, missingSkills, matchPercentage, relatedSkills } =
    recommendation;

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const formatK = (n: number) => `$${Math.round(n / 1000)}k`;
    if (min && max) return `${formatK(min)} - ${formatK(max)}`;
    if (min) return `From ${formatK(min)}`;
    return `Up to ${formatK(max!)}`;
  };

  const salaryString = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 group">
      {/* Card Header: Job Title & Match Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-400 mt-1.5">
              {company && (
                <span className="flex items-center space-x-1 font-medium text-slate-200">
                  <Building2 className="w-3.5 h-3.5 text-brand-400" />
                  <span>{company.name}</span>
                </span>
              )}
              {location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{location.city}, {location.country}</span>
                </span>
              )}
            </div>
          </div>

          <MatchBadge percentage={matchPercentage} size="md" />
        </div>

        {/* Badges: Employment type, Experience, Salary */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span>{job.employmentType}</span>
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
            {job.experienceLevel} Level
          </span>
          {salaryString && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>{salaryString}</span>
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Skills Analysis Section */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
        
        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <div>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Matched Skills ({matchedSkills.length}):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div>
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold mb-1.5">
              <Circle className="w-3.5 h-3.5 text-slate-500" />
              <span>Missing Skills ({missingSkills.length}):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-800 font-medium"
                >
                  ○ {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Skills Bridge Highlight */}
        {relatedSkills.length > 0 && (
          <div className="p-2.5 rounded-xl bg-graph-purple/10 border border-graph-purple/20 space-y-1">
            <div className="flex items-center space-x-1.5 text-graph-purple font-semibold text-[11px]">
              <GitFork className="w-3.5 h-3.5 text-graph-purple" />
              <span>Related Skill Connections:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              {relatedSkills.slice(0, 2).map((rel, idx) => (
                <span key={idx} className="flex items-center space-x-1.5 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-graph-purple/30">
                  <span className="text-brand-300 font-medium">{rel.basedOnSkill}</span>
                  <span className="text-purple-400 text-[10px]">connects to</span>
                  <span className="text-amber-300 font-medium">{rel.relatedSkillName}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Card Action Footer */}
      <div className="pt-2">
        <button
          onClick={() => onViewDetails(job.id)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-slate-200 hover:text-white border border-slate-700 hover:border-brand-500 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
        >
          <span>View Match & Graph Insight</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
