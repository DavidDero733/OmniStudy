export type SolvingMode = 'instant' | 'step_by_step' | 'math' | 'essay';

export type StealthTheme = 'none' | 'google_docs' | 'wikipedia' | 'canvas_lms';

export interface SolutionStep {
  stepNumber: number;
  title: string;
  content: string;
  mathLatex?: string;
}

export interface EssayDraft {
  title: string;
  thesis: string;
  bodyParagraphs: string[];
  conclusion: string;
  wordCount: number;
  academicLevel: string;
}

export interface FollowUpMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface SolutionResult {
  id: string;
  timestamp: number;
  subject: string;
  questionSummary: string;
  questionType: 'multiple_choice' | 'numerical' | 'fill_in_blank' | 'true_false' | 'short_answer' | 'essay_writing' | 'graphing';
  directAnswer: string;
  quickCopy: string;
  selectedOptionLetter?: string;
  optionsDetected?: string[];
  confidence: string;
  keyFormulaOrRule?: string;
  steps: SolutionStep[];
  graphFunction?: string;
  ixlTip?: string;
  commonMistakes?: string;
  essayDraft?: EssayDraft;
  rawQuestionText?: string;
  imageSnapshot?: string;
  isBookmarked?: boolean;
  followUps?: FollowUpMessage[];
}

export interface PresetProblem {
  id: string;
  title: string;
  badge: string;
  mode: SolvingMode;
  subject: string;
  text: string;
  image?: string;
}
