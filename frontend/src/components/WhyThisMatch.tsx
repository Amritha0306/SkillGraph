import React from 'react';
import { HelpCircle, CheckCircle2, Circle, GitFork, ArrowRight, Lightbulb } from 'lucide-react';
import { RelatedSkillBridge, Skill } from '../types';

interface WhyThisMatchProps {
  matchPercentage: number;
  allRequiredSkills: Skill[];
  userSkills: string[];
  relatedBridges?: RelatedSkillBridge[];
  explanations?: string[];
}

export const WhyThisMatch: React.FC<WhyThisMatchProps> = ({
  matchPercentage,
  allRequiredSkills,
  userSkills,
  relatedBridges = [],
  explanations = [],
}) => {
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());
  const matched = allRequiredSkills.filter((s) => userSkillsLower.includes(s.name.toLowerCase()));
  const missing = allRequiredSkills.filter((s) => !userSkillsLower.includes(s.name.toLowerCase()));

  return (
    <div className="rounded-2xl glass-panel p-5 sm:p-7 border border-slate-800 space-y-6">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">Why This Match?</h3>
          <p className="text-xs text-slate-400">
            Transparent graph breakdown derived from your profile and role requirements
          </p>
        </div>
      </div>

      {/* Narrative Points from Graph */}
      {explanations.length > 0 && (
        <div className="space-y-2">
          {explanations.map((exp, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{exp}</span>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Skill Breakdown Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Matched Skills */}
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Matched ({matched.length})</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matched.length > 0 ? (
              matched.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                >
                  ✓ {s.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No direct matches</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Circle className="w-3.5 h-3.5 text-slate-500" />
              <span>Missing ({missing.length})</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missing.length > 0 ? (
              missing.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-700"
                >
                  ○ {s.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-400 font-medium">100% skill requirements matched!</span>
            )}
          </div>
        </div>

        {/* Related Skills Pathway */}
        <div className="p-4 rounded-xl bg-graph-purple/10 border border-graph-purple/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-graph-purple flex items-center space-x-1.5">
              <GitFork className="w-3.5 h-3.5" />
              <span>Related Skill Bridges ({relatedBridges.length})</span>
            </span>
          </div>
          <div className="space-y-2">
            {relatedBridges.length > 0 ? (
              relatedBridges.map((br, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-graph-purple/30 text-xs text-slate-300 space-y-1"
                >
                  <div className="flex items-center space-x-1.5 font-semibold text-purple-200">
                    <span className="text-brand-300">{br.basedOnSkill}</span>
                    <span className="text-purple-400 text-xs">→ connects to →</span>
                    <span className="text-amber-300">{br.relatedSkillName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Your knowledge of {br.basedOnSkill} helps you quickly pick up {br.relatedSkillName}.
                  </p>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No direct related skill bridges for this job</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
