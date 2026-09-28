import React, { useState } from 'react';
import {
  PenTool,
  Copy,
  Check,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  FileCheck,
  Scale,
} from 'lucide-react';
import { EssayDraft } from '../types';

interface EssayDraftCardProps {
  essay: EssayDraft;
  onRunEssayAction: (action: string, text: string) => Promise<string | null>;
}

export const EssayDraftCard: React.FC<EssayDraftCardProps> = ({
  essay,
  onRunEssayAction,
}) => {
  const [content, setContent] = useState<string>(() => {
    return [
      `# ${essay.title || 'Academic Essay'}`,
      `\n**Thesis Statement:** ${essay.thesis}`,
      ...essay.bodyParagraphs.map((p) => `\n${p}`),
      `\n**Conclusion:** ${essay.conclusion}`,
    ].join('\n');
  });

  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Calculate live words
  const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.ceil(wordsCount / 200);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (action: string, label: string) => {
    setIsProcessing(true);
    setActionSuccessMessage(null);
    try {
      const revised = await onRunEssayAction(action, content);
      if (revised) {
        setContent(revised);
        setActionSuccessMessage(`Successfully applied: ${label}`);
        setTimeout(() => setActionSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <PenTool className="h-5 w-5 text-purple-400" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base">
            Academic Essay & Writing Workshop
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40 font-mono">
            {wordsCount} words • ~{readMinutes} min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied All!' : 'Copy Draft'}</span>
          </button>
        </div>
      </div>

      {/* Thesis Callout */}
      {essay.thesis && (
        <div className="mt-3 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40">
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 block mb-1">
            Central Thesis Statement:
          </span>
          <p className="text-xs sm:text-sm text-purple-100 font-serif italic">
            "{essay.thesis}"
          </p>
        </div>
      )}

      {/* AI Enhancement Toolbar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-purple-400" />
          Refine:
        </span>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleAction('elevate_vocab', 'Elevate Vocabulary')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 text-xs font-medium transition-all"
        >
          Elevate Vocabulary
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleAction('expand', 'Expand Word Count')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 text-xs font-medium transition-all flex items-center gap-1"
        >
          <Maximize2 className="h-3 w-3" />
          <span>Expand Length</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleAction('concise', 'Make Concise')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 text-xs font-medium transition-all flex items-center gap-1"
        >
          <Minimize2 className="h-3 w-3" />
          <span>Make Concise</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleAction('counterargument', 'Add Counterargument')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 text-xs font-medium transition-all flex items-center gap-1"
        >
          <Scale className="h-3 w-3" />
          <span>Add Counterargument</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() =>
            handleAction('plagiarism_safe_paraphrase', 'Paraphrase & Restructure')
          }
          className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 text-xs font-medium transition-all flex items-center gap-1"
        >
          <FileCheck className="h-3 w-3" />
          <span>Paraphrase</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          {actionSuccessMessage}
        </div>
      )}

      {isProcessing && (
        <div className="mt-2 flex items-center gap-2 text-xs text-purple-300 bg-purple-950/30 p-2 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>Rewriting and polishing essay draft...</span>
        </div>
      )}

      {/* Editable Markdown / Prose Area */}
      <div className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-slate-200 text-sm font-serif leading-relaxed focus:outline-none focus:border-purple-500/70 resize-y"
          placeholder="Essay draft appears here..."
        />
      </div>
    </div>
  );
};
