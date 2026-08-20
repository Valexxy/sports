'use client';

import React, { useState } from 'react';
import { X, MessageSquare, ThumbsUp, Send, Zap } from 'lucide-react';

interface ForumModalProps {
  onClose: () => void;
}

export const StadiumForumModal: React.FC<ForumModalProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'PREVIEWS' | 'BANKERS' | 'TRANSFERS'>('PREVIEWS');
  const [newPostText, setNewPostText] = useState('');
  const [posts, setPosts] = useState([
    { id: '1', author: '@OracleMaster', badge: 'CHAMPION 👑', category: 'PREVIEWS', text: 'Arsenal vs Chelsea: Arsenal high press xG is averaging 2.15 goals at Emirates. Over 1.5 Goals is locked!', upvotes: 42, timeAgo: '15m ago' },
    { id: '2', author: '@NPFLFanatic', badge: 'PRO ⚡', category: 'BANKERS', text: 'Enyimba FC home win @ 1.35 is the banker of the day! Unbeaten in 8 games in Aba.', upvotes: 28, timeAgo: '45m ago' },
    { id: '3', author: '@NBASniper', badge: 'PRO ⚡', category: 'PREVIEWS', text: 'Celtics 3pt percentage in Q3 is ridiculous! Over 215.5 total points hit easily.', upvotes: 19, timeAgo: '2h ago' },
  ]);

  const handleUpvote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    setPosts((prev) => [
      {
        id: Date.now().toString(),
        author: '@You',
        badge: 'PRO ⚡',
        category: activeCategory,
        text: newPostText,
        upvotes: 1,
        timeAgo: 'Just now',
      },
      ...prev,
    ]);
    setNewPostText('');
  };

  const filteredPosts = posts.filter((p) => p.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <MessageSquare className="w-6 h-6 text-stadiumGreen" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white">PUBLIC STADIUM FORUM 💬</h2>
            <p className="text-xs text-gray-400 font-mono">Open Community Debate & Match Strategy (100% Public)</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 border-b border-white/10 pb-3 mb-4 font-mono text-xs overflow-x-auto">
          {(['PREVIEWS', 'BANKERS', 'TRANSFERS'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-stadiumGreen text-black shadow-md'
                  : 'bg-panel text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {cat === 'PREVIEWS' && '⚽ Match Previews'}
              {cat === 'BANKERS' && '👑 Daily Banker Slips'}
              {cat === 'TRANSFERS' && '🔥 Transfer Debate'}
            </button>
          ))}
        </div>

        {/* Create Public Forum Post */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
            placeholder={`Share public analysis in ${activeCategory}...`}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-stadiumGreen"
          />
          <button
            onClick={handleCreatePost}
            className="px-4 py-2.5 rounded-xl bg-stadiumGreen text-black font-extrabold text-xs hover:scale-105 transition-all flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
            <span>Post</span>
          </button>
        </div>

        {/* Public Posts Feed */}
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 font-mono text-xs">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-3.5 rounded-2xl bg-panel border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-white text-xs">{post.author}</span>
                  <span className="px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold">
                    {post.badge}
                  </span>
                </div>
                <span className="text-gray-500">{post.timeAgo}</span>
              </div>

              <p className="text-gray-200 font-sans text-xs leading-relaxed">{post.text}</p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center space-x-1 text-stadiumGreen hover:scale-105 transition-all font-bold"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Upvote ({post.upvotes})</span>
                </button>
                <span className="text-gray-500 text-[10px]">Public Thread</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
