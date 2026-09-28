import React from 'react';
import { Globe, EyeOff, Search } from 'lucide-react';
import { SolutionResult } from '../types';

interface StealthWikipediaProps {
  result: SolutionResult | null;
  onExitStealth: () => void;
}

export const StealthWikipedia: React.FC<StealthWikipediaProps> = ({
  result,
  onExitStealth,
}) => {
  const title = result ? result.subject : 'Scientific Method';

  return (
    <div className="min-h-screen bg-white text-[#202122] font-serif select-text">
      {/* Wikipedia Header */}
      <header className="border-b border-[#a2a9b1] px-6 py-3 flex items-center justify-between font-sans">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-7 w-7 text-slate-700" />
            <div>
              <div className="text-base font-serif font-bold tracking-tight">WIKIPEDIA</div>
              <div className="text-[10px] text-slate-500 font-sans -mt-1">The Free Encyclopedia</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center border border-[#a2a9b1] rounded px-3 py-1 bg-[#f8f9fa] w-72">
            <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              readOnly
              value={`Search ${title}...`}
              className="bg-transparent text-xs text-slate-600 focus:outline-none w-full"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onExitStealth}
          className="text-xs px-3 py-1 rounded bg-[#3366cc] text-white hover:bg-[#2a4b8d] transition-all font-sans"
        >
          <EyeOff className="h-3 w-3 inline mr-1" />
          Exit Disguise [Esc]
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-[#a2a9b1] px-8 flex items-center gap-6 text-xs font-sans text-[#3366cc]">
        <span className="py-2 border-b-2 border-[#3366cc] font-bold text-slate-900 cursor-pointer">
          Article
        </span>
        <span className="py-2 hover:underline cursor-pointer">Talk</span>
        <div className="flex-1" />
        <span className="py-2 hover:underline cursor-pointer">Read</span>
        <span className="py-2 hover:underline cursor-pointer">View history</span>
      </div>

      {/* Article Content */}
      <main className="max-w-5xl mx-auto px-8 py-6">
        <h1 className="text-3xl font-serif border-b border-[#a2a9b1] pb-1 mb-4 text-[#000]">
          {title}
        </h1>

        <p className="text-xs text-slate-500 font-sans mb-4">
          From Wikipedia, the free encyclopedia
        </p>

        {/* Infobox on the right */}
        <div className="float-right ml-6 mb-4 w-72 border border-[#a2a9b1] bg-[#f8f9fa] p-3 text-xs font-sans">
          <div className="font-bold text-center border-b border-[#a2a9b1] pb-1 mb-2 bg-[#eaecf0] p-1">
            Academic Quick Reference
          </div>
          {result ? (
            <div className="space-y-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Active Question:</span>
                <span className="font-medium text-slate-800 line-clamp-3">
                  {result.questionSummary}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-300">
                <span className="text-slate-500 block text-[11px]">Primary Solution:</span>
                <span className="font-mono font-bold text-[#0055aa] text-sm">
                  {result.directAnswer}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Quick Copy Value:</span>
                <code className="bg-white border px-1 py-0.5 rounded font-mono text-green-700 font-bold text-xs">
                  {result.quickCopy}
                </code>
              </div>
            </div>
          ) : (
            <div className="text-slate-600">OmniStudy Academic Disguise Engine</div>
          )}
        </div>

        {/* Body Text */}
        <div className="space-y-4 text-sm leading-relaxed text-[#202122]">
          <p>
            In academic pedagogy and standardized testing (including comprehensive diagnostic
            frameworks like IXL, AP, and SAT), problem solving requires methodical identification of
            governing principles, rigorous mathematical reduction, and verification of units.
          </p>

          {result && (
            <div className="my-4 p-4 border border-[#c8ccd1] bg-[#f8f9fa] rounded">
              <h2 className="text-base font-bold font-sans mb-2 text-[#000]">
                Methodological Breakdown & Derivations
              </h2>
              <div className="space-y-3 font-sans text-xs">
                {result.steps.map((st) => (
                  <div key={st.stepNumber} className="border-l-2 border-[#3366cc] pl-3">
                    <p className="font-bold text-slate-800">
                      Step {st.stepNumber}: {st.title}
                    </p>
                    <p className="text-slate-700 mt-0.5">{st.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p>
            Standardized evaluations measure cognitive mastery through targeted multiple-choice
            distractors and precise numerical parameter extraction. By establishing formal
            foundations, learners achieve systematic resolution across theoretical and empirical
            domains.
          </p>
        </div>
      </main>
    </div>
  );
};
