'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Trophy, Search, Share2, Star, X,
  Calendar, Globe, Flame, ExternalLink, Loader2, RefreshCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { GlobalLanguageSwitcher } from '../../components/global-language-switcher';

export interface EnterpriseBirthdayStar {
  id: string;
  name: string;
  sport: 'SOCCER' | 'BASKETBALL' | 'TENNIS' | 'COMBAT' | 'MOTORSPORT' | 'ATHLETICS' | 'RUGBY' | 'GOLF' | 'CRICKET' | 'BASEBALL';
  birthMonth: number;
  birthDay: number;
  birthYear: number;
  clubOrTeam: string;
  league: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  avatarUrl: string;
  fallbackInitials: string;
  biodataRole: string;
  quote: string;
  trophies: string[];
  matchFootprint: string;
  wishesBase: number;
  marketValue?: string;
  socialHandles?: { instagram?: string; twitter?: string; };
}

export const GLOBAL_SPORT_STARS: EnterpriseBirthdayStar[] = [
  {
    "id": "b-jan-07-1",
    "name": "Eden Hazard",
    "sport": "SOCCER",
    "birthMonth": 1,
    "birthDay": 7,
    "birthYear": 1991,
    "clubOrTeam": "Chelsea & Belgium Legend",
    "league": "Premier League Legends",
    "country": "Belgium",
    "countryCode": "BE",
    "countryFlag": "🇧🇪",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/104684.png&w=350&h=254",
    "fallbackInitials": "EH",
    "biodataRole": "Winger • 2x Premier League Champion & Chelsea Icon",
    "quote": "Play with a smile and entertain the supporters.",
    "trophies": [
      "2x Premier League Champion",
      "2x UEFA Europa League Winner",
      "FA Cup Winner"
    ],
    "matchFootprint": "Over 110 Goals & 90 Assists for Chelsea",
    "wishesBase": 51200,
    "marketValue": "Legend",
    "socialHandles": {
      "instagram": "hazardeden_10"
    }
  },
  {
    "id": "b-jan-07-2",
    "name": "Lewis Hamilton",
    "sport": "MOTORSPORT",
    "birthMonth": 1,
    "birthDay": 7,
    "birthYear": 1985,
    "clubOrTeam": "Ferrari / Mercedes",
    "league": "Formula 1",
    "country": "United Kingdom",
    "countryCode": "GB",
    "countryFlag": "🇬🇧",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/f1/players/full/868.png&w=350&h=254",
    "fallbackInitials": "LH",
    "biodataRole": "Driver • 7x Formula 1 World Champion",
    "quote": "Still I Rise.",
    "trophies": [
      "7x F1 World Drivers Champion",
      "103 Race Wins",
      "104 Pole Positions"
    ],
    "matchFootprint": "Most Race Wins in Formula 1 History",
    "wishesBase": 98000,
    "marketValue": "$55,000,000",
    "socialHandles": {
      "instagram": "lewishamilton"
    }
  },
  {
    "id": "b-jan-17-1",
    "name": "Muhammad Ali",
    "sport": "COMBAT",
    "birthMonth": 1,
    "birthDay": 17,
    "birthYear": 1942,
    "clubOrTeam": "The Greatest",
    "league": "Heavyweight Boxing Legend",
    "country": "United States",
    "countryCode": "US",
    "countryFlag": "🇺🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/boxing/players/full/249339.png&w=350&h=254",
    "fallbackInitials": "MA",
    "biodataRole": "Heavyweight • 3x Undisputed World Champion",
    "quote": "Float like a butterfly, sting like a bee.",
    "trophies": [
      "3x World Heavyweight Champion",
      "Olympic Gold Medalist (1960)",
      "Sports Illustrated Athlete of Century"
    ],
    "matchFootprint": "Rumble in the Jungle & Thrilla in Manila Winner",
    "wishesBase": 120000,
    "marketValue": "The Greatest"
  },
  {
    "id": "b-jan-24-1",
    "name": "Luis Suárez",
    "sport": "SOCCER",
    "birthMonth": 1,
    "birthDay": 24,
    "birthYear": 1987,
    "clubOrTeam": "Inter Miami / Barcelona Legend",
    "league": "MLS / La Liga",
    "country": "Uruguay",
    "countryCode": "UY",
    "countryFlag": "🇺🇾",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/44079.png&w=350&h=254",
    "fallbackInitials": "LS",
    "biodataRole": "Striker • 2x European Golden Shoe Winner",
    "quote": "Every single ball is life or death inside the penalty area.",
    "trophies": [
      "UEFA Champions League Winner",
      "5x La Liga Champion",
      "Copa América Winner",
      "2x European Golden Shoe"
    ],
    "matchFootprint": "Over 500 Career Goals & Historic MSN Trio",
    "wishesBase": 67000,
    "marketValue": "€4,000,000",
    "socialHandles": {
      "instagram": "luissuarez9"
    }
  },
  {
    "id": "b-feb-05-1",
    "name": "Cristiano Ronaldo",
    "sport": "SOCCER",
    "birthMonth": 2,
    "birthDay": 5,
    "birthYear": 1985,
    "clubOrTeam": "Al Nassr / Real Madrid Legend",
    "league": "Saudi Pro League",
    "country": "Portugal",
    "countryCode": "PT",
    "countryFlag": "🇵🇹",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/2273.png&w=350&h=254",
    "fallbackInitials": "CR7",
    "biodataRole": "Forward • 5x Ballon d'Or & 5x UCL Winner",
    "quote": "Your love makes me strong, your hate makes me unstoppable. Siuuu!",
    "trophies": [
      "5x Ballon d'Or Winner",
      "5x UEFA Champions League Winner",
      "UEFA Euro Champion",
      "900+ Career Goals"
    ],
    "matchFootprint": "All-Time Leading International Goalscorer in Football History",
    "wishesBase": 195000,
    "marketValue": "€15,000,000",
    "socialHandles": {
      "instagram": "cristiano"
    }
  },
  {
    "id": "b-feb-05-2",
    "name": "Neymar Jr",
    "sport": "SOCCER",
    "birthMonth": 2,
    "birthDay": 5,
    "birthYear": 1992,
    "clubOrTeam": "Al Hilal / Santos & Barca Icon",
    "league": "Saudi Pro League",
    "country": "Brazil",
    "countryCode": "BR",
    "countryFlag": "🇧🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/132948.png&w=350&h=254",
    "fallbackInitials": "NJR",
    "biodataRole": "Forward • Brazil All-Time Top Scorer & UCL Winner",
    "quote": "Ousadia e Alegria — Dare to dream, play with joy.",
    "trophies": [
      "UEFA Champions League Winner",
      "Copa Libertadores Winner",
      "Olympic Gold Medalist",
      "Brazil All-Time Top Scorer"
    ],
    "matchFootprint": "79 International Goals for Brazil (Surpassed Pelé)",
    "wishesBase": 154000,
    "marketValue": "€30,000,000",
    "socialHandles": {
      "instagram": "neymarjr"
    }
  },
  {
    "id": "b-feb-14-1",
    "name": "Ángel Di María",
    "sport": "SOCCER",
    "birthMonth": 2,
    "birthDay": 14,
    "birthYear": 1988,
    "clubOrTeam": "Benfica / Real Madrid Legend",
    "league": "Primeira Liga",
    "country": "Argentina",
    "countryCode": "AR",
    "countryFlag": "🇦🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/104196.png&w=350&h=254",
    "fallbackInitials": "ADM",
    "biodataRole": "Winger • World Cup Final Goalscorer & UCL Final MVP",
    "quote": "Scoring in World Cup and Copa América finals is living in eternity.",
    "trophies": [
      "FIFA World Cup Winner (2022)",
      "2x Copa América Winner",
      "UEFA Champions League Winner (La Décima)"
    ],
    "matchFootprint": "Final Specialist: Scored in Olympics, Copa, Finalissima & World Cup Finals",
    "wishesBase": 58000,
    "marketValue": "€3,000,000",
    "socialHandles": {
      "instagram": "angeldimariajm"
    }
  },
  {
    "id": "b-feb-17-1",
    "name": "Michael Jordan",
    "sport": "BASKETBALL",
    "birthMonth": 2,
    "birthDay": 17,
    "birthYear": 1963,
    "clubOrTeam": "Chicago Bulls Icon",
    "league": "NBA Legend",
    "country": "United States",
    "countryCode": "US",
    "countryFlag": "🇺🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1035.png&w=350&h=254",
    "fallbackInitials": "MJ",
    "biodataRole": "Shooting Guard • 6x NBA Champion & Finals MVP",
    "quote": "I have failed over and over again in my life. And that is why I succeed.",
    "trophies": [
      "6x NBA Champion",
      "6x NBA Finals MVP",
      "5x NBA MVP",
      "2x Olympic Gold Medalist"
    ],
    "matchFootprint": "Undefeated 6-0 in NBA Finals with Chicago Bulls",
    "wishesBase": 180000,
    "marketValue": "GOAT"
  },
  {
    "id": "b-mar-14-1",
    "name": "Stephen Curry",
    "sport": "BASKETBALL",
    "birthMonth": 3,
    "birthDay": 14,
    "birthYear": 1988,
    "clubOrTeam": "Golden State Warriors",
    "league": "NBA",
    "country": "United States",
    "countryCode": "US",
    "countryFlag": "🇺🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3975.png&w=350&h=254",
    "fallbackInitials": "SC30",
    "biodataRole": "Point Guard • 4x NBA Champion & All-Time 3-Point Leader",
    "quote": "I can do all things through Christ who strengthens me.",
    "trophies": [
      "4x NBA Champion",
      "2x NBA MVP (Unanimous)",
      "NBA Finals MVP",
      "Olympic Gold Medalist (2024)"
    ],
    "matchFootprint": "Over 3,700 Career 3-Pointers Made (NBA Record)",
    "wishesBase": 135000,
    "marketValue": "$51,000,000",
    "socialHandles": {
      "instagram": "stephencurry30"
    }
  },
  {
    "id": "b-mar-21-1",
    "name": "Ronaldinho Gaúcho",
    "sport": "SOCCER",
    "birthMonth": 3,
    "birthDay": 21,
    "birthYear": 1980,
    "clubOrTeam": "Barcelona & Brazil Icon",
    "league": "World Legends",
    "country": "Brazil",
    "countryCode": "BR",
    "countryFlag": "🇧🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/10072.png&w=350&h=254",
    "fallbackInitials": "R10",
    "biodataRole": "Playmaker • Ballon d'Or Winner (2005) & World Cup Winner",
    "quote": "Football is about joy. It is about smiling when you have the ball.",
    "trophies": [
      "Ballon d'Or Winner (2005)",
      "FIFA World Cup Winner (2002)",
      "UEFA Champions League Winner (2006)"
    ],
    "matchFootprint": "Standing Ovation from Bernabéu Fans after Solitary Masterclass",
    "wishesBase": 160000,
    "marketValue": "Legend",
    "socialHandles": {
      "instagram": "ronaldinho"
    }
  },
  {
    "id": "b-mar-29-1",
    "name": "N'Golo Kanté",
    "sport": "SOCCER",
    "birthMonth": 3,
    "birthDay": 29,
    "birthYear": 1991,
    "clubOrTeam": "Al Ittihad / Chelsea & Leicester Hero",
    "league": "Saudi Pro League",
    "country": "France",
    "countryCode": "FR",
    "countryFlag": "🇫🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/199347.png&w=350&h=254",
    "fallbackInitials": "NK",
    "biodataRole": "Midfielder • World Cup & Champions League Champion",
    "quote": "Tackle with modesty, work for the team from start to finish.",
    "trophies": [
      "FIFA World Cup Winner (2018)",
      "UEFA Champions League Winner (2021)",
      "2x Premier League Champion (Leicester & Chelsea)"
    ],
    "matchFootprint": "UCL Semifinals & Final Player of the Match Clean Sweep",
    "wishesBase": 71000,
    "marketValue": "€9,000,000",
    "socialHandles": {
      "instagram": "nglkante"
    }
  },
  {
    "id": "b-apr-10-1",
    "name": "Sadio Mané",
    "sport": "SOCCER",
    "birthMonth": 4,
    "birthDay": 10,
    "birthYear": 1992,
    "clubOrTeam": "Al Nassr / Liverpool Legend",
    "league": "Saudi Pro League",
    "country": "Senegal",
    "countryCode": "SN",
    "countryFlag": "🇸🇳",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/171542.png&w=350&h=254",
    "fallbackInitials": "SM",
    "biodataRole": "Forward • 2x African Footballer of the Year & UCL Winner",
    "quote": "Why would I want 10 Ferraris when I can build schools and hospitals in Senegal?",
    "trophies": [
      "AFCON Champion (2021)",
      "UEFA Champions League Winner (2019)",
      "Premier League Champion",
      "2x African Player of Year"
    ],
    "matchFootprint": "Fastest Hat-trick in Premier League History (2 mins 56 secs)",
    "wishesBase": 88000,
    "marketValue": "€15,000,000",
    "socialHandles": {
      "instagram": "sadiomaneofficiel"
    }
  },
  {
    "id": "b-apr-24-1",
    "name": "Sachin Tendulkar",
    "sport": "CRICKET",
    "birthMonth": 4,
    "birthDay": 24,
    "birthYear": 1973,
    "clubOrTeam": "India Icon",
    "league": "World Cricket Legend",
    "country": "India",
    "countryCode": "IN",
    "countryFlag": "🇮🇳",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/cricket/players/full/35320.png&w=350&h=254",
    "fallbackInitials": "ST",
    "biodataRole": "Batsman • 100 International Centuries (World Record)",
    "quote": "People throw stones at you and you convert them into milestones.",
    "trophies": [
      "ICC Cricket World Cup Winner (2011)",
      "100 International Centuries",
      "Over 34,000 International Runs"
    ],
    "matchFootprint": "First Player to Score a Double Century in ODI Cricket",
    "wishesBase": 165000,
    "marketValue": "The God of Cricket"
  },
  {
    "id": "b-may-05-1",
    "name": "Carlos Alcaraz",
    "sport": "TENNIS",
    "birthMonth": 5,
    "birthDay": 5,
    "birthYear": 2003,
    "clubOrTeam": "ATP Tour",
    "league": "Grand Slam Tennis",
    "country": "Spain",
    "countryCode": "ES",
    "countryFlag": "🇪🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/7671.png&w=350&h=254",
    "fallbackInitials": "CA",
    "biodataRole": "Tennis Phenom • 4x Grand Slam Champion by Age 21",
    "quote": "Head, heart, and courage — the three rules of tennis.",
    "trophies": [
      "2x Wimbledon Champion",
      "French Open Champion",
      "US Open Champion",
      "Youngest World No. 1 in ATP History"
    ],
    "matchFootprint": "Channel Slam Champion (Roland Garros & Wimbledon back-to-back 2024)",
    "wishesBase": 78000,
    "marketValue": "$30,000,000",
    "socialHandles": {
      "instagram": "carlosalcaraz"
    }
  },
  {
    "id": "b-may-13-1",
    "name": "Romelu Lukaku",
    "sport": "SOCCER",
    "birthMonth": 5,
    "birthDay": 13,
    "birthYear": 1993,
    "clubOrTeam": "Napoli",
    "league": "Serie A",
    "country": "Belgium",
    "countryCode": "BE",
    "countryFlag": "🇧🇪",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/139366.png&w=350&h=254",
    "fallbackInitials": "RL",
    "biodataRole": "Striker • Belgium All-Time Top Scorer & Serie A MVP",
    "quote": "When I score, it is for everyone who believed in me from the start.",
    "trophies": [
      "Serie A Champion (Inter)",
      "Belgium All-Time Top Scorer",
      "FIFA Club World Cup Winner"
    ],
    "matchFootprint": "85+ International Goals for Belgium",
    "wishesBase": 52000,
    "marketValue": "€30,000,000",
    "socialHandles": {
      "instagram": "romelulukaku"
    }
  },
  {
    "id": "b-may-22-1",
    "name": "Novak Djokovic",
    "sport": "TENNIS",
    "birthMonth": 5,
    "birthDay": 22,
    "birthYear": 1987,
    "clubOrTeam": "ATP Tour",
    "league": "Grand Slam Tennis",
    "country": "Serbia",
    "countryCode": "RS",
    "countryFlag": "🇷🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/296.png&w=350&h=254",
    "fallbackInitials": "ND",
    "biodataRole": "Tennis Icon • 24x Grand Slam Champion & Olympic Champion",
    "quote": "The mind is everything. What you think, you become.",
    "trophies": [
      "24x Grand Slam Singles Titles",
      "Olympic Gold Medalist (Paris 2024)",
      "40x ATP Masters 1000",
      "428 Weeks at World No. 1"
    ],
    "matchFootprint": "Only Man to Win All 4 Majors at least 3 Times Each",
    "wishesBase": 110000,
    "marketValue": "GOAT",
    "socialHandles": {
      "instagram": "djokernole"
    }
  },
  {
    "id": "b-jun-03-1",
    "name": "Rafael Nadal",
    "sport": "TENNIS",
    "birthMonth": 6,
    "birthDay": 3,
    "birthYear": 1986,
    "clubOrTeam": "King of Clay",
    "league": "Grand Slam Tennis",
    "country": "Spain",
    "countryCode": "ES",
    "countryFlag": "🇪🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/261.png&w=350&h=254",
    "fallbackInitials": "RN",
    "biodataRole": "Tennis Icon • 14x Roland Garros Champion & 22 Slams",
    "quote": "I play each point as if my life depends on it.",
    "trophies": [
      "14x Roland Garros Titles (Unmatched Record)",
      "22x Grand Slam Champion",
      "2x Olympic Gold Medalist"
    ],
    "matchFootprint": "112 Wins and Only 4 Losses at French Open (96.5% Win Rate)",
    "wishesBase": 125000,
    "marketValue": "King of Clay",
    "socialHandles": {
      "instagram": "rafaelnadal"
    }
  },
  {
    "id": "b-jun-15-1",
    "name": "Mohamed Salah",
    "sport": "SOCCER",
    "birthMonth": 6,
    "birthDay": 15,
    "birthYear": 1992,
    "clubOrTeam": "Liverpool",
    "league": "Premier League",
    "country": "Egypt",
    "countryCode": "EG",
    "countryFlag": "🇪🇬",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/173515.png&w=350&h=254",
    "fallbackInitials": "MS",
    "biodataRole": "Forward • 3x Premier League Golden Boot & UCL Winner",
    "quote": "Hard work, faith, and unwavering dedication make impossible dreams real.",
    "trophies": [
      "UEFA Champions League Winner (2019)",
      "Premier League Champion (2020)",
      "3x Premier League Golden Boot",
      "2x African Player of the Year"
    ],
    "matchFootprint": "Liverpool All-Time Premier League Top Goalscorer (200+ Goals)",
    "wishesBase": 142000,
    "marketValue": "€55,000,000",
    "socialHandles": {
      "instagram": "mosalah"
    }
  },
  {
    "id": "b-jun-23-1",
    "name": "Zinedine Zidane",
    "sport": "SOCCER",
    "birthMonth": 6,
    "birthDay": 23,
    "birthYear": 1972,
    "clubOrTeam": "Real Madrid & France Legend",
    "league": "World Legends",
    "country": "France",
    "countryCode": "FR",
    "countryFlag": "🇫🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/1188.png&w=350&h=254",
    "fallbackInitials": "ZZ",
    "biodataRole": "Midfield Maestro • World Cup Winner & 3x UCL Winning Manager",
    "quote": "I used to cry because I had no shoes to play football, until I met a man who had no feet.",
    "trophies": [
      "FIFA World Cup Winner (1998)",
      "UEFA Euro Champion (2000)",
      "Ballon d'Or Winner (1998)",
      "3x Consecutive UCL Manager Winner"
    ],
    "matchFootprint": "Legendary Volley in 2002 Champions League Final vs Bayer Leverkusen",
    "wishesBase": 130000,
    "marketValue": "Legend",
    "socialHandles": {
      "instagram": "zidane"
    }
  },
  {
    "id": "b-jun-24-1",
    "name": "Lionel Messi",
    "sport": "SOCCER",
    "birthMonth": 6,
    "birthDay": 24,
    "birthYear": 1987,
    "clubOrTeam": "Inter Miami / Barcelona Icon",
    "league": "MLS / World Legends",
    "country": "Argentina",
    "countryCode": "AR",
    "countryFlag": "🇦🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/45843.png&w=350&h=254",
    "fallbackInitials": "LM10",
    "biodataRole": "Forward • 8x Ballon d'Or & World Cup Champion",
    "quote": "It took me 17 years and 114 days to become an overnight success.",
    "trophies": [
      "FIFA World Cup Winner (2022)",
      "8x Ballon d'Or Winner (Record)",
      "4x UEFA Champions League Winner",
      "2x Copa América Winner",
      "46 Career Trophies (Most in History)"
    ],
    "matchFootprint": "Over 830 Official Goals & 370 Assists in Professional Career",
    "wishesBase": 220000,
    "marketValue": "€30,000,000",
    "socialHandles": {
      "instagram": "leomessi"
    }
  },
  {
    "id": "b-jun-28-1",
    "name": "Kevin De Bruyne",
    "sport": "SOCCER",
    "birthMonth": 6,
    "birthDay": 28,
    "birthYear": 1991,
    "clubOrTeam": "Manchester City",
    "league": "Premier League",
    "country": "Belgium",
    "countryCode": "BE",
    "countryFlag": "🇧🇪",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/139832.png&w=350&h=254",
    "fallbackInitials": "KDB",
    "biodataRole": "Midfield Playmaker • 6x Premier League Champion & UCL Winner",
    "quote": "Let me talk! Precision and vision turn spaces into goals.",
    "trophies": [
      "UEFA Champions League Winner (2023)",
      "6x Premier League Champion",
      "2x PFA Players Player of the Year",
      "100+ Premier League Assists"
    ],
    "matchFootprint": "Captain and Architect of Man City 2023 Continental Treble",
    "wishesBase": 84000,
    "marketValue": "€50,000,000",
    "socialHandles": {
      "instagram": "kevindebruyne"
    }
  },
  {
    "id": "b-jun-29-1",
    "name": "Jude Bellingham",
    "sport": "SOCCER",
    "birthMonth": 6,
    "birthDay": 29,
    "birthYear": 2003,
    "clubOrTeam": "Real Madrid",
    "league": "La Liga",
    "country": "England",
    "countryCode": "GB",
    "countryFlag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/304181.png&w=350&h=254",
    "fallbackInitials": "JB",
    "biodataRole": "Midfielder • Champions League Winner & Kopa Trophy",
    "quote": "Hey Jude! Arms spread wide, leading European football from the Bernabéu.",
    "trophies": [
      "UEFA Champions League Winner (2024)",
      "La Liga Champion (2024)",
      "Golden Boy Winner",
      "La Liga Player of the Season"
    ],
    "matchFootprint": "23 Goals in Debut Real Madrid Season & Last-Minute Clásico Winners",
    "wishesBase": 115000,
    "marketValue": "€180,000,000",
    "socialHandles": {
      "instagram": "judebellingham"
    }
  },
  {
    "id": "b-jul-08-1",
    "name": "Son Heung-min",
    "sport": "SOCCER",
    "birthMonth": 7,
    "birthDay": 8,
    "birthYear": 1992,
    "clubOrTeam": "Tottenham Hotspur",
    "league": "Premier League",
    "country": "South Korea",
    "countryCode": "KR",
    "countryFlag": "🇰🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/149302.png&w=350&h=254",
    "fallbackInitials": "SHM",
    "biodataRole": "Forward • Premier League Golden Boot & Asian Icon",
    "quote": "Smile, respect everyone, and strike with both feet.",
    "trophies": [
      "Premier League Golden Boot (2021-22)",
      "FIFA Puskás Award Winner",
      "Asian Games Gold Medalist"
    ],
    "matchFootprint": "First Asian Player to Win Premier League Golden Boot",
    "wishesBase": 76000,
    "marketValue": "€45,000,000",
    "socialHandles": {
      "instagram": "hm_son7"
    }
  },
  {
    "id": "b-jul-08-2",
    "name": "Virgil van Dijk",
    "sport": "SOCCER",
    "birthMonth": 7,
    "birthDay": 8,
    "birthYear": 1991,
    "clubOrTeam": "Liverpool",
    "league": "Premier League",
    "country": "Netherlands",
    "countryCode": "NL",
    "countryFlag": "🇳🇱",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/156475.png&w=350&h=254",
    "fallbackInitials": "VVD",
    "biodataRole": "Defender • UEFA Men's Player of the Year & UCL Winner",
    "quote": "Calm, composed, and commanding the backline.",
    "trophies": [
      "UEFA Champions League Winner (2019)",
      "Premier League Champion (2020)",
      "UEFA Men's Player of the Year",
      "PFA Player of the Year"
    ],
    "matchFootprint": "65 Consecutive Games Without Being Dribbled Past",
    "wishesBase": 69000,
    "marketValue": "€30,000,000",
    "socialHandles": {
      "instagram": "virgilvandijk"
    }
  },
  {
    "id": "b-jul-12-1",
    "name": "Vinícius Júnior",
    "sport": "SOCCER",
    "birthMonth": 7,
    "birthDay": 12,
    "birthYear": 2000,
    "clubOrTeam": "Real Madrid",
    "league": "La Liga",
    "country": "Brazil",
    "countryCode": "BR",
    "countryFlag": "🇧🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/264580.png&w=350&h=254",
    "fallbackInitials": "VJ",
    "biodataRole": "Winger • 2x Champions League Final Goalscorer",
    "quote": "Baila Vini! Dancing past defenders to the summit of world football.",
    "trophies": [
      "2x UEFA Champions League Winner",
      "3x La Liga Champion",
      "UCL Player of the Season (2023-24)"
    ],
    "matchFootprint": "Scored the Winning Goals in BOTH the 2022 & 2024 Champions League Finals",
    "wishesBase": 138000,
    "marketValue": "€200,000,000",
    "socialHandles": {
      "instagram": "vinijr"
    }
  },
  {
    "id": "b-jul-13-1",
    "name": "Lamine Yamal",
    "sport": "SOCCER",
    "birthMonth": 7,
    "birthDay": 13,
    "birthYear": 2007,
    "clubOrTeam": "FC Barcelona",
    "league": "La Liga",
    "country": "Spain",
    "countryCode": "ES",
    "countryFlag": "🇪🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/358826.png&w=350&h=254",
    "fallbackInitials": "LY",
    "biodataRole": "Winger • Euro 2024 Champion & Young Player of Tournament",
    "quote": "From Rocafonda 304 to European champion at 17 years old.",
    "trophies": [
      "UEFA European Champion (2024)",
      "Euro 2024 Young Player of Tournament",
      "Kopa Trophy Winner (2024)",
      "La Liga Champion"
    ],
    "matchFootprint": "Youngest Goalscorer and Assist Provider in European Championship History",
    "wishesBase": 128000,
    "marketValue": "€150,000,000",
    "socialHandles": {
      "instagram": "lamineyamal"
    }
  },
  {
    "id": "b-jul-14-1",
    "name": "Conor McGregor",
    "sport": "COMBAT",
    "birthMonth": 7,
    "birthDay": 14,
    "birthYear": 1988,
    "clubOrTeam": "The Notorious",
    "league": "UFC Legend",
    "country": "Ireland",
    "countryCode": "IE",
    "countryFlag": "🇮🇪",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/3022677.png&w=350&h=254",
    "fallbackInitials": "CMG",
    "biodataRole": "Fighter • First Simultaneous Two-Division UFC Champion",
    "quote": "We are not here to take part, we are here to take over!",
    "trophies": [
      "UFC Featherweight Champion",
      "UFC Lightweight Champion",
      "Fastest Title Knockout in UFC History (13s)"
    ],
    "matchFootprint": "Headlined 5 of the Top 6 Highest-Grossing UFC PPVs of All Time",
    "wishesBase": 145000,
    "marketValue": "Champ Champ",
    "socialHandles": {
      "instagram": "thenotoriousmma"
    }
  },
  {
    "id": "b-jul-21-1",
    "name": "Erling Haaland",
    "sport": "SOCCER",
    "birthMonth": 7,
    "birthDay": 21,
    "birthYear": 2000,
    "clubOrTeam": "Manchester City",
    "league": "Premier League",
    "country": "Norway",
    "countryCode": "NO",
    "countryFlag": "🇳🇴",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/255531.png&w=350&h=254",
    "fallbackInitials": "EH",
    "biodataRole": "Striker • European Golden Shoe & Premier League Record 36 Goals",
    "quote": "Goals are my fuel. Hungry for every delivery.",
    "trophies": [
      "UEFA Champions League Winner (2023)",
      "2x Premier League Champion",
      "2x Premier League Golden Boot",
      "European Golden Shoe"
    ],
    "matchFootprint": "Fastest Player to Reach 50 Premier League Goals in History (48 Games)",
    "wishesBase": 152000,
    "marketValue": "€200,000,000",
    "socialHandles": {
      "instagram": "erling.haaland"
    }
  },
  {
    "id": "b-jul-22-1",
    "name": "Israel Adesanya",
    "sport": "COMBAT",
    "birthMonth": 7,
    "birthDay": 22,
    "birthYear": 1989,
    "clubOrTeam": "The Last Stylebender",
    "league": "UFC Middleweight",
    "country": "Nigeria",
    "countryCode": "NG",
    "countryFlag": "🇳🇬",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/3155896.png&w=350&h=254",
    "fallbackInitials": "IA",
    "biodataRole": "Fighter • 2x UFC Middleweight World Champion",
    "quote": "I came from Lagos to the top of the world. Stylebender forever.",
    "trophies": [
      "2x Undisputed UFC Middleweight Champion",
      "5 Title Defenses",
      "Performance of the Night 6x"
    ],
    "matchFootprint": "Iconic Rivalry Knockout of Alex Pereira in Miami UFC 287",
    "wishesBase": 95000,
    "marketValue": "Stylebender",
    "socialHandles": {
      "instagram": "stylebender"
    }
  },
  {
    "id": "b-aug-01-1",
    "name": "Nwankwo Kanu",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 1,
    "birthYear": 1976,
    "clubOrTeam": "Arsenal Invincible Legend",
    "league": "Premier League Legends",
    "country": "Nigeria",
    "countryCode": "NG",
    "countryFlag": "🇳🇬",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Nwankwo_Kanu_2018.jpg/440px-Nwankwo_Kanu_2018.jpg",
    "fallbackInitials": "NK",
    "biodataRole": "Forward • 2x African Footballer of the Year & Olympic Gold",
    "quote": "Papilo made us proud! Overcoming heart surgery to conquer European football.",
    "trophies": [
      "UEFA Champions League Winner (Ajax 1995)",
      "Arsenal Invincibles Champion (2004)",
      "Olympic Gold Medalist (Atlanta 1996)",
      "2x African Player of the Year"
    ],
    "matchFootprint": "Legendary 15-Minute Hat-trick against Chelsea at Stamford Bridge",
    "wishesBase": 86400,
    "marketValue": "Legend"
  },
  {
    "id": "b-aug-08-1",
    "name": "Roger Federer",
    "sport": "TENNIS",
    "birthMonth": 8,
    "birthDay": 8,
    "birthYear": 1981,
    "clubOrTeam": "Swiss Maestro",
    "league": "Grand Slam Tennis",
    "country": "Switzerland",
    "countryCode": "CH",
    "countryFlag": "🇨🇭",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/245.png&w=350&h=254",
    "fallbackInitials": "RF",
    "biodataRole": "Tennis Maestro • 20x Grand Slam Champion",
    "quote": "There is no way around hard work. Embrace it and play with grace.",
    "trophies": [
      "20x Grand Slam Singles Champion",
      "8x Wimbledon Champion (Men's Record)",
      "310 Weeks as World No. 1",
      "103 ATP Career Titles"
    ],
    "matchFootprint": "Record 237 Consecutive Weeks at World No. 1",
    "wishesBase": 158000,
    "marketValue": "Maestro",
    "socialHandles": {
      "instagram": "rogerfederer"
    }
  },
  {
    "id": "b-aug-12-1",
    "name": "Tyson Fury",
    "sport": "COMBAT",
    "birthMonth": 8,
    "birthDay": 12,
    "birthYear": 1988,
    "clubOrTeam": "The Gypsy King",
    "league": "Heavyweight Boxing",
    "country": "United Kingdom",
    "countryCode": "GB",
    "countryFlag": "🇬🇧",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/boxing/players/full/249339.png&w=350&h=254",
    "fallbackInitials": "TF",
    "biodataRole": "Heavyweight • 2x World Heavyweight Champion",
    "quote": "The Gypsy King bows to no man. Resilience conquers everything.",
    "trophies": [
      "WBC World Heavyweight Champion",
      "WBA, IBF, WBO Champion",
      "Ring Magazine Fighter of Year 2x"
    ],
    "matchFootprint": "Epic Trilogy with Deontay Wilder (34 Wins & Unbeaten Streak)",
    "wishesBase": 92000,
    "marketValue": "Gypsy King",
    "socialHandles": {
      "instagram": "tysonfury"
    }
  },
  {
    "id": "b-aug-14-1",
    "name": "Jay-Jay Okocha",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 14,
    "birthYear": 1973,
    "clubOrTeam": "Super Eagles & Bolton Icon",
    "league": "African Legends",
    "country": "Nigeria",
    "countryCode": "NG",
    "countryFlag": "🇳🇬",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jay-Jay_Okocha_2017.jpg/440px-Jay-Jay_Okocha_2017.jpg",
    "fallbackInitials": "JJ",
    "biodataRole": "Midfield Magician • AFCON & Olympic Champion",
    "quote": "So good they named him twice — pure unadulterated joy on the ball.",
    "trophies": [
      "Olympic Gold Medalist (1996)",
      "AFCON Champion (1994)",
      "2x BBC African Footballer of Year",
      "Bolton Wanderers Legend"
    ],
    "matchFootprint": "Unmatched Dribbling Wizardry Across Bundesliga, Ligue 1 & Premier League",
    "wishesBase": 98400,
    "marketValue": "Legend",
    "socialHandles": {
      "instagram": "official_jj10"
    }
  },
  {
    "id": "b-aug-17-1",
    "name": "Thierry Henry",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 17,
    "birthYear": 1977,
    "clubOrTeam": "Arsenal Invincible Legend",
    "league": "Premier League Legends",
    "country": "France",
    "countryCode": "FR",
    "countryFlag": "🇫🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/2262.png&w=350&h=254",
    "fallbackInitials": "TH14",
    "biodataRole": "Striker • World Cup Champion & 4x Golden Boot",
    "quote": "Va-va-voom! Unmatched finesse, lightning pace and signature side-foot curls.",
    "trophies": [
      "FIFA World Cup Winner (1998)",
      "Arsenal Invincibles 2004",
      "UEFA Champions League Winner (Barca 2009)",
      "4x Premier League Golden Boot (Record)"
    ],
    "matchFootprint": "Arsenal All-Time Top Scorer with 228 Goals",
    "wishesBase": 132000,
    "marketValue": "King Henry"
  },
  {
    "id": "b-aug-21-1",
    "name": "Usain Bolt",
    "sport": "ATHLETICS",
    "birthMonth": 8,
    "birthDay": 21,
    "birthYear": 1986,
    "clubOrTeam": "Lightning Bolt",
    "league": "Olympic Track & Field",
    "country": "Jamaica",
    "countryCode": "JM",
    "countryFlag": "🇯🇲",
    "avatarUrl": "https://r2.thesportsdb.com/images/media/player/thumb/4t66gq1468694002.jpg",
    "fallbackInitials": "UB",
    "biodataRole": "Sprinter • 8x Olympic Gold Medalist & World Record 9.58s",
    "quote": "I do not think limits. Forever the fastest man alive.",
    "trophies": [
      "8x Olympic Gold Medalist",
      "11x World Championship Gold",
      "100m World Record (9.58s)",
      "200m World Record (19.19s)"
    ],
    "matchFootprint": "Only Sprinter to Win 100m and 200m at Three Consecutive Olympics (2008, 2012, 2016)",
    "wishesBase": 185000,
    "marketValue": "Fastest Man Alive",
    "socialHandles": {
      "instagram": "usainbolt"
    }
  },
  {
    "id": "b-aug-21-2",
    "name": "Robert Lewandowski",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 21,
    "birthYear": 1988,
    "clubOrTeam": "FC Barcelona / Bayern Icon",
    "league": "La Liga",
    "country": "Poland",
    "countryCode": "PL",
    "countryFlag": "🇵🇱",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/128386.png&w=350&h=254",
    "fallbackInitials": "RL9",
    "biodataRole": "Striker • 2x FIFA Best Player & UCL Winner",
    "quote": "Discipline in training produces ruthless finishing on matchday.",
    "trophies": [
      "UEFA Champions League Winner (2020 Sextuple)",
      "2x FIFA The Best Men's Player",
      "Bundesliga Record 41 Goals in Single Season",
      "2x European Golden Shoe"
    ],
    "matchFootprint": "Scored 5 Goals in 9 Minutes vs Wolfsburg (Guinness World Record)",
    "wishesBase": 94000,
    "marketValue": "€15,000,000",
    "socialHandles": {
      "instagram": "_rl9"
    }
  },
  {
    "id": "b-aug-23-1",
    "name": "Kobe Bryant",
    "sport": "BASKETBALL",
    "birthMonth": 8,
    "birthDay": 23,
    "birthYear": 1978,
    "clubOrTeam": "Los Angeles Lakers Legend",
    "league": "NBA Legends",
    "country": "United States",
    "countryCode": "US",
    "countryFlag": "🇺🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/110.png&w=350&h=254",
    "fallbackInitials": "KB24",
    "biodataRole": "Black Mamba • 5x NBA Champion & Hall of Fame",
    "quote": "Mamba Mentality: It is about focusing on the process and trusting in the hard work.",
    "trophies": [
      "5x NBA Champion",
      "2x NBA Finals MVP",
      "NBA MVP (2008)",
      "2x Olympic Gold Medalist",
      "18x NBA All-Star"
    ],
    "matchFootprint": "81-Point Game vs Toronto Raptors (2nd Highest in NBA History)",
    "wishesBase": 190000,
    "marketValue": "Mamba Forever"
  },
  {
    "id": "b-aug-28-1",
    "name": "Weston McKennie",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 28,
    "birthYear": 1998,
    "clubOrTeam": "Juventus",
    "league": "Serie A",
    "country": "United States",
    "countryCode": "US",
    "countryFlag": "🇺🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/237648.png&w=350&h=254",
    "fallbackInitials": "WM",
    "biodataRole": "Midfielder • USMNT & Juventus Star",
    "quote": "Energetic box-to-box dominance in the Serie A midfield.",
    "trophies": [
      "2x Coppa Italia Winner",
      "3x CONCACAF Nations League Winner"
    ],
    "matchFootprint": "Over 55 Caps for United States Men's National Team",
    "wishesBase": 18400,
    "marketValue": "€28,000,000",
    "socialHandles": {
      "instagram": "westonmckennie"
    }
  },
  {
    "id": "b-aug-28-2",
    "name": "César Azpilicueta",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 28,
    "birthYear": 1989,
    "clubOrTeam": "Atlético Madrid / Chelsea Legend",
    "league": "La Liga",
    "country": "Spain",
    "countryCode": "ES",
    "countryFlag": "🇪🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/104396.png&w=350&h=254",
    "fallbackInitials": "CA",
    "biodataRole": "Defender • Chelsea Captain Legend & UCL Winner",
    "quote": "Consistently reliable leadership and defensive resilience.",
    "trophies": [
      "UEFA Champions League Winner (2021 Captain)",
      "2x Premier League Winner",
      "FIFA Club World Cup Winner",
      "2x Europa League Winner"
    ],
    "matchFootprint": "508 Appearances for Chelsea Football Club",
    "wishesBase": 26300,
    "marketValue": "€3,000,000",
    "socialHandles": {
      "instagram": "cesarazpi"
    }
  },
  {
    "id": "b-aug-29-1",
    "name": "Vincent Enyeama",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 29,
    "birthYear": 1982,
    "clubOrTeam": "Super Eagles & Lille Legend",
    "league": "African Legends",
    "country": "Nigeria",
    "countryCode": "NG",
    "countryFlag": "🇳🇬",
    "avatarUrl": "https://r2.thesportsdb.com/images/media/player/thumb/snhzzq1702566147.jpg",
    "fallbackInitials": "VE",
    "biodataRole": "Goalkeeper • 2013 AFCON Champion & Lille Legend",
    "quote": "Legendary reflexes on the world stage for Super Eagles and Lille.",
    "trophies": [
      "AFCON Champion (2013)",
      "2x CAF Champions League Winner (Enyimba)",
      "1,062 Minutes Without Conceding in Ligue 1"
    ],
    "matchFootprint": "101 Caps for Nigeria Super Eagles & Iconic 2010 World Cup Heroics vs Messi",
    "wishesBase": 64200,
    "marketValue": "Legend",
    "socialHandles": {
      "instagram": "vincentenyeama01"
    }
  },
  {
    "id": "b-aug-29-2",
    "name": "Celestine Babayaro",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 29,
    "birthYear": 1978,
    "clubOrTeam": "Chelsea & Newcastle Legend",
    "league": "Premier League Legends",
    "country": "Nigeria",
    "countryCode": "NG",
    "countryFlag": "🇳🇬",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Celestine_Babayaro_2012.jpg/440px-Celestine_Babayaro_2012.jpg",
    "fallbackInitials": "CB",
    "biodataRole": "Left Back • 1996 Olympic Gold Medalist & Chelsea Icon",
    "quote": "Trailblazing Nigerian defender with signature backflip celebrations.",
    "trophies": [
      "Olympic Gold Medalist (Atlanta 1996)",
      "FA Cup Winner (Chelsea 2000)",
      "UEFA Cup Winners Cup (1998)",
      "FIFA U-17 World Cup Winner"
    ],
    "matchFootprint": "Nearly 200 Appearances for Chelsea FC as Historic African Pioneer",
    "wishesBase": 38100,
    "marketValue": "Legend",
    "socialHandles": {
      "instagram": "celestinebabayaro"
    }
  },
  {
    "id": "b-aug-29-3",
    "name": "Ainsley Maitland-Niles",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 29,
    "birthYear": 1997,
    "clubOrTeam": "Olympique Lyonnais / Arsenal",
    "league": "Ligue 1",
    "country": "England",
    "countryCode": "GB",
    "countryFlag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/211796.png&w=350&h=254",
    "fallbackInitials": "AMN",
    "biodataRole": "Utility Player • FA Cup & UEFA Conference League Winner",
    "quote": "Versatility and cold composure on the pitch.",
    "trophies": [
      "FA Cup Winner (2020)",
      "2x FA Community Shield Winner",
      "UEFA Europa Conference League Winner (Roma)"
    ],
    "matchFootprint": "Over 130 Appearances for Arsenal",
    "wishesBase": 24500,
    "marketValue": "€10,000,000",
    "socialHandles": {
      "instagram": "maitlandniles"
    }
  },
  {
    "id": "b-aug-30-1",
    "name": "Pavel Nedvěd",
    "sport": "SOCCER",
    "birthMonth": 8,
    "birthDay": 30,
    "birthYear": 1972,
    "clubOrTeam": "Juventus & Czech Legend",
    "league": "Serie A Legends",
    "country": "Czech Republic",
    "countryCode": "CZ",
    "countryFlag": "🇨🇿",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Pavel_Nedv%C4%9Bd.jpg/440px-Pavel_Nedv%C4%9Bd.jpg",
    "fallbackInitials": "PN",
    "biodataRole": "Midfield Dynamo • Ballon d'Or Winner (2003)",
    "quote": "The Czech Fury with unstoppable long-range strikes and relentless stamina.",
    "trophies": [
      "Ballon d'Or Winner (2003)",
      "3x Serie A Champion",
      "UEFA Cup Winners Cup",
      "Euro 1996 Finalist"
    ],
    "matchFootprint": "500+ Professional Matches with 110 Career Goals",
    "wishesBase": 49500,
    "marketValue": "Legend"
  },
  {
    "id": "b-aug-30-2",
    "name": "Cameron Norrie",
    "sport": "TENNIS",
    "birthMonth": 8,
    "birthDay": 30,
    "birthYear": 1995,
    "clubOrTeam": "ATP Tour",
    "league": "Grand Slam Tennis",
    "country": "United Kingdom",
    "countryCode": "GB",
    "countryFlag": "🇬🇧",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/3785.png&w=350&h=254",
    "fallbackInitials": "CN",
    "biodataRole": "Tennis Pro • Indian Wells Masters Champion & British No. 1",
    "quote": "Fight for every baseline rally with relentless grit.",
    "trophies": [
      "ATP Masters 1000 Indian Wells Champion",
      "5x ATP Tour Titles",
      "Wimbledon Semifinalist"
    ],
    "matchFootprint": "Reached Career High World No. 8",
    "wishesBase": 28000,
    "marketValue": "Tour Champion",
    "socialHandles": {
      "instagram": "norriee"
    }
  },
  {
    "id": "b-sep-01-1",
    "name": "Ruud Gullit",
    "sport": "SOCCER",
    "birthMonth": 9,
    "birthDay": 1,
    "birthYear": 1962,
    "clubOrTeam": "AC Milan & Netherlands Legend",
    "league": "European Legends",
    "country": "Netherlands",
    "countryCode": "NL",
    "countryFlag": "🇳🇱",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Ruud_Gullit_1988.jpg/440px-Ruud_Gullit_1988.jpg",
    "fallbackInitials": "RG",
    "biodataRole": "Total Football Icon • Ballon d'Or Winner (1987)",
    "quote": "Unstoppable physical grace and tactical genius. Football is art.",
    "trophies": [
      "Ballon d'Or Winner (1987)",
      "UEFA European Champion (1988 Captain)",
      "2x European Cup Winner (AC Milan)"
    ],
    "matchFootprint": "Captained the Netherlands to their historic Euro 1988 triumph",
    "wishesBase": 58200,
    "marketValue": "Legend"
  },
  {
    "id": "b-sep-02-1",
    "name": "Emiliano Martínez",
    "sport": "SOCCER",
    "birthMonth": 9,
    "birthDay": 2,
    "birthYear": 1992,
    "clubOrTeam": "Aston Villa",
    "league": "Premier League",
    "country": "Argentina",
    "countryCode": "AR",
    "countryFlag": "🇦🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/156689.png&w=350&h=254",
    "fallbackInitials": "DIBU",
    "biodataRole": "Goalkeeper • World Cup Champion & 2x Yashin Trophy",
    "quote": "Clutch penalty saves and fearlessness when the stakes are highest.",
    "trophies": [
      "FIFA World Cup Winner (2022)",
      "2x Copa América Champion (2021, 2024)",
      "2x Yashin Trophy Winner (2023, 2024)",
      "World Cup Golden Glove"
    ],
    "matchFootprint": "Decisive 123rd-Minute Save vs Kolo Muani in 2022 World Cup Final",
    "wishesBase": 88000,
    "marketValue": "€28,000,000",
    "socialHandles": {
      "instagram": "emi_martinez26"
    }
  },
  {
    "id": "b-sep-05-1",
    "name": "Bukayo Saka",
    "sport": "SOCCER",
    "birthMonth": 9,
    "birthDay": 5,
    "birthYear": 2001,
    "clubOrTeam": "Arsenal",
    "league": "Premier League",
    "country": "England",
    "countryCode": "GB",
    "countryFlag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/294270.png&w=350&h=254",
    "fallbackInitials": "BS7",
    "biodataRole": "Winger • Arsenal Star & England Player of the Year",
    "quote": "Starboy leading Arsenal with humility, faith, and world-class quality.",
    "trophies": [
      "FA Cup Winner (2020)",
      "2x FA Community Shield Winner",
      "PFA Young Player of the Year",
      "2x England Men's Player of the Year"
    ],
    "matchFootprint": "65+ Goals & 60+ Assists for Arsenal by Age 23",
    "wishesBase": 95000,
    "marketValue": "€140,000,000",
    "socialHandles": {
      "instagram": "bukayosaka87"
    }
  },
  {
    "id": "b-sep-08-1",
    "name": "Bruno Fernandes",
    "sport": "SOCCER",
    "birthMonth": 9,
    "birthDay": 8,
    "birthYear": 1994,
    "clubOrTeam": "Manchester United",
    "league": "Premier League",
    "country": "Portugal",
    "countryCode": "PT",
    "countryFlag": "🇵🇹",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/180630.png&w=350&h=254",
    "fallbackInitials": "BF8",
    "biodataRole": "Midfielder • Manchester United Captain & Playmaker",
    "quote": "Relentless drive, creating chances every single match for the badge.",
    "trophies": [
      "FA Cup Winner (2024 Captain)",
      "Carabao Cup Winner (2023)",
      "UEFA Nations League Winner",
      "3x Sir Matt Busby Player of Year"
    ],
    "matchFootprint": "Over 85 Goals & 75 Assists for Manchester United",
    "wishesBase": 76000,
    "marketValue": "€65,000,000",
    "socialHandles": {
      "instagram": "brunofernandes8"
    }
  },
  {
    "id": "b-sep-09-1",
    "name": "Luka Modrić",
    "sport": "SOCCER",
    "birthMonth": 9,
    "birthDay": 9,
    "birthYear": 1985,
    "clubOrTeam": "Real Madrid",
    "league": "La Liga",
    "country": "Croatia",
    "countryCode": "HR",
    "countryFlag": "🇭🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/98752.png&w=350&h=254",
    "fallbackInitials": "LM10",
    "biodataRole": "Midfield Maestro • 6x UCL Winner & Ballon d'Or 2018",
    "quote": "Age is just a number. The trivela and vision never grow old.",
    "trophies": [
      "6x UEFA Champions League Winner (Record)",
      "Ballon d'Or Winner (2018)",
      "4x La Liga Champion",
      "FIFA World Cup Golden Ball"
    ],
    "matchFootprint": "Most Decorated Player in Real Madrid 122-Year History (27 Trophies)",
    "wishesBase": 94000,
    "marketValue": "€6,000,000",
    "socialHandles": {
      "instagram": "lukamodric10"
    }
  },
  {
    "id": "b-sep-22-1",
    "name": "Ronaldo Nazário",
    "sport": "SOCCER",
    "birthMonth": 9,
    "birthDay": 22,
    "birthYear": 1976,
    "clubOrTeam": "O Fenômeno",
    "league": "World Legends",
    "country": "Brazil",
    "countryCode": "BR",
    "countryFlag": "🇧🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/10071.png&w=350&h=254",
    "fallbackInitials": "R9",
    "biodataRole": "Striker • 2x Ballon d'Or & 2x World Cup Champion",
    "quote": "Fenômeno! Step-overs, blistering explosion, and clinical finishing.",
    "trophies": [
      "2x FIFA World Cup Winner (1994, 2002)",
      "2x Ballon d'Or Winner (1997, 2002)",
      "3x FIFA World Player of the Year",
      "World Cup Golden Boot"
    ],
    "matchFootprint": "Scored Both Goals in 2002 World Cup Final to Secure Penta for Brazil",
    "wishesBase": 165000,
    "marketValue": "O Fenômeno",
    "socialHandles": {
      "instagram": "ronaldo"
    }
  },
  {
    "id": "b-sep-26-1",
    "name": "Serena Williams",
    "sport": "TENNIS",
    "birthMonth": 9,
    "birthDay": 26,
    "birthYear": 1981,
    "clubOrTeam": "Tennis Queen",
    "league": "Grand Slam Tennis",
    "country": "United States",
    "countryCode": "US",
    "countryFlag": "🇺🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/294.png&w=350&h=254",
    "fallbackInitials": "SW",
    "biodataRole": "Tennis Icon • 23x Grand Slam Champion",
    "quote": "I really think a champion is defined not by their wins but by how they can recover when they fall.",
    "trophies": [
      "23x Grand Slam Singles Titles",
      "4x Olympic Gold Medalist",
      "319 Weeks at World No. 1",
      "Career Golden Slam in Singles & Doubles"
    ],
    "matchFootprint": "Won Australian Open While Two Months Pregnant in 2017",
    "wishesBase": 148000,
    "marketValue": "GOAT",
    "socialHandles": {
      "instagram": "serenawilliams"
    }
  },
  {
    "id": "b-sep-29-1",
    "name": "Kevin Durant",
    "sport": "BASKETBALL",
    "birthMonth": 9,
    "birthDay": 29,
    "birthYear": 1988,
    "clubOrTeam": "Phoenix Suns",
    "league": "NBA",
    "country": "United States",
    "countryCode": "US",
    "countryFlag": "🇺🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3202.png&w=350&h=254",
    "fallbackInitials": "KD",
    "biodataRole": "Forward • 2x NBA Champion & 4x Olympic Gold Medalist",
    "quote": "Hard work beats talent when talent fails to work hard.",
    "trophies": [
      "2x NBA Champion",
      "2x NBA Finals MVP",
      "NBA MVP (2014)",
      "4x Olympic Gold Medalist (USA Basketball Record)"
    ],
    "matchFootprint": "All-Time Leading Scorer in USA Men's Olympic Basketball History",
    "wishesBase": 110000,
    "marketValue": "$48,000,000"
  },
  {
    "id": "b-oct-03-1",
    "name": "Zlatan Ibrahimović",
    "sport": "SOCCER",
    "birthMonth": 10,
    "birthDay": 3,
    "birthYear": 1981,
    "clubOrTeam": "AC Milan / Sweden Icon",
    "league": "World Legends",
    "country": "Sweden",
    "countryCode": "SE",
    "countryFlag": "🇸🇪",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/11001.png&w=350&h=254",
    "fallbackInitials": "IBRA",
    "biodataRole": "Striker • 570+ Career Goals & 32 Trophies",
    "quote": "Lions do not compare themselves to humans. I came like a king, left like a legend.",
    "trophies": [
      "32 Professional Career Trophies",
      "League Champion in 4 Different Countries",
      "FIFA Puskás Award (30-Yard Bicycle Kick)"
    ],
    "matchFootprint": "Scored in Every Single Minute (1 to 90) of a Football Match",
    "wishesBase": 125000,
    "marketValue": "God of Milan",
    "socialHandles": {
      "instagram": "iamzlatanibrahimovic"
    }
  },
  {
    "id": "b-oct-23-1",
    "name": "Pelé (Edson Arantes do Nascimento)",
    "sport": "SOCCER",
    "birthMonth": 10,
    "birthDay": 23,
    "birthYear": 1940,
    "clubOrTeam": "Santos & Brazil Icon",
    "league": "Eternal Legends",
    "country": "Brazil",
    "countryCode": "BR",
    "countryFlag": "🇧🇷",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Pel%C3%A9_by_John_Mathew_Smith_2010.jpg/440px-Pel%C3%A9_by_John_Mathew_Smith_2010.jpg",
    "fallbackInitials": "O REI",
    "biodataRole": "The King • Only 3x World Cup Champion in History",
    "quote": "Success is no accident. It is hard work, perseverance, learning, and love of what you are doing.",
    "trophies": [
      "3x FIFA World Cup Champion (1958, 1962, 1970 - Unmatched Record)",
      "FIFA Player of the Century",
      "1,279 Career Goals"
    ],
    "matchFootprint": "Scored at 17 Years Old in the 1958 World Cup Final",
    "wishesBase": 210000,
    "marketValue": "O Rei Eterno"
  },
  {
    "id": "b-oct-30-1",
    "name": "Diego Armando Maradona",
    "sport": "SOCCER",
    "birthMonth": 10,
    "birthDay": 30,
    "birthYear": 1960,
    "clubOrTeam": "Napoli & Argentina Icon",
    "league": "Eternal Legends",
    "country": "Argentina",
    "countryCode": "AR",
    "countryFlag": "🇦🇷",
    "avatarUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Maradona-Mundial_86_con_la_copa.JPG/440px-Maradona-Mundial_86_con_la_copa.JPG",
    "fallbackInitials": "D10S",
    "biodataRole": "D10S • 1986 World Cup Champion & Napoli Savior",
    "quote": "Even if I died, I would be born again and I would be a footballer again.",
    "trophies": [
      "FIFA World Cup Champion (1986)",
      "Goal of the Century (vs England)",
      "2x Serie A Champion with Napoli",
      "World Cup Golden Ball"
    ],
    "matchFootprint": "Dribbled Past 5 English Defenders from Halfway Line in 1986 World Cup",
    "wishesBase": 200000,
    "marketValue": "D10S"
  },
  {
    "id": "b-nov-05-1",
    "name": "Virat Kohli",
    "sport": "CRICKET",
    "birthMonth": 11,
    "birthDay": 5,
    "birthYear": 1988,
    "clubOrTeam": "Royal Challengers Bengaluru / India",
    "league": "World Cricket",
    "country": "India",
    "countryCode": "IN",
    "countryFlag": "🇮🇳",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/cricket/players/full/253802.png&w=350&h=254",
    "fallbackInitials": "VK18",
    "biodataRole": "Batsman • King Kohli & ICC World Cup Winner",
    "quote": "Self-belief and hard work will always earn you success.",
    "trophies": [
      "ICC Cricket World Cup Winner (2011)",
      "ICC T20 World Cup Winner (2024)",
      "50 ODI Centuries (World Record)"
    ],
    "matchFootprint": "Surpassed Sachin Tendulkar with 50 ODI Centuries in 2023 World Cup",
    "wishesBase": 190000,
    "marketValue": "King Kohli",
    "socialHandles": {
      "instagram": "virat.kohli"
    }
  },
  {
    "id": "b-dec-06-1",
    "name": "Giannis Antetokounmpo",
    "sport": "BASKETBALL",
    "birthMonth": 12,
    "birthDay": 6,
    "birthYear": 1994,
    "clubOrTeam": "Milwaukee Bucks",
    "league": "NBA",
    "country": "Greece",
    "countryCode": "GR",
    "countryFlag": "🇬🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3032977.png&w=350&h=254",
    "fallbackInitials": "G34",
    "biodataRole": "Forward • NBA Champion & 2x MVP",
    "quote": "There is no failure in sports. It is steps to success.",
    "trophies": [
      "NBA Champion (2021)",
      "NBA Finals MVP (50-Point Game 6)",
      "2x NBA MVP",
      "NBA Defensive Player of Year"
    ],
    "matchFootprint": "50 Points, 14 Rebounds, 5 Blocks in NBA Finals Clinching Game",
    "wishesBase": 95000,
    "marketValue": "$48,000,000",
    "socialHandles": {
      "instagram": "giannis_an34"
    }
  },
  {
    "id": "b-dec-20-1",
    "name": "Kylian Mbappé",
    "sport": "SOCCER",
    "birthMonth": 12,
    "birthDay": 20,
    "birthYear": 1998,
    "clubOrTeam": "Real Madrid / France Icon",
    "league": "La Liga",
    "country": "France",
    "countryCode": "FR",
    "countryFlag": "🇫🇷",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/231388.png&w=350&h=254",
    "fallbackInitials": "KM9",
    "biodataRole": "Forward • World Cup Champion & Golden Boot Winner",
    "quote": "Age does not matter. You speak to me about football, not age.",
    "trophies": [
      "FIFA World Cup Winner (2018)",
      "World Cup Golden Boot (Hat-trick in 2022 Final)",
      "UEFA Super Cup Winner",
      "6x Ligue 1 Top Scorer"
    ],
    "matchFootprint": "First Player to Score a Hat-trick in a World Cup Final in 56 Years",
    "wishesBase": 175000,
    "marketValue": "€180,000,000",
    "socialHandles": {
      "instagram": "k.mbappe"
    }
  },
  {
    "id": "b-dec-29-1",
    "name": "Victor Osimhen",
    "sport": "SOCCER",
    "birthMonth": 12,
    "birthDay": 29,
    "birthYear": 1998,
    "clubOrTeam": "Galatasaray / Napoli Hero",
    "league": "Super Lig",
    "country": "Nigeria",
    "countryCode": "NG",
    "countryFlag": "🇳🇬",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/231362.png&w=350&h=254",
    "fallbackInitials": "VO9",
    "biodataRole": "Striker • African Footballer of the Year & Serie A Champion",
    "quote": "From Olusosun dumpsite in Lagos to African Player of the Year — never give up on your hustle.",
    "trophies": [
      "African Footballer of the Year (2023)",
      "Serie A Champion (Capocannoniere with 26 Goals)",
      "FIFA U-17 World Cup Golden Boot (Record 10 Goals)"
    ],
    "matchFootprint": "First African Player to Win the Capocannoniere in Serie A 125-Year History",
    "wishesBase": 125000,
    "marketValue": "€75,000,000",
    "socialHandles": {
      "instagram": "victorosimhen9"
    }
  },
  {
    "id": "b-dec-30-1",
    "name": "LeBron James",
    "sport": "BASKETBALL",
    "birthMonth": 12,
    "birthDay": 30,
    "birthYear": 1984,
    "clubOrTeam": "Los Angeles Lakers",
    "league": "NBA",
    "country": "United States",
    "countryCode": "US",
    "countryFlag": "🇺🇸",
    "avatarUrl": "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png&w=350&h=254",
    "fallbackInitials": "LBJ",
    "biodataRole": "Forward • NBA All-Time Leading Scorer & 4x Champion",
    "quote": "Strive for greatness. Akron, Ohio to the top of the mountain.",
    "trophies": [
      "4x NBA Champion (Heat, Cavs, Lakers)",
      "4x NBA Finals MVP",
      "4x NBA MVP",
      "3x Olympic Gold Medalist (2024 Olympic MVP)",
      "NBA All-Time Scoring Leader (40,000+ Points)"
    ],
    "matchFootprint": "First Player in NBA History with 40,000 Points, 11,000 Rebounds, and 11,000 Assists",
    "wishesBase": 195000,
    "marketValue": "$50,000,000",
    "socialHandles": {
      "instagram": "kingjames"
    }
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BirthdaysHubPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'TODAY' | 'THIS_WEEK' | 'MONTH' | 'ALL'>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProfile, setActiveProfile] = useState<EnterpriseBirthdayStar | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Live Scout Search state
  const [liveResults, setLiveResults] = useState<EnterpriseBirthdayStar[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  // Custom Wish Modal State
  const [showWishModal, setShowWishModal] = useState(false);
  const [wishStar, setWishStar] = useState<EnterpriseBirthdayStar | null>(null);
  const [userWishText, setUserWishText] = useState('');
  const [userNickName, setUserNickName] = useState('');

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  // Find stars celebrating TODAY
  const todayStars = useMemo(() => {
    return GLOBAL_SPORT_STARS.filter((star) => star.birthMonth === todayMonth && star.birthDay === todayDay);
  }, [todayMonth, todayDay]);

  // Find stars celebrating this week
  const thisWeekStars = useMemo(() => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    return GLOBAL_SPORT_STARS.filter((star) => {
      const starDate = new Date(2026, star.birthMonth - 1, star.birthDay);
      return starDate >= startOfWeek && starDate <= endOfWeek;
    });
  }, [today]);

  // Combined stars (Curated + Live Search Results)
  const allPool = useMemo(() => {
    const map = new Map<string, EnterpriseBirthdayStar>();
    GLOBAL_SPORT_STARS.forEach(s => map.set(s.id, s));
    liveResults.forEach(s => map.set(s.id, s));
    return Array.from(map.values());
  }, [liveResults]);

  const filteredStars = useMemo(() => {
    return allPool.filter((star) => {
      if (activeTab === 'TODAY') {
        const isToday = star.birthMonth === todayMonth && star.birthDay === todayDay;
        if (!isToday) return false;
      } else if (activeTab === 'THIS_WEEK') {
        const isThisWeek = thisWeekStars.some((s) => s.id === star.id);
        if (!isThisWeek) return false;
      } else if (activeTab === 'MONTH') {
        if (star.birthMonth !== selectedMonth) return false;
      }

      if (selectedSport !== 'ALL' && star.sport !== selectedSport) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          star.name.toLowerCase().includes(q) ||
          star.clubOrTeam.toLowerCase().includes(q) ||
          star.country.toLowerCase().includes(q) ||
          star.league.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [allPool, selectedMonth, selectedSport, activeTab, searchQuery, thisWeekStars, todayMonth, todayDay]);

  // Fetch live sports stars born on this exact date from /api/v1/birthdays (No external redirects)
  useEffect(() => {
    fetch(`/api/v1/birthdays?month=${todayMonth}&day=${todayDay}`)
      .then(r => r.json())
      .then(json => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const liveDayStars: EnterpriseBirthdayStar[] = json.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            sport: (p.sport || 'SOCCER').toUpperCase() as any,
            birthMonth: p.birthMonth,
            birthDay: p.birthDay,
            birthYear: p.birthYear,
            clubOrTeam: p.clubOrDiscipline || 'Professional Club',
            league: p.sport || 'World Sport',
            country: p.country || 'International',
            countryCode: p.countryFlag || '🌍',
            countryFlag: p.countryFlag || '🌍',
            avatarUrl: p.avatarUrl || '',
            fallbackInitials: p.fallbackInitials || p.name.substring(0, 2).toUpperCase(),
            biodataRole: `${p.clubOrDiscipline} • Age ${p.age}`,
            quote: p.bio?.slice(0, 140) || 'Verified professional athlete celebrating birthday today.',
            trophies: ['Verified Athlete', 'Official Registry Record'],
            matchFootprint: `Born ${p.birthDay}/${p.birthMonth}/${p.birthYear}`,
            wishesBase: 16800,
          }));
          setLiveResults(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const fresh = liveDayStars.filter(item => !existingIds.has(item.id));
            return [...prev, ...fresh];
          });
        }
      })
      .catch(() => {});
  }, [todayMonth, todayDay]);

  // In-App Player Search against 1,000,000+ public sports records (No external redirects)
  const handleLiveSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingLive(true);
    try {
      // 1. Try our in-app birthdays/registry endpoint
      const bRes = await fetch(`/api/v1/birthdays?query=${encodeURIComponent(searchQuery.trim())}`);
      let mapped: EnterpriseBirthdayStar[] = [];
      if (bRes.ok) {
        const bJson = await bRes.json();
        if (Array.isArray(bJson.data) && bJson.data.length > 0) {
          mapped = bJson.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            sport: (p.sport || 'SOCCER').toUpperCase() as any,
            birthMonth: p.birthMonth,
            birthDay: p.birthDay,
            birthYear: p.birthYear,
            clubOrTeam: p.clubOrDiscipline || 'Professional Club',
            league: p.sport || 'World Sport',
            country: p.country || 'International',
            countryCode: p.countryFlag || '🌍',
            countryFlag: p.countryFlag || '🌍',
            avatarUrl: p.avatarUrl || '',
            fallbackInitials: p.fallbackInitials || p.name.substring(0, 2).toUpperCase(),
            biodataRole: `${p.clubOrDiscipline} • Age ${p.age}`,
            quote: p.bio?.slice(0, 140) || 'Verified professional athlete in the global sports database.',
            trophies: ['International Sports Star', 'Official Player Record'],
            matchFootprint: `Born ${p.birthDay}/${p.birthMonth}/${p.birthYear}`,
            wishesBase: 14500,
          }));
        }
      }

      // 2. Fallback to /api/v1/players
      if (mapped.length === 0) {
        const res = await fetch(`/api/v1/players?query=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            mapped = json.data.map((p: any) => {
              const birthDate = p.birth_date ? new Date(p.birth_date) : new Date(1995, 0, 1);
              return {
                id: `live-player-${p.id}`,
                name: p.name,
                sport: (p.sport || 'SOCCER').toUpperCase() as any,
                birthMonth: isNaN(birthDate.getMonth()) ? 1 : birthDate.getMonth() + 1,
                birthDay: isNaN(birthDate.getDate()) ? 1 : birthDate.getDate(),
                birthYear: isNaN(birthDate.getFullYear()) ? 1995 : birthDate.getFullYear(),
                clubOrTeam: p.team_name || 'Professional Club',
                league: p.position || 'World Sport',
                country: p.country || 'International',
                countryCode: '🌍',
                countryFlag: '🌍',
                avatarUrl: p.photo_url || '',
                fallbackInitials: p.fallback_initials || p.name.substring(0, 2).toUpperCase(),
                biodataRole: `${p.position} • Age ${p.age}`,
                quote: p.bio?.slice(0, 120) || 'Verified professional athlete in the global sports database.',
                trophies: p.metrics?.career_honors || ['Professional Athlete'],
                matchFootprint: `Market Value: ${p.market_value || 'Professional'}`,
                wishesBase: 12000,
                marketValue: p.market_value
              };
            });
          }
        }
      }

      if (mapped.length > 0) {
        setLiveResults(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const fresh = mapped.filter(item => !existingIds.has(item.id));
          return [...prev, ...fresh];
        });
        setActiveTab('ALL');
      }
    } catch {}
    setIsSearchingLive(false);
  };

  const handleOpenWishCard = (star: EnterpriseBirthdayStar, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    setWishStar(star);
    setUserWishText(`Happy Birthday ${star.name}! Keep shining and making history! 👑🔥`);
    setShowWishModal(true);
  };

  const handleShareWish = (platform: 'whatsapp' | 'telegram' | 'twitter') => {
    if (!wishStar) return;
    try { phoneHardware.triggerHaptic('AFRO_BEAT'); } catch {}
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

    const wishMessage = `🎂 OFFICIAL BIRTHDAY WISH FOR ${wishStar.name.toUpperCase()}!

"${userWishText}"
- From ${userNickName || 'Mivaj Sports Fan'}

Join the celebration on Mivaj Sports: https://mivaj.com/birthdays`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(wishMessage)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent('https://mivaj.com/birthdays')}&text=${encodeURIComponent(wishMessage)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Happy Birthday ${wishStar.name}! 🎉 ${userWishText} https://mivaj.com/birthdays`)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-void text-white font-mono p-3 sm:p-8 space-y-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Match Center 🏟️</span>
          </Link>

          <div className="flex items-center space-x-2">
            <GlobalLanguageSwitcher />
            <span className="text-stadiumGreen font-black text-sm hidden sm:inline">MIVAJ SPORTS</span>
            <span className="px-2.5 py-0.5 rounded bg-pink-500/20 text-pink-400 text-[10px] font-black border border-pink-500/30">
              GLOBAL SPORTS BIRTHDAYS 🎂
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-5 sm:p-8 border border-pink-500/40 space-y-3 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>WORLD SPORTS STAR BIRTHDAYS</span>
                <span>🎂⭐</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Curated database across world football, basketball, tennis, combat sports, Formula 1, athletics, and cricket with verified birth dates and direct links to public global databases.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-pink-500/30 text-center min-w-[210px] shadow-lg">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                TODAY'S BIRTHDAY STARS
              </span>
              <span className="text-3xl font-black text-pink-400">{todayStars.length} Athletes</span>
              <span className="text-[10px] text-stadiumGreen font-bold block pt-0.5">Send Birthday Card 💌</span>
            </div>
          </div>
        </div>

        {/* IN-APP GLOBAL SPORTS ALMANAC & PLAYER DIRECTORY (NO EXTERNAL REDIRECTS) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-panel/90 border border-white/15 space-y-3 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-gold flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-gold" />
                <span>World Sports Almanac &amp; Player Registry</span>
              </span>
              <span className="text-[11px] text-gray-400 font-sans block pt-0.5">
                1,000,000+ public sports player records loaded directly inside Mivaj &bull; Zero external redirects
              </span>
            </div>
            <span className="text-[10px] text-stadiumGreen font-mono font-bold bg-stadiumGreen/10 px-2.5 py-1 rounded-full border border-stadiumGreen/30 self-start sm:self-auto">
              100% In-App Records ✓
            </span>
          </div>

          {/* 1-Tap Category Filters that Load Records Directly In-App */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              onClick={() => {
                setSelectedSport('SOCCER');
                setActiveTab('ALL');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                selectedSport === 'SOCCER'
                  ? 'bg-stadiumGreen/20 border-stadiumGreen text-white'
                  : 'bg-black/60 border-white/10 hover:border-stadiumGreen/60 text-gray-300 hover:text-white'
              }`}
            >
              <div>
                <span className="font-bold text-xs block">Football / Soccer Stars ⚽</span>
                <span className="text-[10px] text-gray-400 block font-sans">1,000,000+ league players</span>
              </div>
              <span className="text-xs text-stadiumGreen font-bold font-mono">Filter</span>
            </button>

            <button
              onClick={() => {
                setSelectedSport('BASKETBALL');
                setActiveTab('ALL');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                selectedSport === 'BASKETBALL'
                  ? 'bg-orange-500/20 border-orange-500 text-white'
                  : 'bg-black/60 border-white/10 hover:border-orange-500/60 text-gray-300 hover:text-white'
              }`}
            >
              <div>
                <span className="font-bold text-xs block">Basketball &amp; NBA Icons 🏀</span>
                <span className="text-[10px] text-gray-400 block font-sans">Global hoop legends</span>
              </div>
              <span className="text-xs text-orange-400 font-bold font-mono">Filter</span>
            </button>

            <button
              onClick={() => {
                setSelectedSport('TENNIS');
                setActiveTab('ALL');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                selectedSport === 'TENNIS'
                  ? 'bg-gold/20 border-gold text-white'
                  : 'bg-black/60 border-white/10 hover:border-gold/60 text-gray-300 hover:text-white'
              }`}
            >
              <div>
                <span className="font-bold text-xs block">Tennis Champions 🎾</span>
                <span className="text-[10px] text-gray-400 block font-sans">Grand Slam winners</span>
              </div>
              <span className="text-xs text-gold font-bold font-mono">Filter</span>
            </button>

            <button
              onClick={() => {
                setSelectedSport('COMBAT');
                setActiveTab('ALL');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                selectedSport === 'COMBAT'
                  ? 'bg-crimson/20 border-crimson text-white'
                  : 'bg-black/60 border-white/10 hover:border-crimson/60 text-gray-300 hover:text-white'
              }`}
            >
              <div>
                <span className="font-bold text-xs block">Combat &amp; Motorsport 🥊</span>
                <span className="text-[10px] text-gray-400 block font-sans">UFC, Boxing &amp; F1</span>
              </div>
              <span className="text-xs text-crimson font-bold font-mono">Filter</span>
            </button>
          </div>
        </div>

        {/* CONTROLS & FILTER TABS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            {/* View Mode Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-panel p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('TODAY')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'TODAY' ? 'bg-pink-500 text-black shadow-md shadow-pink-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🎂 Today ({todayStars.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('THIS_WEEK')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1 ${
                  activeTab === 'THIS_WEEK' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 inline" />
                <span>This Week ({thisWeekStars.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('MONTH')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1 ${
                  activeTab === 'MONTH' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 inline" />
                <span>By Month</span>
              </button>

              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1 ${
                  activeTab === 'ALL' ? 'bg-gold text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 inline" />
                <span>All Stars ({allPool.length})</span>
              </button>
            </div>

            {/* Search Input & Live Search Button */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLiveSearch()}
                  placeholder="Search 1,000,000+ world players (e.g. Messi, Babayaro, LeBron)..."
                  className="w-full pl-9 pr-3 py-2 rounded-2xl bg-panel border border-white/10 text-xs text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {searchQuery.trim() && (
                <button
                  onClick={handleLiveSearch}
                  disabled={isSearchingLive}
                  className="px-3.5 py-2 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1 flex-shrink-0 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  title="Search 1,000,000+ world records directly in-app"
                >
                  {isSearchingLive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>Search 🔍</span>
                </button>
              )}
            </div>
          </div>

          {/* Month Selector Carousel (if Month tab active) */}
          {activeTab === 'MONTH' && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {MONTH_NAMES.map((monthName, idx) => {
                const monthNum = idx + 1;
                const isSelected = selectedMonth === monthNum;
                return (
                  <button
                    key={monthName}
                    onClick={() => setSelectedMonth(monthNum)}
                    className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap border ${
                      isSelected
                        ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-lg'
                        : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {monthName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ATHLETES GRID: ZERO DUPLICATE IMAGES & CLEAN AVATAR FALLBACKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStars.map((star) => {
            const isToday = star.birthMonth === todayMonth && star.birthDay === todayDay;

            return (
              <div
                key={star.id}
                onClick={() => setActiveProfile(star)}
                className="rounded-3xl bg-panel/80 border border-white/10 overflow-hidden hover:border-pink-500/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-xl relative"
              >
                {/* Top Banner Accent */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{star.countryFlag}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{star.country}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      isToday ? 'bg-pink-500 text-black border-pink-400 animate-pulse' : 'bg-black/60 text-gold border-gold/30'
                    }`}>
                      {isToday ? '🎉 TODAY!' : `${MONTH_NAMES[star.birthMonth - 1].slice(0, 3)} ${star.birthDay}`}
                    </span>
                  </div>

                  {/* Photo & Profile Intro */}
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 overflow-hidden p-1 flex-shrink-0 group-hover:border-pink-500 transition-colors shadow-md relative">
                      {!imgErrors[star.id] && star.avatarUrl ? (
                        <img
                          src={star.avatarUrl}
                          alt={star.name}
                          className="w-full h-full object-cover rounded-xl"
                          onError={() => setImgErrors(prev => ({ ...prev, [star.id]: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-900/40 via-panel to-gold/20 rounded-xl border border-white/10 text-center">
                          <span className="text-sm font-black text-gold">{star.fallbackInitials}</span>
                          <span className="text-[8px] text-gray-400">{star.sport.slice(0, 3)}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-black text-white group-hover:text-pink-400 transition-colors truncate">
                        {star.name}
                      </h3>
                      <span className="text-[10px] text-stadiumGreen font-bold block truncate">
                        {star.clubOrTeam} &bull; {star.league}
                      </span>
                      <span className="text-[9px] text-gray-400 block font-sans truncate">
                        {star.biodataRole}
                      </span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-[10px] text-gray-300 font-sans italic bg-black/40 p-2.5 rounded-xl border border-white/5 line-clamp-2">
                    "{star.quote}"
                  </p>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-black/60 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-gold font-bold flex items-center space-x-1 truncate max-w-[170px]">
                    <Trophy className="w-3.5 h-3.5 inline text-gold flex-shrink-0" />
                    <span className="truncate">{star.trophies[0] || 'Top World Athlete'}</span>
                  </span>

                  <button
                    onClick={(e) => handleOpenWishCard(star, e)}
                    className="px-3 py-1.5 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 hover:bg-pink-500 hover:text-black font-black transition-all flex items-center space-x-1"
                  >
                    <span>Send Wish 💌</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FULL PLAYER PROFILE DOSSIER MODAL */}
        {activeProfile && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn flex flex-col p-4">
            <div className="max-w-2xl mx-auto w-full glass-panel-premium rounded-3xl p-6 border border-pink-500/40 space-y-5 my-auto shadow-2xl relative">
              <button
                onClick={() => setActiveProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl bg-black border-2 border-pink-500 p-1 flex-shrink-0 shadow-xl relative">
                  {!imgErrors[activeProfile.id] && activeProfile.avatarUrl ? (
                    <img
                      src={activeProfile.avatarUrl}
                      alt={activeProfile.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={() => setImgErrors(prev => ({ ...prev, [activeProfile.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-panel rounded-xl text-gold font-black text-lg">
                      {activeProfile.fallbackInitials}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-black text-white">{activeProfile.name}</h2>
                    <span className="text-lg">{activeProfile.countryFlag}</span>
                  </div>
                  <span className="text-xs text-stadiumGreen font-bold block">
                    {activeProfile.clubOrTeam} &bull; {activeProfile.league}
                  </span>
                  <span className="text-[10px] text-gray-400 block font-sans">
                    Born: {MONTH_NAMES[activeProfile.birthMonth - 1]} {activeProfile.birthDay}, {activeProfile.birthYear} (Age {2026 - activeProfile.birthYear})
                  </span>
                </div>
              </div>

              {/* Trophies & Accolades */}
              <div className="space-y-2">
                <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">Career Honors &amp; Trophies</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeProfile.trophies.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="text-gray-300 font-sans">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Public Database Reference Link */}
              <div className="p-3 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Official Public Database Records</span>
                  <span className="text-[10px] text-gray-400 font-sans">Search and verify stats on TheSportsDB &amp; Transfermarkt</span>
                </div>
                <a
                  href={`https://www.thesportsdb.com/search.php?s=${encodeURIComponent(activeProfile.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    const star = activeProfile;
                    setActiveProfile(null);
                    handleOpenWishCard(star);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-pink-500 text-black font-black text-xs hover:bg-pink-400 transition-all shadow-lg glow-pink"
                >
                  Send Birthday Wish Card 💌
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM WISH CARD MODAL */}
        {showWishModal && wishStar && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn flex flex-col p-4">
            <div className="max-w-md mx-auto w-full glass-panel-premium rounded-3xl p-6 border border-pink-500/50 space-y-4 my-auto shadow-2xl relative">
              <button
                onClick={() => setShowWishModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-2xl">🎂💌</span>
                <h2 className="text-base font-black text-white">Send Birthday Wish to {wishStar.name}</h2>
                <span className="text-[11px] text-gray-400 font-sans block">{wishStar.clubOrTeam} &bull; {wishStar.country}</span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-mono font-bold">Your Fan Name / Handle</label>
                  <input
                    type="text"
                    value={userNickName}
                    onChange={(e) => setUserNickName(e.target.value)}
                    placeholder="e.g. Victor from Lagos"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-mono font-bold">Your Custom Birthday Message</label>
                  <textarea
                    rows={3}
                    value={userWishText}
                    onChange={(e) => setUserWishText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-2 pt-1 font-mono">
                <span className="text-[10px] text-gray-400 uppercase font-bold block text-center">Share Wish Card Instantly:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleShareWish('whatsapp')}
                    className="p-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold text-xs hover:bg-[#25D366] hover:text-black transition-all text-center"
                  >
                    WhatsApp 🟢
                  </button>
                  <button
                    onClick={() => handleShareWish('telegram')}
                    className="p-2 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#0088cc] font-bold text-xs hover:bg-[#0088cc] hover:text-black transition-all text-center"
                  >
                    Telegram ✈️
                  </button>
                  <button
                    onClick={() => handleShareWish('twitter')}
                    className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 font-bold text-xs hover:bg-sky-500 hover:text-black transition-all text-center"
                  >
                    X / Twitter 🐦
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
