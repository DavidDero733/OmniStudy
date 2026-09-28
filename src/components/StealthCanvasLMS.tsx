import React, { useState } from 'react';
import {
  GraduationCap,
  EyeOff,
  Home,
  CheckCircle,
  FileQuestion,
  Book,
  Calendar,
  Inbox,
  Copy,
  Check,
} from 'lucide-react';
import { SolutionResult } from '../types';

interface StealthCanvasLMSProps {
  result: SolutionResult | null;
  onExitStealth: () => void;
}

export const StealthCanvasLMS: React.FC<StealthCanvasLMSProps> = ({
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
    <div className="min-h-screen bg-[#f5f5f5] text-slate-800 font-sans flex select-text">
      {/* Canvas Red/Dark Left Global Nav */}
      <aside className="w-16 bg-[#2d3b45] flex flex-col items-center py-4 text-slate-300 gap-6 select-none flex-shrink-0">
        <div className="h-10 w-10 bg-[#e02424] rounded-lg flex items-center justify-center text-white shadow">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-white">
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Dashboard</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-white">
          <Book className="h-5 w-5" />
          <span className="text-[10px]">Courses</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-white">
          <Calendar className="h-5 w-5" />
          <span className="text-[10px]">Calendar</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-white">
          <Inbox className="h-5 w-5" />
          <span className="text-[10px]">Inbox</span>
        </div>
      </aside>

      {/* Course Subnav */}
      <div className="w-44 bg-white border-r border-slate-200 py-6 px-4 hidden md:block select-none flex-shrink-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Fall Semester
        </p>
        <p className="text-sm font-bold text-slate-900 mb-6 truncate">
          {result?.subject || 'MATH 101'} • Section 04
        </p>
        <nav className="space-y-1 text-xs">
          <div className="px-2 py-1.5 rounded font-semibold text-[#008ee2] bg-blue-50">
            Home / Modules
          </div>
          <div className="px-2 py-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer">
            Assignments
          </div>
          <div className="px-2 py-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer">
            Quizzes & Tests
          </div>
          <div className="px-2 py-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer">
            Grades
          </div>
          <div className="px-2 py-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer">
            Syllabus
          </div>
        </nav>
      </div>

      {/* Main Canvas Page Area */}
      <main className="flex-1 flex flex-col">
        {/* Breadcrumb Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span className="text-[#008ee2] hover:underline cursor-pointer">
              {result?.subject || 'Academic Course'}
            </span>
            <span>&gt;</span>
            <span className="text-[#008ee2] hover:underline cursor-pointer">Modules</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-900">
              Module 3: Practice Problem Assessment
            </span>
          </div>

          <div className="flex items-center gap-2">
            {result && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Key: ' + (result.quickCopy || result.directAnswer)}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExitStealth}
              className="text-xs px-3 py-1 rounded bg-[#2d3b45] text-white hover:bg-slate-700 font-medium"
            >
              <EyeOff className="h-3 w-3 inline mr-1" />
              Exit [Esc]
            </button>
          </div>
        </header>

        {/* Content Box */}
        <div className="p-6 max-w-4xl mx-auto w-full">
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Unit Assignment: Diagnostic Question Review
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Due Oct 15 at 11:59pm • 10 Points • Immediate Submission
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                Active Review
              </span>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <p className="font-bold text-slate-700 mb-1">Assigned Problem Statement:</p>
                  <p className="text-slate-800 font-sans text-sm leading-relaxed">
                    {result.questionSummary}
                  </p>
                </div>

                {/* Disguised Answer Key */}
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-900 uppercase block">
                      Target Solution Formulation:
                    </span>
                    <span className="text-base font-bold text-blue-950 font-mono">
                      {result.directAnswer}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Minimal Input</span>
                    <code className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                      {result.quickCopy}
                    </code>
                  </div>
                </div>

                {/* Step Breakdown */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Grading Rubric & Step Solution:
                  </h3>
                  {result.steps.map((st) => (
                    <div key={st.stepNumber} className="border-l-2 border-slate-300 pl-3">
                      <p className="text-xs font-semibold text-slate-800">
                        {st.stepNumber}. {st.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{st.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-600 py-6 text-center">
                <FileQuestion className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p>No active assessment problem loaded.</p>
                <p className="text-[11px] text-slate-400 mt-1">Press Esc to return to solver.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
