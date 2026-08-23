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
      text: '⚡ **Yo! I am Aura AI**, your high-stakes quantitative copilot. Ask me to "build a 3x banker slip", "find safest bet today", or "analyze Arsenal vs Chelsea"!',
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
        <span className="font-extrabold text-sm hidden sm:inline text-black">ASK AURA AI</span>
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
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-1">
                  <span>AURA AI COPILOT</span>
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                </h3>
                <span className="text-[10px] text-stadiumGreen font-mono">100% Free Gemini 1.5 Engine</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3.5 max-h-[400px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[88%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-stadiumGreen text-black font-semibold rounded-br-none'
                      : 'bg-panel border border-white/10 text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {m.recommendedBet && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/40 text-xs">
                      <span className="text-[10px] font-mono text-stadiumGreen block font-bold">🎯 AI PICK RECOMMENDATION</span>
                      <span className="font-extrabold text-white block mt-0.5">{m.recommendedBet.selection}</span>
                      <span className="text-gold font-mono font-bold block mt-0.5">Odds: {m.recommendedBet.odds} | Confidence: {m.recommendedBet.confidence}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-xs text-stadiumGreen font-mono animate-pulse">
                <Bot className="w-4 h-4" />
                <span>Aura AI is crunching 10,000 match simulations...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-panel border-t border-white/10 flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="e.g. build 3x banker slip..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-xl bg-stadiumGreen text-black font-bold hover:scale-105 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
