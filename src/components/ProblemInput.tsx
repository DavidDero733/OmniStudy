import React, { useState, useRef, useEffect, DragEvent } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  Crop,
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  Calculator,
  PenTool,
  ClipboardPaste,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { SolvingMode, PresetProblem } from '../types';
import { SAMPLE_PRESETS } from '../sampleData';

interface ProblemInputProps {
  text: string;
  setText: (t: string) => void;
  imageBase64: string | null;
  setImageBase64: (img: string | null) => void;
  mode: SolvingMode;
  setMode: (m: SolvingMode) => void;
  subjectHint: string;
  setSubjectHint: (s: string) => void;
  isLoading: boolean;
  onSolve: () => void;
  onOpenCrop: () => void;
  essayOptions: {
    words: number;
    level: string;
    style: string;
  };
  setEssayOptions: React.Dispatch<
    React.SetStateAction<{
      words: number;
      level: string;
      style: string;
    }>
  >;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  text,
  setText,
  imageBase64,
  setImageBase64,
  mode,
  setMode,
  subjectHint,
  setSubjectHint,
  isLoading,
  onSolve,
  onOpenCrop,
  essayOptions,
  setEssayOptions,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Global clipboard listener for instant Ctrl+V screenshot pasting anywhere
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  setImageBase64(event.target.result as string);
                }
              };
              reader.readAsDataURL(file);
              // don't preventDefault if typing in textarea unless it's pure image
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [setImageBase64]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setImageBase64(ev.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageBase64(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadPreset = (preset: PresetProblem) => {
    setText(preset.text);
    setMode(preset.mode);
    setSubjectHint(preset.subject);
    setImageBase64(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && (text.trim() || imageBase64)) {
        onSolve();
      }
    }
  };

  return (
    <div className="w-full">
      {/* Primary Input Container with glass morphism */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border transition-all duration-200 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 shadow-2xl ${
          isDragging
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-950/20'
            : 'border-slate-800 hover:border-slate-700/80 focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20'
        }`}
      >
        {/* Mode Selector and Quick Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMode('instant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                mode === 'instant'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>Instant Key</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('step_by_step')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                mode === 'step_by_step'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
              <span>Step-by-Step</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('math')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                mode === 'math'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="h-3.5 w-3.5 text-cyan-400" />
              <span>Math Lab</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('essay')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                mode === 'essay'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PenTool className="h-3.5 w-3.5 text-purple-400" />
              <span>Essay</span>
            </button>
          </div>

          {/* Subject Hint Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Subject:</span>
            <select
              value={subjectHint}
              onChange={(e) => setSubjectHint(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="auto">Auto-Detect Subject</option>
              <option value="ixl_math">IXL Math / Geometry</option>
              <option value="algebra">Algebra & Calculus</option>
              <option value="physics">Physics & Engineering</option>
              <option value="chemistry">Chemistry & Organic</option>
              <option value="biology">Biology & Medicine</option>
              <option value="history">History & Social Studies</option>
              <option value="english">Literature & Grammar</option>
            </select>
          </div>
        </div>

        {/* Textarea Input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'instant'
                ? 'Paste quiz question, multiple choice options (A/B/C/D), or IXL prompt here... (Ctrl+V anywhere to paste screenshot)'
                : mode === 'essay'
                ? 'Enter your essay topic, thesis prompt, reading excerpt, or essay requirements...'
                : mode === 'math'
                ? 'Enter math equation, function (e.g. 3x^2 - 10x - 8 = 0), or geometry problem...'
                : 'Paste homework question, word problem, or exercise...'
            }
            rows={4}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base leading-relaxed focus:outline-none resize-y min-h-[90px] max-h-[320px] font-sans"
          />
        </div>

        {/* Image Attachment Preview */}
        {imageBase64 && (
          <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-indigo-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0">
                <img
                  src={imageBase64}
                  alt="Screenshot question"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    Screenshot Attached
                  </p>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ready for instant OCR and reasoning
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onOpenCrop}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-medium transition-all"
                title="Crop question area to isolate the exercise"
              >
                <Crop className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Crop Area</span>
              </button>
              <button
                type="button"
                onClick={() => setImageBase64(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-all"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Essay Controls Bar (if essay mode) */}
        {mode === 'essay' && (
          <div className="mt-3 p-3 bg-purple-950/20 rounded-xl border border-purple-900/40 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Words</label>
              <select
                value={essayOptions.words}
                onChange={(e) =>
                  setEssayOptions((prev) => ({ ...prev, words: Number(e.target.value) }))
                }
                className="w-full bg-slate-950 border border-purple-900/60 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
              >
                <option value={250}>~250 words (Single paragraph / Short)</option>
                <option value={450}>~450 words (Standard 5-paragraph)</option>
                <option value={750}>~750 words (Extended Analytical)</option>
                <option value={1200}>~1200 words (Research Paper Draft)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Academic Level</label>
              <select
                value={essayOptions.level}
                onChange={(e) =>
                  setEssayOptions((prev) => ({ ...prev, level: e.target.value }))
                }
                className="w-full bg-slate-950 border border-purple-900/60 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
              >
                <option value="High School Honors">High School Honors</option>
                <option value="AP / IB Diploma">AP / IB Diploma</option>
                <option value="Undergraduate College">Undergraduate College</option>
                <option value="Graduate / Scholarly">Graduate / Scholarly</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Writing Style</label>
              <select
                value={essayOptions.style}
                onChange={(e) =>
                  setEssayOptions((prev) => ({ ...prev, style: e.target.value }))
                }
                className="w-full bg-slate-950 border border-purple-900/60 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
              >
                <option value="Analytical & Evidence-Based">Analytical & Evidence-Based</option>
                <option value="Argumentative & Persuasive">Argumentative & Persuasive</option>
                <option value="Expository & Explanatory">Expository & Explanatory</option>
                <option value="Narrative Reflection">Narrative Reflection</option>
              </select>
            </div>
          </div>
        )}

        {/* Bottom Toolbar & Action */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-medium transition-all"
              title="Upload question screenshot or photo"
            >
              <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
              <span>Attach Screenshot</span>
            </button>

            <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <ClipboardPaste className="h-3 w-3 text-slate-500" />
              <span>Paste image anytime with Ctrl+V</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">Ctrl+Enter</kbd>
            </span>

            <button
              type="button"
              disabled={isLoading || (!text.trim() && !imageBase64)}
              onClick={onSolve}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg transition-all ${
                isLoading || (!text.trim() && !imageBase64)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Solving Instantly...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Solve Question</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Example Chips */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
          <Zap className="h-3 w-3 text-amber-400" />
          Quick Test:
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => loadPreset(preset)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] transition-all flex items-center gap-1.5"
          >
            <span className="font-semibold text-slate-300">{preset.badge}:</span>
            <span className="truncate max-w-[160px] sm:max-w-[200px]">{preset.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
