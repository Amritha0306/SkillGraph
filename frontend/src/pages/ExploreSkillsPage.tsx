import React, { useState, useEffect } from 'react';
import { Network, Search, GitFork, ArrowRight, Sparkles, Layers, BookOpen } from 'lucide-react';
import { Skill, SkillCategoryGroup } from '../types';
import { api } from '../services/api';

interface ExploreSkillsPageProps {
  allSkills: Skill[];
  groupedSkills: SkillCategoryGroup[];
  onSelectSkillForSearch: (skillName: string) => void;
}

export const ExploreSkillsPage: React.FC<ExploreSkillsPageProps> = ({
  allSkills,
  groupedSkills,
  onSelectSkillForSearch,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string>('React');
  const [relatedSkills, setRelatedSkills] = useState<Array<{
    id: string;
    name: string;
    category: string;
    relatedTo: string;
  }>>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!selectedSkill) return;

    let isMounted = true;
    const fetchRelated = async () => {
      setLoadingRelated(true);
      try {
        const data = await api.getRelatedSkills(selectedSkill);
        if (isMounted) {
          setRelatedSkills(data);
        }
      } catch (err) {
        console.error('Failed to fetch related skills:', err);
      } finally {
        if (isMounted) {
          setLoadingRelated(false);
        }
      }
    };

    fetchRelated();
    return () => {
      isMounted = false;
    };
  }, [selectedSkill]);

  const filteredSkills = allSkills.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-graph-purple/10 text-graph-purple border border-graph-purple/20 text-xs font-semibold">
          <Network className="w-3.5 h-3.5" />
          <span>Skill Knowledge Graph Explorer</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Skill Relationships
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Discover how skills connect across domains to expand your career reach and unlock new job opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Skill Browser */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills to explore..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {groupedSkills.map((group) => {
              const groupSkills = group.skills.filter((s) =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase())
              );
              if (groupSkills.length === 0) return null;

              return (
                <div key={group.category} className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {groupSkills.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSkill(s.name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedSkill === s.name
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 font-bold'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Relationship Visualization & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Skill Hub
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                  <span>{selectedSkill}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {allSkills.find((s) => s.name === selectedSkill)?.category || 'Technology'}
                  </span>
                </h2>
              </div>

              <button
                onClick={() => onSelectSkillForSearch(selectedSkill)}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm inline-flex items-center space-x-2 transition-all shadow-lg shadow-brand-500/20 self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Jobs with {selectedSkill}</span>
              </button>
            </div>

            {/* Related Nodes Graph Display */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-graph-purple">
                <GitFork className="w-4 h-4" />
                <span>Directly Connected Skills ({relatedSkills.length})</span>
              </div>

              {loadingRelated ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Finding connected skills...
                </div>
              ) : relatedSkills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {relatedSkills.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => setSelectedSkill(rel.name)}
                      className="glass-panel-interactive rounded-xl p-3.5 border border-slate-800 cursor-pointer space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white group-hover:text-brand-300 text-sm">
                          {rel.name}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {rel.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                        <span className="text-brand-300 font-medium">{selectedSkill}</span>
                        <span className="text-slate-500">connects to</span>
                        <span className="text-amber-300 font-medium">{rel.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs italic">
                  No direct related skills cataloged for {selectedSkill}.
                </div>
              )}
            </div>

            {/* Educational Insight */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-brand-400" />
                <span>Why Skill Relationships Matter in Career Matching</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                When a job requires <span className="text-white font-medium">Next.js</span>, candidates skilled in <span className="text-white font-medium">React</span> are often a great fit. SkillGraph automatically connects related skills so you don't miss out on roles that match your capabilities.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
