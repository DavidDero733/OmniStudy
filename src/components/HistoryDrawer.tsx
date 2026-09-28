import React, { useState } from 'react';
import {
  X,
  Search,
  Bookmark,
  Trash2,
  Download,
  Copy,
  Check,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { SolutionResult } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SolutionResult[];
  onSelectResult: (r: SolutionResult) => void;
  onClearHistory: () => void;
  onToggleBookmark: (id: string) => void;
  onDeleteOne: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
  onToggleBookmark,
  onDeleteOne,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  if (!isOpen) return null;

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.questionSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.directAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBookmark = filterBookmarked ? item.isBookmarked : true;
    return matchesSearch && matchesBookmark;
  });

  const handleExportMarkdown = () => {
    const md = history
      .map((item, idx) => {
        return `## ${idx + 1}. [${item.subject}] ${item.questionSummary}
**Direct Answer:** ${item.directAnswer}
**Key/Copy:** \`${item.quickCopy}\`
**Steps:**
${item.steps.map((s) => `- Step ${s.stepNumber} (${s.title}): ${s.content}`).join('\n')}
---`;
      })
      .join('\n\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `OmniStudy_StudyBank_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyAllAnswers = async () => {
    const keys = history
      .map((item, idx) => `${idx + 1}. ${item.quickCopy || item.directAnswer}`)
      .join('\n');
    await navigator.clipboard.writeText(keys);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">Study Bank & History</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {history.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 border-b border-slate-800/80 space-y-2">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search past problems, answers, topics..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFilterBookmarked((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                filterBookmarked
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Starred Only</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyAllAnswers}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
                title="Copy answer keys as numbered list"
              >
                {copiedExport ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>Keys</span>
              </button>
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs"
                title="Export entire study bank as Markdown file"
              >
                <Download className="h-3 w-3" />
                <span>Export MD</span>
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <FileText className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <p>No solved problems match your search.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="group relative p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all cursor-pointer"
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700/60">
                    {item.subject}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(item.id);
                      }}
                      className={`p-1 rounded ${
                        item.isBookmarked
                          ? 'text-amber-400'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOne(item.id);
                      }}
                      className="p-1 rounded text-slate-600 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 font-sans mb-2">
                  {item.questionSummary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="font-mono text-xs font-bold text-emerald-400 truncate max-w-[200px]">
                    Ans: {item.directAnswer}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-rose-400/80 hover:text-rose-400 flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear History</span>
            </button>
            <span className="text-slate-500 text-[11px]">Saved locally</span>
          </div>
        )}
      </div>
    </div>
  );
};
