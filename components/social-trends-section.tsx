'use client';

import React from 'react';
import { getSocialTrendForMatch, SocialTrend } from '../lib/social-trends';
import { Flame, MessageCircle, Heart, Share2, Music, Volume2, Radio } from 'lucide-react';

interface SocialTrendsProps {
  matchId?: string;
}

export const SocialTrendsSection: React.FC<SocialTrendsProps> = ({ matchId = 'm1' }) => {
  const trend = getSocialTrendForMatch(matchId);

  return (
    <div className="p-4 rounded-2xl bg-panel border border-white/10 space-y-3 font-mono text-xs shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-white text-xs block">MATCH SOCIAL TRENDS & FAN HYPE</span>
            <span className="text-[10px] text-gray-400">Live X (Twitter), TikTok & Reddit Commentary</span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded bg-gold/20 text-gold font-extrabold text-[10px] border border-gold/40">
          {trend.hashtag} ({trend.postCount})
        </span>
      </div>

      {/* Fan Sentiment Barometer */}
      <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-stadiumGreen">POSITIVE HYPE ({trend.positiveSentimentPercent}%)</span>
          <span className="text-gray-400">MATCH SENTIMENT</span>
          <span className="text-crimson">TENSION ({100 - trend.positiveSentimentPercent}%)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-800 flex overflow-hidden">
          <div style={{ width: `${trend.positiveSentimentPercent}%` }} className="bg-stadiumGreen shadow-sm shadow-stadiumGreen/50"></div>
          <div style={{ width: `${100 - trend.positiveSentimentPercent}%` }} className="bg-crimson"></div>
        </div>
      </div>

      {/* Trending Hashtag Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
        <span className="text-[10px] text-gray-400 font-bold uppercase">TRENDING:</span>
        {trend.trendingTopics.map((topic, idx) => (
          <span key={idx} className="px-2.5 py-1 rounded-lg bg-panel border border-stadiumGreen/30 text-stadiumGreen font-bold text-[10px] hover:bg-stadiumGreen/20 transition-all cursor-pointer">
            {topic}
          </span>
        ))}
      </div>

      {/* Live Sample Social Posts */}
      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
        {trend.samplePosts.map((post, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-gold">{post.author} ({post.platform})</span>
              <span className="text-stadiumGreen font-bold flex items-center space-x-1">
                <Heart className="w-3 h-3 text-crimson fill-current" />
                <span>{post.likes}</span>
              </span>
            </div>
            <p className="text-gray-200 font-sans text-[11px]">{post.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
