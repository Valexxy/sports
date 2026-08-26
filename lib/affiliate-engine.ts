export interface BookmakerPartner {
  id: string;
  name: string;
  logo: string;
  affiliateUrl: string;
  affiliateId: string;
  bonusText: string;
  primaryColor: string;
}

export const BOOKMAKER_PARTNERS: Record<string, BookmakerPartner> = {
  "STAKE": {
    id: "STAKE",
    name: "Stake.com",
    logo: "https://stake.com/favicon.ico",
    affiliateUrl: "https://stake.com/?c=bPn8D0iA",
    affiliateId: "bPn8D0iA",
    bonusText: "200% VIP Welcome Bonus up to $1,000 (Code: bPn8D0iA)",
    primaryColor: "#1475e1",
  },
  "22BET": {
    id: "22BET",
    name: "22Bet Nigeria",
    logo: "https://22bet.ng/favicon.ico",
    affiliateUrl: "https://22bet.ng/?tag=d_972744m_97c_",
    affiliateId: "972744",
    bonusText: "100% Welcome Bonus up to ₦130,000",
    primaryColor: "#008b8b",
  },
  "SPORTYBET": {
    id: "SPORTYBET",
    name: "SportyBet",
    logo: "https://www.sportybet.com/favicon.ico",
    affiliateUrl: "https://sportybet.com/ng?ref=aurascore",
    affiliateId: "aurascore_ng",
    bonusText: "150% Multi-Bet Bonus Boost",
    primaryColor: "#e41b23",
  },
  "BET9JA": {
    id: "BET9JA",
    name: "Bet9ja",
    logo: "https://bet9ja.com/favicon.ico",
    affiliateUrl: "https://bet9ja.com?ref=aurascore",
    affiliateId: "aurascore_9ja",
    bonusText: "100% Deposit Match + FireBets",
    primaryColor: "#006633",
  },
  "1XBET": {
    id: "1XBET",
    name: "1xBet",
    logo: "https://1xbet.ng/favicon.ico",
    affiliateUrl: "https://1xbet.ng?ref=aurascore",
    affiliateId: "aurascore_1x",
    bonusText: "300% First Deposit Bonus",
    primaryColor: "#1e88e5",
  },
};

export function getStakeDeepLink(): string {
  return "https://stake.com/?c=bPn8D0iA";
}

export function get22BetDeepLink(bookingCode?: string): string {
  return "https://22bet.ng/?tag=d_972744m_97c_" + (bookingCode ? "&code=" + bookingCode : "");
}