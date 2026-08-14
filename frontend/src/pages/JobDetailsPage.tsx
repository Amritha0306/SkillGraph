import React from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  CheckCircle2,
  Circle,
  Sparkles,
  ExternalLink,
  Layers,
  GitFork,
  HelpCircle,
} from 'lucide-react';
import { JobDetailResponse, RelatedSkillBridge } from '../types';
import { MatchBadge } from '../components/MatchBadge';
import { GraphVisualization } from '../components/GraphVisualization';
import { WhyThisMatch } from '../components/WhyThisMatch';

interface JobDetailsPageProps {
  jobDetail: JobDetailResponse;
  userSkills: string[];
  onBack: () => void;
}

export const JobDetailsPage: React.FC<JobDetailsPageProps> = ({
  jobDetail,
  userSkills,
  onBack,
}) => {
  const { job, company, location, requiredSkills, relatedSkills, connectionInsight } = jobDetail;

  const userSkillsLower = userSkills.map((s) => s.toLowerCase());
  const matchedSkills = requiredSkills.filter((s) => userSkillsLower.includes(s.name.toLowerCase()));
  const missingSkills = requiredSkills.filter((s) => !userSkillsLower.includes(s.name.toLowerCase()));

  const matchPercentage =
    requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

  // Transform related skills bridges for visualization
  const relatedBridges: RelatedSkillBridge[] = relatedSkills.map((r) => ({
    basedOnSkill: r.relatedTo,
    relatedSkillName: r.skillName,
    category: r.category,
  }));

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const formatK = (n: number) => `$${Math.round(n / 1000)}k`;
    if (min && max) return `${formatK(min)} - ${formatK(max)} per year`;
    if (min) return `From ${formatK(min)} per year`;
    return `Up to ${formatK(max!)} per year`;
  };

  const salaryString = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors p-2 rounded-lg hover:bg-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Matches</span>
        </button>
      </div>

      {/* Main Role Overview Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Job Opportunity
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {job.experienceLevel} Level
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {job.employmentType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300 pt-1">
              {company && (
                <div className="flex items-center space-x-1.5 font-semibold text-slate-100">
                  <Building2 className="w-4 h-4 text-brand-400" />
                  <span>{company.name}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{location.city}, {location.country}</span>
                </div>
              )}
              {salaryString && (
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <DollarSign className="w-4 h-4" />
                  <span>{salaryString}</span>
                </div>
              )}
            </div>
          </div>

          {/* Big Match Score Indicator */}
          <div className="self-start lg:self-center">
            <MatchBadge percentage={matchPercentage} size="lg" />
          </div>
        </div>

        {/* Job Description */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            About the Role
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Company Detail Box */}
        {company && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-brand-400" />
                <span>About {company.name}</span>
              </span>
              <span className="text-xs text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 font-medium">
                {company.industry}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {company.description}
            </p>
          </div>
        )}
      </div>

      {/* MATCH ANALYSIS & WHY THIS MATCH */}
      <WhyThisMatch
        matchPercentage={matchPercentage}
        allRequiredSkills={requiredSkills}
        userSkills={userSkills}
        relatedBridges={relatedBridges}
        explanations={connectionInsight?.narrative || []}
      />

      {/* GRAPH CONNECTION INSIGHT VISUALIZATION */}
      <GraphVisualization
        jobDetail={jobDetail}
        userSkills={userSkills}
        relatedBridges={relatedBridges}
      />
    </div>
  );
};
