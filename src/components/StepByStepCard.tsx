import React, { useState } from 'react';
import { BookOpen, Copy, Check, ChevronDown, ChevronUp, FunctionSquare } from 'lucide-react';
import { SolutionStep } from '../types';

interface StepByStepCardProps {
  steps: SolutionStep[];
  keyFormulaOrRule?: string;
}

export const StepByStepCard: React.FC<StepByStepCardProps> = ({
  steps,
  keyFormulaOrRule,
}) => {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCopy = async () => {
    try {
      const text = steps
        .map((s) => `Step ${s.stepNumber}: ${s.title}\n${s.content}`)
        .join('\n\n');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base">
            Detailed Step-by-Step Breakdown
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {steps.length} Steps
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/80 transition-all"
            title="Copy all steps"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Steps'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 bg-slate-800/80"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Formula or Core Law Highlight */}
      {keyFormulaOrRule && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2.5">
          <FunctionSquare className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400 block">
              Core Formula / Governing Rule
            </span>
            <span className="font-mono text-xs sm:text-sm text-emerald-200 font-semibold">
              {keyFormulaOrRule}
            </span>
          </div>
        </div>
      )}

      {/* Steps List */}
      {!collapsed && (
        <div className="mt-4 space-y-3">
          {steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 transition-all hover:border-slate-700"
            >
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 mt-0.5">
                  {step.stepNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-200 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans select-text whitespace-pre-wrap">
                    {step.content}
                  </p>

                  {step.mathLatex && (
                    <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                      {step.mathLatex}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
