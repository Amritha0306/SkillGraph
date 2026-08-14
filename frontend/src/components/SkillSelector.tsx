import React, { useState, useMemo } from 'react';
import { Search, X, Check, Sparkles, Wand2, Layers, ArrowRight } from 'lucide-react';
import { Skill, SkillCategoryGroup } from '../types';

interface SkillSelectorProps {
  allSkills: Skill[];
  groupedSkills: SkillCategoryGroup[];
  selectedSkills: string[];
  onToggleSkill: (skillName: string) => void;
  onClearSkills: () => void;
  onApplyPreset: (skillNames: string[]) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const PRESETS = [
  {
    name: 'Full Stack (React & Node)',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Git'],
  },
  {
    name: 'AI & Data Specialist',
    skills: ['Python', 'Pandas', 'FastAPI', 'PyTorch', 'LLM & LangChain', 'SQL', 'Docker'],
  },
  {
    name: 'DevOps & Cloud Architect',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Linux System Admin'],
  },
  {
    name: 'Frontend Pro (Next.js)',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3'],
  },
  {
    name: 'Backend Java / Distributed',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Apache Kafka', 'Microservices Architecture', 'Docker'],
  },
];

export const SkillSelector: React.FC<SkillSelectorProps> = ({
  allSkills,
  groupedSkills,
  selectedSkills,
  onToggleSkill,
  onClearSkills,
  onApplyPreset,
  onSubmit,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filter skills based on search term and category
  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allSkills, searchTerm, activeCategory]);

  const categories = useMemo(() => {
    return ['All', ...groupedSkills.map((g) => g.category)];
  }, [groupedSkills]);

  return (
    <div className="w-full space-y-6">
      {/* Search and Preset Bar */}
      <div className="glass-panel rounded-2xl p-5 sm:p-7 shadow-2xl border border-slate-800 space-y-6">
        
        {/* Preset Roles Picker */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Wand2 className="w-3.5 h-3.5 text-brand-400" />
            <span>Quick Start Presets</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onApplyPreset(preset.skills)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 text-slate-300 border border-slate-700/70 hover:border-brand-500/50 hover:bg-slate-800 hover:text-white transition-all font-medium flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills (e.g., React, Python, PostgreSQL, Docker, AWS)..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-sm sm:text-base transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Skill Pills Cloud */}
        <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            {filteredSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill.name);
              return (
                <button
                  key={skill.id}
                  onClick={() => onToggleSkill(skill.name)}
                  className={`group px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/30'
                      : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <span>{skill.name}</span>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <span className="text-slate-500 text-xs group-hover:text-slate-400">+</span>
                  )}
                </button>
              );
            })}
            {filteredSkills.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs sm:text-sm w-full">
                No skills matching "{searchTerm}". Try a different search term.
              </div>
            )}
          </div>
        </div>

        {/* Selected Skills Tray & Submit Action */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Selected Skills ({selectedSkills.length})
                </span>
                {selectedSkills.length > 0 && (
                  <button
                    onClick={onClearSkills}
                    className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {selectedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {selectedSkills.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-950/80 text-brand-300 border border-brand-500/40"
                    >
                      <span>{name}</span>
                      <button
                        onClick={() => onToggleSkill(name)}
                        className="hover:text-rose-400 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Select your skills above or choose a preset to discover matching jobs.
                </p>
              )}
            </div>

            {/* Find Matches Button */}
            <div className="sm:self-end">
              <button
                onClick={onSubmit}
                disabled={selectedSkills.length === 0 || isLoading}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all ${
                  selectedSkills.length > 0 && !isLoading
                    ? 'bg-gradient-to-r from-brand-500 via-brand-600 to-graph-purple hover:from-brand-400 hover:to-graph-violet text-white shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 scale-100 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Finding Best Matches...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Find My Matches ({selectedSkills.length})</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
