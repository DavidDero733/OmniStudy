import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProblemInput } from './components/ProblemInput';
import { InstantAnswerCard } from './components/InstantAnswerCard';
import { StepByStepCard } from './components/StepByStepCard';
import { MathGraphCard } from './components/MathGraphCard';
import { EssayDraftCard } from './components/EssayDraftCard';
import { FollowUpChat } from './components/FollowUpChat';
import { ImageCropModal } from './components/ImageCropModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { DiscretionSettingsModal } from './components/DiscretionSettingsModal';
import { StealthGoogleDocs } from './components/StealthGoogleDocs';
import { StealthWikipedia } from './components/StealthWikipedia';
import { StealthCanvasLMS } from './components/StealthCanvasLMS';
import { SolvingMode, StealthTheme, SolutionResult, FollowUpMessage } from './types';
import {
  Sparkles,
  Zap,
  AlertCircle,
  BookOpen,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

const STORAGE_KEY = 'omnistudy_history_v1';
const GHOST_KEY = 'omnistudy_ghost_mode';

export default function App() {
  const [text, setText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mode, setMode] = useState<SolvingMode>('instant');
  const [subjectHint, setSubjectHint] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [essayOptions, setEssayOptions] = useState({
    words: 450,
    level: 'High School Honors',
    style: 'Analytical & Evidence-Based',
  });

  const [currentResult, setCurrentResult] = useState<SolutionResult | null>(null);
  const [history, setHistory] = useState<SolutionResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stealthTheme, setStealthTheme] = useState<StealthTheme>('none');
  const [ghostMode, setGhostMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GHOST_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Sync ghost mode
  useEffect(() => {
    try {
      localStorage.setItem(GHOST_KEY, String(ghostMode));
    } catch (e) {
      console.error(e);
    }
  }, [ghostMode]);

  // Global Esc shortcut for Panic Camouflage or closing modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCropOpen) {
          setIsCropOpen(false);
          return;
        }
        if (isHistoryOpen) {
          setIsHistoryOpen(false);
          return;
        }
        if (isHelpOpen) {
          setIsHelpOpen(false);
          return;
        }

        // Toggle stealth disguise
        setStealthTheme((prev) => (prev === 'none' ? 'google_docs' : 'none'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCropOpen, isHistoryOpen, isHelpOpen]);

  // Primary Solver Action
  const handleSolve = async () => {
    if (!text.trim() && !imageBase64) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          imageBase64,
          mode,
          subjectHint,
          essayOptions,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to solve problem.');
      }

      const data = json.data;
      const newResult: SolutionResult = {
        id: `sol_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
        subject: data.subject || 'General Academic',
        questionSummary: data.questionSummary || text.trim(),
        questionType: data.questionType || 'short_answer',
        directAnswer: data.directAnswer || 'Answer calculated',
        quickCopy: data.quickCopy || data.directAnswer || '',
        selectedOptionLetter: data.selectedOptionLetter || undefined,
        optionsDetected: data.optionsDetected || [],
        confidence: data.confidence || '99% High Confidence',
        keyFormulaOrRule: data.keyFormulaOrRule || undefined,
        steps: data.steps || [],
        graphFunction: data.graphFunction || undefined,
        ixlTip: data.ixlTip || undefined,
        commonMistakes: data.commonMistakes || undefined,
        essayDraft: data.essayDraft || undefined,
        rawQuestionText: text,
        imageSnapshot: imageBase64 || undefined,
        isBookmarked: false,
        followUps: [],
      };

      setCurrentResult(newResult);
      setHistory((prev) => [newResult, ...prev.slice(0, 49)]); // keep top 50
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while solving the problem.');
    } finally {
      setIsLoading(false);
    }
  };

  // Follow-up Q&A
  const handleSendFollowUp = async (userQuery: string) => {
    if (!currentResult) return;
    setIsSendingFollowUp(true);

    const userMsg: FollowUpMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text: userQuery,
      timestamp: Date.now(),
    };

    const updatedFollowUps = [...(currentResult.followUps || []), userMsg];
    setCurrentResult((prev) => (prev ? { ...prev, followUps: updatedFollowUps } : null));

    try {
      const res = await fetch('/api/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionContext: currentResult.questionSummary,
          previousAnswer: currentResult.directAnswer,
          userFollowUp: userQuery,
        }),
      });

      const json = await res.json();
      if (json.success && json.explanation) {
        const assistantMsg: FollowUpMessage = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          text: json.explanation,
          timestamp: Date.now(),
        };

        const finalFollowUps = [...updatedFollowUps, assistantMsg];
        setCurrentResult((prev) =>
          prev ? { ...prev, followUps: finalFollowUps } : null
        );

        // Update in history as well
        setHistory((prev) =>
          prev.map((item) =>
            item.id === currentResult.id ? { ...item, followUps: finalFollowUps } : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  // Essay Actions
  const handleRunEssayAction = async (action: string, essayText: string) => {
    try {
      const res = await fetch('/api/essay-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: essayText,
          action,
          targetWords: essayOptions.words,
          academicTone: essayOptions.level,
        }),
      });

      const json = await res.json();
      if (json.success && json.resultText) {
        return json.resultText;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleToggleBookmark = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
    if (currentResult && currentResult.id === id) {
      setCurrentResult((prev) =>
        prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null
      );
    }
  };

  const handleDeleteOne = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (currentResult && currentResult.id === id) {
      setCurrentResult(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all saved questions from your Study Bank?')) {
      setHistory([]);
      setCurrentResult(null);
    }
  };

  // Render camouflage views if active
  if (stealthTheme === 'google_docs') {
    return (
      <StealthGoogleDocs
        result={currentResult}
        onExitStealth={() => setStealthTheme('none')}
      />
    );
  }

  if (stealthTheme === 'wikipedia') {
    return (
      <StealthWikipedia
        result={currentResult}
        onExitStealth={() => setStealthTheme('none')}
      />
    );
  }

  if (stealthTheme === 'canvas_lms') {
    return (
      <StealthCanvasLMS
        result={currentResult}
        onExitStealth={() => setStealthTheme('none')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background radial gradients for sleek aesthetics */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <Navbar
        activeMode={mode}
        setActiveMode={setMode}
        stealthTheme={stealthTheme}
        setStealthTheme={setStealthTheme}
        ghostMode={ghostMode}
        setGhostMode={setGhostMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onOpenHelp={() => setIsHelpOpen(true)}
        onPanic={() => setStealthTheme('google_docs')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 space-y-6">
        {/* Hero Header / Quick Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Instant Academic & Quiz Engine</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                IXL & Canvas Optimized
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Paste questions, screenshots, or equations for immediate verified answers and derivations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-emerald-400 font-semibold">Gemini 3.1 Flash-Lite (Ultra-Fast • Low Demand)</span>
          </div>
        </div>

        {/* Primary Problem Input Block */}
        <ProblemInput
          text={text}
          setText={setText}
          imageBase64={imageBase64}
          setImageBase64={setImageBase64}
          mode={mode}
          setMode={setMode}
          subjectHint={subjectHint}
          setSubjectHint={setSubjectHint}
          isLoading={isLoading}
          onSolve={handleSolve}
          onOpenCrop={() => setIsCropOpen(true)}
          essayOptions={essayOptions}
          setEssayOptions={setEssayOptions}
        />

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-100">Solver Encountered an Error</p>
              <p className="text-rose-300/90 text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="h-5 w-48 bg-slate-800 rounded" />
            <div className="h-16 w-full bg-slate-800/80 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-slate-800 rounded" />
              <div className="h-4 w-1/2 bg-slate-800 rounded" />
            </div>
          </div>
        )}

        {/* Active Solution Results Display */}
        {currentResult && !isLoading && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Instant Answer Key Card */}
            <InstantAnswerCard
              result={currentResult}
              ghostMode={ghostMode}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* Math Graph Visualizer (if function detected or mode === math) */}
            {(currentResult.graphFunction || mode === 'math') && (
              <MathGraphCard
                functionString={currentResult.graphFunction || 'x^2 - 4'}
                directAnswer={currentResult.directAnswer}
              />
            )}

            {/* Essay & Writing Workshop (if essay drafted) */}
            {currentResult.essayDraft && (
              <EssayDraftCard
                essay={currentResult.essayDraft}
                onRunEssayAction={handleRunEssayAction}
              />
            )}

            {/* Step-by-Step Breakdown (if steps available and not just pure instant) */}
            {currentResult.steps && currentResult.steps.length > 0 && (
              <StepByStepCard
                steps={currentResult.steps}
                keyFormulaOrRule={currentResult.keyFormulaOrRule}
              />
            )}

            {/* Follow-up Clarification Chat */}
            <FollowUpChat
              messages={currentResult.followUps || []}
              onSendMessage={handleSendFollowUp}
              isSending={isSendingFollowUp}
            />
          </div>
        )}

        {/* Empty State / Welcome Guide when no question has been solved yet */}
        {!currentResult && !isLoading && (
          <div className="py-10 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 p-8">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-200">
              Ready for Instant Academic Acceleration
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Paste any quiz question above or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Ctrl+V</kbd> to upload a screenshot.
              Toggle Stealth Mode with <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Esc</kbd> anytime.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-semibold text-amber-400 block mb-1">
                  ⚡ IXL & Quiz Speed Key
                </span>
                <p className="text-[11px] text-slate-400">
                  Calculates the exact minimal answer string and option letter to paste directly into test forms.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-semibold text-cyan-400 block mb-1">
                  🧮 Math & Coordinate Lab
                </span>
                <p className="text-[11px] text-slate-400">
                  Step-by-step factoring, derivations, and interactive 2D function coordinate plotting.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-semibold text-purple-400 block mb-1">
                  ✍️ Academic Essay Builder
                </span>
                <p className="text-[11px] text-slate-400">
                  Generates thesis statements, structured arguments, and vocabulary enhancement.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500 z-10">
        <p>
          OmniStudy AI • Powered by Gemini 3.1 Flash-Lite • Ultra-Fast, Low Demand & Stealth Capable
        </p>
      </footer>

      {/* Modals & Drawers */}
      {imageBase64 && (
        <ImageCropModal
          imageSrc={imageBase64}
          isOpen={isCropOpen}
          onClose={() => setIsCropOpen(false)}
          onCropComplete={(cropped) => setImageBase64(cropped)}
        />
      )}

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => setCurrentResult(item)}
        onClearHistory={handleClearHistory}
        onToggleBookmark={handleToggleBookmark}
        onDeleteOne={handleDeleteOne}
      />

      <DiscretionSettingsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        ghostMode={ghostMode}
        setGhostMode={setGhostMode}
      />
    </div>
  );
}
