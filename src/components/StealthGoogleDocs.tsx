import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  List,
  EyeOff,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { SolutionResult } from '../types';

interface StealthGoogleDocsProps {
  result: SolutionResult | null;
  onExitStealth: () => void;
}

export const StealthGoogleDocs: React.FC<StealthGoogleDocsProps> = ({
  result,
  onExitStealth,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.quickCopy || result.directAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fbfd] text-slate-800 font-sans flex flex-col select-text">
      {/* Google Docs Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800">
                AP European History - Unit 4 Reading Notes
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-300">
                Saved to Drive
              </span>
            </div>
            {/* Menu Items */}
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
              <span className="hover:bg-slate-100 px-1 rounded cursor-pointer">File</span>
              <span className="hover:bg-slate-100 px-1 rounded cursor-pointer">Edit</span>
              <span className="hover:bg-slate-100 px-1 rounded cursor-pointer">View</span>
              <span className="hover:bg-slate-100 px-1 rounded cursor-pointer">Insert</span>
              <span className="hover:bg-slate-100 px-1 rounded cursor-pointer">Format</span>
              <span className="hover:bg-slate-100 px-1 rounded cursor-pointer">Tools</span>
              <span className="hover:bg-slate-100 px-1 rounded cursor-pointer">Extensions</span>
              <span className="hover:bg-slate-100 px-1 rounded cursor-pointer">Help</span>
            </div>
          </div>
        </div>

        {/* Secret Exit Camouflage Button */}
        <div className="flex items-center gap-2">
          {result && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs px-2.5 py-1 rounded bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 flex items-center gap-1 font-mono"
              title="Discreet copy answer"
            >
              {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Key: ' + (result.quickCopy || result.directAnswer)}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExitStealth}
            className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all font-medium flex items-center gap-1"
          >
            <EyeOff className="h-3 w-3" />
            <span>Normal Mode [Esc]</span>
          </button>
        </div>
      </div>

      {/* Docs Toolbar */}
      <div className="bg-[#edf2fa] border-b border-slate-300 px-4 py-1.5 flex items-center gap-2 text-slate-700 overflow-x-auto">
        <Undo2 className="h-4 w-4 cursor-pointer text-slate-600" />
        <Redo2 className="h-4 w-4 cursor-pointer text-slate-600" />
        <Printer className="h-4 w-4 cursor-pointer text-slate-600" />
        <div className="h-4 w-[1px] bg-slate-300 mx-1" />
        <span className="text-xs bg-white px-2 py-0.5 rounded border border-slate-300">
          100%
        </span>
        <div className="h-4 w-[1px] bg-slate-300 mx-1" />
        <span className="text-xs bg-white px-2 py-0.5 rounded border border-slate-300 font-sans">
          Arial
        </span>
        <span className="text-xs bg-white px-2 py-0.5 rounded border border-slate-300">
          11
        </span>
        <div className="h-4 w-[1px] bg-slate-300 mx-1" />
        <Bold className="h-3.5 w-3.5 cursor-pointer font-bold" />
        <Italic className="h-3.5 w-3.5 cursor-pointer" />
        <Underline className="h-3.5 w-3.5 cursor-pointer" />
        <div className="h-4 w-[1px] bg-slate-300 mx-1" />
        <AlignLeft className="h-3.5 w-3.5 cursor-pointer text-blue-600" />
        <AlignCenter className="h-3.5 w-3.5 cursor-pointer" />
        <List className="h-3.5 w-3.5 cursor-pointer" />
      </div>

      {/* Paper Canvas */}
      <div className="flex-1 py-8 px-4 flex justify-center bg-[#f0f4f9] overflow-y-auto">
        <div className="bg-white w-full max-w-3xl min-h-[900px] shadow-lg rounded p-12 text-slate-800 font-serif leading-relaxed text-sm">
          <h1 className="text-xl font-bold font-sans text-slate-900 border-b pb-2 mb-4">
            Unit 4: Scientific Revolution, Synthesis & Problem Analysis
          </h1>

          <p className="text-xs text-slate-500 font-sans mb-6">
            Date: September 2026 • Course Notes & Assessment Preparation
          </p>

          {result ? (
            <div className="space-y-4 font-sans">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  Active Reference Problem ({result.subject}):
                </span>
                <p className="text-slate-800 text-sm font-medium">
                  {result.questionSummary}
                </p>
              </div>

              {/* Camouflaged Direct Answer */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                    Verified Formulation / Result Key:
                  </span>
                  <span className="text-base font-bold text-blue-950 font-mono">
                    {result.directAnswer}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">IXL / Quiz String</span>
                  <code className="text-xs font-mono font-bold text-green-700 bg-white px-2 py-0.5 rounded border border-slate-300">
                    {result.quickCopy}
                  </code>
                </div>
              </div>

              {/* Steps Camouflaged as Notes */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Derivation & Structural Points:
                </h3>
                {result.steps.map((st) => (
                  <div key={st.stepNumber} className="pl-3 border-l-2 border-slate-300">
                    <p className="font-semibold text-xs text-slate-700">
                      Point {st.stepNumber}: {st.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                      {st.content}
                    </p>
                  </div>
                ))}
              </div>

              {result.essayDraft && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h2 className="text-base font-bold font-serif mb-2">
                    {result.essayDraft.title}
                  </h2>
                  <p className="text-xs font-serif italic mb-3 text-slate-700">
                    Thesis: {result.essayDraft.thesis}
                  </p>
                  {result.essayDraft.bodyParagraphs.map((par, i) => (
                    <p key={i} className="text-xs font-serif mb-2 text-slate-800 indent-6">
                      {par}
                    </p>
                  ))}
                  <p className="text-xs font-serif text-slate-800 indent-6">
                    {result.essayDraft.conclusion}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-xs font-serif text-slate-700">
              <p>
                The shift from the Ptolemaic geocentric model to the Copernican heliocentric
                paradigm fundamentally restructured empirical methodology across Western Europe.
                Through the mathematical synthesis of Kepler's planetary laws and Galileo's
                telescopic observations, classical scholasticism gave way to deductive reasoning.
              </p>
              <p>
                Newton's Principia Mathematica codified this revolution through universal
                gravitation and the calculus, demonstrating that the terrestrial and celestial realms
                obeyed the same uniform laws of physics.
              </p>
              <div className="p-3 bg-slate-50 border rounded font-mono text-[11px] text-slate-600">
                [Press Esc to return to OmniStudy Solver at any time]
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
