import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';
import { FollowUpMessage } from '../types';

interface FollowUpChatProps {
  messages: FollowUpMessage[];
  onSendMessage: (query: string) => Promise<void>;
  isSending: boolean;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({
  messages,
  onSendMessage,
  isSending,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    const q = input.trim();
    setInput('');
    await onSendMessage(q);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <MessageSquare className="h-5 w-5 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-sm sm:text-base">
          Academic Tutor Follow-up
        </h3>
        <span className="text-xs text-slate-400">
          Ask for simpler explanations or edge cases
        </span>
      </div>

      {/* Message History */}
      <div className="mt-3 space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            <Sparkles className="h-5 w-5 mx-auto mb-1 text-slate-600" />
            <p>Have a question about this solution? Ask below!</p>
            <p className="text-[11px] text-slate-600 mt-1">
              e.g. "Can you simplify step 2?", "Why is option C incorrect?"
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="h-6 w-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="h-6 w-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isSending && (
          <div className="flex gap-2.5 items-center text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 w-fit">
            <div className="h-3 w-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
            <span>Tutor is thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a clarifying question about this solution..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className={`p-2 rounded-xl text-white transition-all ${
            !input.trim() || isSending
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
