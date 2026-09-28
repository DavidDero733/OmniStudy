import React from 'react';
import {
  Sparkles,
  Zap,
  BookOpen,
  Calculator,
  PenTool,
  Eye,
  EyeOff,
  Shield,
  History,
  FileText,
  Globe,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import { SolvingMode, StealthTheme } from '../types';

interface NavbarProps {
  activeMode: SolvingMode;
  setActiveMode: (mode: SolvingMode) => void;
  stealthTheme: StealthTheme;
  setStealthTheme: (theme: StealthTheme) => void;
  ghostMode: boolean;
  setGhostMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenHelp: () => void;
  onPanic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeMode,
  setActiveMode,
  stealthTheme,
  setStealthTheme,
  ghostMode,
  setGhostMode,
  onOpenHistory,
  historyCount,
  onOpenHelp,
  onPanic,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Zap className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                OmniStudy
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Instant Academic & Quiz Engine
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('instant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMode === 'instant'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-300" />
            <span>Instant IXL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('step_by_step')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMode === 'step_by_step'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            <span>Step-by-Step</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('math')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMode === 'math'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="h-3.5 w-3.5 text-cyan-400" />
            <span>Math Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('essay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMode === 'essay'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PenTool className="h-3.5 w-3.5 text-purple-400" />
            <span>Essay & Writing</span>
          </button>
        </nav>

        {/* Discretion & Tools Controls */}
        <div className="flex items-center gap-2">
          {/* Ghost / Peek Mode Toggle */}
          <button
            type="button"
            onClick={() => setGhostMode((prev) => !prev)}
            title={ghostMode ? 'Ghost Mode ON (Answers blurred until hovered)' : 'Ghost Mode OFF'}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1 text-xs ${
              ghostMode
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600/50 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {ghostMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="hidden lg:inline font-mono text-[11px]">
              {ghostMode ? 'Ghost ON' : 'Ghost OFF'}
            </span>
          </button>

          {/* Stealth Disguise Selector */}
          <div className="relative group">
            <button
              type="button"
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs ${
                stealthTheme !== 'none'
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Stealth Camouflage: Disguise this app as Google Docs, Wikipedia, or Canvas LMS (Press Esc to toggle)"
            >
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">Disguise</span>
            </button>

            <div className="absolute right-0 mt-2 w-48 py-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Camouflage Mode
              </div>
              <button
                type="button"
                onClick={() => setStealthTheme('none')}
                className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-800 ${
                  stealthTheme === 'none' ? 'text-indigo-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Normal Pro View</span>
              </button>
              <button
                type="button"
                onClick={() => setStealthTheme('google_docs')}
                className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-800 ${
                  stealthTheme === 'google_docs' ? 'text-blue-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                <span>Google Docs Skin</span>
              </button>
              <button
                type="button"
                onClick={() => setStealthTheme('canvas_lms')}
                className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-800 ${
                  stealthTheme === 'canvas_lms' ? 'text-rose-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5 text-rose-400" />
                <span>Canvas LMS Skin</span>
              </button>
              <button
                type="button"
                onClick={() => setStealthTheme('wikipedia')}
                className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-800 ${
                  stealthTheme === 'wikipedia' ? 'text-slate-200 font-semibold' : 'text-slate-300'
                }`}
              >
                <Globe className="h-3.5 w-3.5 text-slate-300" />
                <span>Wikipedia Skin</span>
              </button>
            </div>
          </div>

          {/* Panic Button */}
          <button
            type="button"
            onClick={onPanic}
            title="Emergency Panic Shield: Immediately camouflage screen (Shortcut: Esc)"
            className="px-2.5 py-1.5 rounded-lg border border-red-900/60 bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="hidden sm:inline">Panic [Esc]</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="Saved Problems & History"
          >
            <History className="h-4 w-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Help Modal */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="Shortcuts & Tips"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
