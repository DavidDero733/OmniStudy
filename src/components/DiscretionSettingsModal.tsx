import React from 'react';
import { X, Shield, Eye, Keyboard, Zap, CheckCircle2 } from 'lucide-react';

interface DiscretionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ghostMode: boolean;
  setGhostMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const DiscretionSettingsModal: React.FC<DiscretionSettingsModalProps> = ({
  isOpen,
  onClose,
  ghostMode,
  setGhostMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">
              Discretion & Speed Master Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Ghost Mode Option */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
          <div className="flex gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Ghost / Peek Answer Masking
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically blurs the final answer until you hover your mouse or tap "Peek".
                Protects against shoulder-surfers in classroom environments.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGhostMode((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              ghostMode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {ghostMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Keyboard Shortcuts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Keyboard className="h-4 w-4 text-cyan-400" />
            Speed & Stealth Shortcuts
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-300">Emergency Panic Shield (Toggle Camouflage)</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono font-bold">
                Esc
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-300">Paste Screenshot from Clipboard</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono font-bold">
                Ctrl + V
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-300">Execute Instant Solver</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono font-bold">
                Ctrl + Enter
              </kbd>
            </div>
          </div>
        </div>

        {/* Camouflage Modes Breakdown */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            Available Disguises
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-blue-400 block mb-0.5">Google Docs</span>
              <span className="text-slate-400 text-[11px]">
                Mimics an open Google Docs document with toolbar and notes.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-rose-400 block mb-0.5">Canvas LMS</span>
              <span className="text-slate-400 text-[11px]">
                Mimics a Canvas course assignment page.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-0.5">Wikipedia</span>
              <span className="text-slate-400 text-[11px]">
                Mimics a reference encyclopedia article.
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-all"
        >
          Got It, Ready to Study
        </button>
      </div>
    </div>
  );
};
