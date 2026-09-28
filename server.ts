import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

// Generous payload limit for high-resolution screenshot uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Server-side Gemini client with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary Solve Endpoint
app.post('/api/solve', async (req: Request, res: Response) => {
  try {
    const {
      text,
      imageBase64,
      imageMime = 'image/png',
      mode = 'instant', // 'instant' | 'step_by_step' | 'math' | 'essay'
      subjectHint = 'auto',
      essayOptions = {},
    } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({ error: 'Please provide either question text or a screenshot.' });
    }

    const contents: any[] = [];

    // Multimodal image part
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: imageMime,
          data: base64Data,
        },
      });
    }

    let instruction = `You are OmniStudy, the world's most capable, lightning-fast academic solver and tutor.
Your job is to read the question carefully (whether from the screenshot image OCR or pasted text) and provide the authoritative, 100% correct academic answer.
Specialize in IXL exercises, AP exams, SAT/ACT, Canvas/Google Forms/Blackboard quizzes, university STEM, and analytical writing.

Subject Hint: ${subjectHint || 'Auto-detect'}
User Request / Question Text: ${text || 'Please solve the problem in the attached screenshot.'}
Mode: ${mode}

Instructions by Mode:
- If mode is 'instant': Provide the direct final answer immediately (e.g. "B", "x = 7/2", "Photosynthesis"). The quickCopy MUST be the exact minimum string to paste into the homework/IXL input box without extraneous words.
- If mode is 'step_by_step': Provide the direct answer first, followed by clear, numbered step-by-step breakdown explaining WHY it is correct and how to solve it yourself.
- If mode is 'math': Ensure algebraic rigor. Identify the formula, show equation steps, isolate variables, provide final answer, and if suitable, provide a 2D math function string for plotting.
- If mode is 'essay': Produce a high-quality academic draft with clear thesis, structured paragraphs, rich vocabulary, and appropriate tone (${essayOptions.level || 'High School/College'}, style: ${essayOptions.style || 'Analytical'}, target length: ${essayOptions.words || '300-500 words'}).

Always respond strictly in JSON matching the requested schema.`;

    if (mode === 'essay') {
      instruction += `\nFor essay mode, fill in the essayDraft object with title, thesis, bodyParagraphs, conclusion, and wordCount.`;
    }

    const modelToUse = 'gemini-3.1-flash-lite';

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: { parts: contents },
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        systemInstruction: `You are an expert academic solver and tutor. Always produce valid JSON matching the schema. Be accurate, fast, and ensure answers to multiple choice questions identify the exact correct choice. For IXL problems, pay extra attention to formatting rules (e.g., simplest fraction, correct units).`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: 'Subject classification, e.g. Mathematics, Biology, US History' },
            questionSummary: { type: Type.STRING, description: 'Clean transcription/summary of the question extracted from text or OCR' },
            questionType: {
              type: Type.STRING,
              description: 'Type of question: multiple_choice, numerical, fill_in_blank, true_false, short_answer, essay_writing, or graphing',
            },
            directAnswer: { type: Type.STRING, description: 'Direct, clear solution answer (e.g., "B) 48 cm²" or "x = -3, 5")' },
            quickCopy: { type: Type.STRING, description: 'Minimalist string ready to paste straight into an online quiz or IXL box' },
            selectedOptionLetter: { type: Type.STRING, description: 'Letter choice if multiple choice (A, B, C, D, etc.), else empty' },
            optionsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of detected multiple choice options if any',
            },
            confidence: { type: Type.STRING, description: 'Confidence assessment, e.g. "99% High Confidence"' },
            keyFormulaOrRule: { type: Type.STRING, description: 'Core theorem, formula, or law used' },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  mathLatex: { type: Type.STRING },
                },
                required: ['stepNumber', 'title', 'content'],
              },
              description: 'Numbered steps to solve the problem',
            },
            graphFunction: { type: Type.STRING, description: 'Math expression for plotting if relevant, e.g. "x^2 - 4x + 3"' },
            ixlTip: { type: Type.STRING, description: 'Helpful formatting or strategy tip for IXL/quizzes' },
            commonMistakes: { type: Type.STRING, description: 'A common pitfall or trap students fall into on this question' },
            essayDraft: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                thesis: { type: Type.STRING },
                bodyParagraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
                conclusion: { type: Type.STRING },
                wordCount: { type: Type.INTEGER },
                academicLevel: { type: Type.STRING },
              },
            },
          },
          required: ['subject', 'questionSummary', 'questionType', 'directAnswer', 'quickCopy', 'confidence', 'steps'],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText);

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error solving academic query:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to process academic query. Please try again.',
    });
  }
});

// Follow-up Clarification Endpoint (Ask a question about the previous solution)
app.post('/api/clarify', async (req: Request, res: Response) => {
  try {
    const { questionContext, previousAnswer, userFollowUp } = req.body;

    if (!userFollowUp) {
      return res.status(400).json({ error: 'Follow-up question is required.' });
    }

    const prompt = `You are OmniStudy, the student's personal academic tutor.
Original Question: ${questionContext}
Our Previous Solution: ${previousAnswer}
Student's Follow-up Question / Doubt: ${userFollowUp}

Provide a direct, patient, crystal-clear explanation answering the student's doubt.
Keep it encouraging, pedagogically sound, and straightforward. Include formatted equations or examples if helpful.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        systemInstruction: 'You are a warm, brilliant academic tutor specializing in unblocking students with gentle, intuitive explanations.',
      },
    });

    return res.json({
      success: true,
      explanation: response.text || 'Unable to generate clarification.',
    });
  } catch (error: any) {
    console.error('Error clarifying question:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate clarification.',
    });
  }
});

// Essay Polish & Transform Endpoint
app.post('/api/essay-action', async (req: Request, res: Response) => {
  try {
    const { text, action, targetWords, academicTone } = req.body;

    const prompts: Record<string, string> = {
      expand: `Expand the following academic text by elaborating on evidence, adding nuance, and strengthening analytical commentary. Target word count: approximately ${targetWords || 'longer'}.`,
      concise: `Make the following text more concise, eliminating fluff and filler words while preserving every key argument and thesis.`,
      elevate_vocab: `Elevate the academic diction, rhetorical quality, and transitions in this text to high-level scholarly prose without sounding artificial.`,
      counterargument: `Add a well-reasoned counterargument paragraph followed by a rebuttal to fortify the central thesis.`,
      plagiarism_safe_paraphrase: `Rewrite this passage in an original academic voice with fresh sentence structures, maintaining factual integrity.`,
    };

    const actionPrompt = prompts[action] || prompts.elevate_vocab;

    const fullPrompt = `${actionPrompt}
Academic Tone: ${academicTone || 'College Prep / Honors'}

Original Text:
"""
${text}
"""

Return the revised text clearly formatted.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: fullPrompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        systemInstruction: 'You are an award-winning academic writing coach and editor. Deliver refined, natural academic writing.',
      },
    });

    return res.json({
      success: true,
      resultText: response.text || '',
    });
  } catch (error: any) {
    console.error('Error processing essay action:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to transform essay text.',
    });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'OmniStudy AI Academic Engine' });
});

// Mount Vite or static dist
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`OmniStudy AI Server running on http://0.0.0.0:${port}`);
  });
}

if (!process.env.VERCEL) {
  setupServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}

export default app;
