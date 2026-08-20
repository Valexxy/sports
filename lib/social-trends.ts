export interface SocialTrend {
  matchId: string;
  hashtag: string;
  postCount: string;
  positiveSentimentPercent: number;
  trendingTopics: string[];
  samplePosts: { author: string; platform: 'X' | 'TIKTOK' | 'REDDIT'; text: string; likes: string }[];
}

export const MOCK_SOCIAL_TRENDS: { [matchId: string]: SocialTrend } = {
  m1: {
    matchId: 'm1',
    hashtag: '#ARSCHE',
    postCount: '48.5K Posts',
    positiveSentimentPercent: 88,
    trendingTopics: ['#SakaGoal', '#HavertzHeader', '#LondonDerby', '#EmiratesAtmosphere'],
    samplePosts: [
      { author: '@GunnerTalk', platform: 'X', text: 'Emirates is rocking tonight! Saka curling goal was absolute perfection! 🔥🔴', likes: '3.4k' },
      { author: '@BluesDaily', platform: 'TIKTOK', text: 'Palmer penalty keeps us in the game! Need more intensity in 2nd half 🔵', likes: '1.8k' },
      { author: '@PremierLeagueReddit', platform: 'REDDIT', text: 'Havertz header timing was insane. High pressing strategy working perfectly for Arsenal.', likes: '940' },
    ],
  },
  m2: {
    matchId: 'm2',
    hashtag: '#RMAFCB',
    postCount: '92.1K Posts',
    positiveSentimentPercent: 94,
    trendingTopics: ['#ElClasico', '#BernabeuMagic', '#MbappeDebut', '#UCLMatchday'],
    samplePosts: [
      { author: '@MadridistaWorld', platform: 'X', text: 'Bernabéu lights are on! Champions League night under the roof! ⚪👑', likes: '8.9k' },
      { author: '@BayernFanatic', platform: 'REDDIT', text: 'Crucial midfield battle tonight. Kane vs Rudiger is going to be epic.', likes: '2.1k' },
    ],
  },
};

export function getSocialTrendForMatch(matchId: string): SocialTrend {
  return MOCK_SOCIAL_TRENDS[matchId] || {
    matchId,
    hashtag: '#LiveMatch',
    postCount: '12.4K Posts',
    positiveSentimentPercent: 82,
    trendingTopics: ['#Matchday', '#StadiumVibes', '#TopPick'],
    samplePosts: [
      { author: '@MatchFanatic', platform: 'X', text: 'Stadium atmosphere is electric! ⚽', likes: '450' },
    ],
  };
}
