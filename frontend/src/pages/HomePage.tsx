import React from 'react';
import { Network, Sparkles, Database, Layers, ArrowRight, ShieldCheck, Zap, GitFork } from 'lucide-react';
import { Skill, SkillCategoryGroup } from '../types';
import { SkillSelector } from '../components/SkillSelector';

interface HomePageProps {
  allSkills: Skill[];
  groupedSkills: SkillCategoryGroup[];
  selectedSkills: string[];
  onToggleSkill: (skillName: string) => void;
  onClearSkills: () => void;
  onApplyPreset: (skillNames: string[]) => void;
  onFindMatches: () => void;
  isLoading: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  allSkills,
  groupedSkills,
  selectedSkills,
  onToggleSkill,
  onClearSkills,
  onApplyPreset,
  onFindMatches,
  isLoading,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6 sm:pt-10">

        {/* Graph Engine Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Intelligent Skill & Career Matching</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Turn your skills into your{' '}
          <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-graph-purple bg-clip-text text-transparent">
            next opportunity.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Discover jobs through the connections between your skills, roles and companies.
        </p>

        {/* Small Visual Graph Traversal Flow */}
        <div className="inline-flex items-center justify-center space-x-2 sm:space-x-3 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300">
          <span className="font-semibold text-brand-300 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-brand-400"></span>
            <span>Your Skills</span>
          </span>
          <span className="text-slate-600">→</span>
          <span className="font-semibold text-purple-300 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Related Bridges</span>
          </span>
          <span className="text-slate-600">→</span>
          <span className="font-semibold text-emerald-300 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Target Jobs</span>
          </span>
          <span className="text-slate-600">→</span>
          <span className="font-semibold text-cyan-300 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Companies</span>
          </span>
        </div>
      </section>

      {/* Main Interactive Skill Selection Panel */}
      <section className="max-w-4xl mx-auto">
        <SkillSelector
          allSkills={allSkills}
          groupedSkills={groupedSkills}
          selectedSkills={selectedSkills}
          onToggleSkill={onToggleSkill}
          onClearSkills={onClearSkills}
          onApplyPreset={onApplyPreset}
          onSubmit={onFindMatches}
          isLoading={isLoading}
        />
      </section>

      {/* Advantage Highlights */}
      <section className="max-w-6xl mx-auto pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="glass-panel rounded-2xl p-6 space-y-3 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Instant Intelligent Matching</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Connects your skills directly to relevant job roles and company requirements in milliseconds without delays.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-graph-purple/15 border border-graph-purple/30 flex items-center justify-center text-graph-purple">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Related Skill Connections</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Find adjacent technical strengths and related skill bridges to automatically expand your career opportunities.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Transparent Match Reasoning</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Never wonder why a job was suggested. See exact match percentages and understand clearly how your skills connect to each role.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};
