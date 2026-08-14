import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowLeft, SlidersHorizontal, CheckCircle2, TrendingUp, Briefcase } from 'lucide-react';
import { RecommendationResponse } from '../types';
import { JobCard } from '../components/JobCard';
import { EmptyState } from '../components/EmptyState';

interface ResultsPageProps {
  results: RecommendationResponse;
  selectedSkills: string[];
  onBackToSearch: () => void;
  onViewJobDetails: (jobId: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  results,
  selectedSkills,
  onBackToSearch,
  onViewJobDetails,
}) => {
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'salary'>('match');

  const filteredJobs = useMemo(() => {
    return results.recommendations
      .filter((rec) => {
        const matchesLevel = levelFilter === 'All' || rec.job.experienceLevel === levelFilter;
        const matchesType = typeFilter === 'All' || rec.job.employmentType === typeFilter;
        return matchesLevel && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'salary') {
          const salA = a.job.salaryMax || a.job.salaryMin || 0;
          const salB = b.job.salaryMax || b.job.salaryMin || 0;
          return salB - salA;
        }
        return b.matchPercentage - a.matchPercentage;
      });
  }, [results.recommendations, levelFilter, typeFilter, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <button
            onClick={onBackToSearch}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Selected Skills</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>Your Career Matches</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {results.totalMatchedJobs} Roles Found
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Matched in real-time based on your unique skill profile
          </p>
        </div>

        {/* Quick Summary Metric Cards */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl glass-panel border border-slate-800 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Skills Selected
            </span>
            <span className="text-base sm:text-lg font-extrabold text-brand-400">
              {selectedSkills.length}
            </span>
          </div>

          <div className="px-4 py-2.5 rounded-xl glass-panel border border-slate-800 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Peak Match
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-400">
              {results.highestMatchPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Selected Skill Chips Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase text-slate-400 mr-1">Your Skills:</span>
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-0.5 rounded-md bg-brand-950/80 text-brand-300 border border-brand-500/30 text-xs font-medium"
          >
            {skill}
          </span>
        ))}
        <button
          onClick={onBackToSearch}
          className="text-xs text-slate-400 hover:text-white underline ml-auto pl-2"
        >
          Modify skills
        </button>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 text-xs"
          >
            <option value="All">All Experience Levels</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
            <option value="Lead">Lead Level</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 text-xs"
          >
            <option value="All">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-xs font-medium">Sort By:</span>
          <button
            onClick={() => setSortBy('match')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === 'match'
                ? 'bg-brand-500 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Match % (Highest)
          </button>
          <button
            onClick={() => setSortBy('salary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === 'salary'
                ? 'bg-brand-500 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Salary
          </button>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((rec) => (
            <JobCard
              key={rec.job.id}
              recommendation={rec}
              onViewDetails={onViewJobDetails}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Matching Jobs for Selected Filters"
          description="Try relaxing your experience level or employment type filters to see all available graph matches."
          actionText="Reset Filters"
          onAction={() => {
            setLevelFilter('All');
            setTypeFilter('All');
          }}
        />
      )}
    </div>
  );
};
