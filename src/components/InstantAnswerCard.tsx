import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  AlertCircle,
  Lightbulb,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import { SolutionResult } from '../types';

interface InstantAnswerCardProps {
  result: SolutionResult;
  ghostMode: boolean;
  onToggleBookmark: (id: string) => void;
}

export const InstantAnswerCard: React.FC<InstantAnswerCardProps> = ({
  result,
  ghostMode,
  onToggleBookmark,
}) => {
  const [copiedQuick, setCopiedQuick] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [isRevealedManually, setIsRevealedManually] = useState(false);

  const handleCopyQuick = async () => {
    try {
      await navigator.clipboard.writeText(result.quickCopy || result.directAnswer);
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyFull = async () => {
    try {
      const fullText = `Question: ${result.questionSummary}\nAnswer: ${result.directAnswer}\n\nSteps:\n${result.steps
        .map((s) => `${s.stepNumber}. ${s.title}: ${s.content}`)
        .join('\n')}`;
      await navigator.clipboard.writeText(fullText);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const isBlurred = ghostMode && !isRevealedManually;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all">
      {/* Top Banner: Subject, Confidence, Bookmark */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {result.subject || 'General Academic'}
          </span>
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {result.confidence || 'Verified'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {ghostMode && (
            <button
              type="button"
              onClick={() => setIsRevealedManually((prev) => !prev)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
            >
              {isRevealedManually ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              <span>{isRevealedManually ? 'Hide' : 'Peek'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onToggleBookmark(result.id)}
            className={`p-1.5 rounded-lg border transition-all ${
              result.isBookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={result.isBookmarked ? 'Remove Bookmark' : 'Save to Study Bank'}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question OCR Transcription */}
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
          Extracted Question
        </p>
        <p className="text-slate-200 text-sm font-sans leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 select-text">
          {result.questionSummary}
        </p>
      </div>

      {/* Main Direct Answer Highlight */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Instant Answer Key
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyQuick}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                copiedQuick
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
              }`}
              title="Copy only the answer string to paste directly into IXL/Canvas"
            >
              {copiedQuick ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedQuick ? 'Copied Key!' : 'Copy Answer Only'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyFull}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-all text-xs"
              title="Copy Question + Full Solution"
            >
              {copiedFull ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Answer Box (with Ghost blur on hover / peek) */}
        <div
          onMouseEnter={() => ghostMode && setIsRevealedManually(true)}
          onMouseLeave={() => ghostMode && setIsRevealedManually(false)}
          className={`relative p-4 rounded-xl border transition-all duration-300 ${
            isBlurred
              ? 'bg-slate-950/90 border-slate-800 filter blur-md select-none cursor-pointer'
              : 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{result.directAnswer}</span>
              </div>
              {result.selectedOptionLetter && (
                <p className="text-xs text-indigo-300 font-mono mt-1">
                  Selected Choice: <span className="font-bold underline text-white">Option {result.selectedOptionLetter}</span>
                </p>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Quick Paste String
              </span>
              <code className="text-xs sm:text-sm font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                {result.quickCopy}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Multiple Choice Options List (if detected) */}
      {result.optionsDetected && result.optionsDetected.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 mb-2">Options Analysis:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.optionsDetected.map((opt, idx) => {
              const isSelected =
                (result.selectedOptionLetter &&
                  opt.trim().startsWith(result.selectedOptionLetter)) ||
                opt.includes(result.directAnswer);

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs font-sans transition-all flex items-start gap-2 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isSelected ? '✓' : String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* IXL Smart Tip & Common Trap */}
      {(result.ixlTip || result.commonMistakes) && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {result.ixlTip && (
            <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-indigo-200 block">IXL & Quiz Format Tip:</span>
                <span className="text-[11px] text-indigo-300/90">{result.ixlTip}</span>
              </div>
            </div>
          )}

          {result.commonMistakes && (
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-200 block">Common Pitfall:</span>
                <span className="text-[11px] text-amber-300/90">{result.commonMistakes}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
