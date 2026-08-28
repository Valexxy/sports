'use client';
import React, { useState } from 'react';
import { askAuraAICopilot, AICopilotResponse } from '../lib/gemini-ai';
import { MatchData } from '../lib/sports-api';
import { Bot, Send, Sparkles, X } from 'lucide-react';

interface CopilotProps {
  matches: MatchData[];
}

export const AICopilot: React.FC<CopilotProps> = ({ matches }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; recommendedBet?: any }[]>([
    {
      sender: 'ai',
      text: '⚡ **Welcome to Mivaj Match Copilot!** Your quantitative match assistant. Ask me to "build a 3x banker slip", "find safest bet today", or "analyze Arsenal vs Chelsea"!',
    },
  ]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    
    const userMsg = query;
    setQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res: AICopilotResponse = await askAuraAICopilot(userMsg, matches);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.answer, recommendedBet: res.recommendedBet }]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Error analyzing markets. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-stadiumGreen via-cyberPurple to-gold text-black font-extrabold shadow-2xl shadow-stadiumGreen/40 hover:scale-110 transition-all flex items-center space-x-2 border-2 border-black"
      >
        <Bot className="w-6 h-6 text-black" />
        <span className="font-extrabold text-sm hidden sm:inline text-black">MIVAJ COPILOT</span>
      </button>

      {/* Chat Drawer */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[600px] glass-panel rounded-2xl border border-stadiumGreen/40 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="p-3.5 bg-panel border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-stadiumGreen/20 border border-stadiumGreen/40 flex items-center justify-center text-stadiumGreen font-bold">
                ⚡
              </div>
              <div>
                <h3 className="font-black text-white text-xs">MIVAJ MATCH COPILOT</h3>
                <span className="text-[9px] text-stadiumGreen font-bold block">Quantitative Match Intelligence</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono text-xs max-h-[400px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 ml-auto max-w-[85%]'
                    : 'bg-black/60 text-gray-200 border border-white/10 mr-auto max-w-[90%]'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
              </div>
            ))}
            {loading && (
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-gray-400 text-xs animate-pulse">
                Analyzing live odds &amp; Poisson distributions...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-panel border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Mivaj Copilot..."
              className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen"
            />
            <button
              onClick={handleSend}
              className="px-3.5 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
