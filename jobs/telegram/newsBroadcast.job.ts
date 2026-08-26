/**
 * REAL-TIME BREAKING NEWS TELEGRAM BROADCASTER
 */
import { TelegramBotService } from "../../services/telegram/botService";

export interface NewsStoryPayload {
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  slug?: string;
}

export async function processNewsBroadcast(story: NewsStoryPayload) {
  let caption = "🚨 <b>" + (story.category || "BREAKING SPORTS WIRE") + "</b>\n\n";
  caption += "<b>" + story.title + "</b>\n\n";
  caption += story.description + "\n\n";
  caption += "<i>Read full analysis &amp; roster updates on Mivaj:</i>";

  const inlineKeyboard = [
    [
      { text: "📖 Read Full Story on Mivaj", url: "https://mivaj.com/news/" + (story.slug || "") },
      { text: "📲 Share to Friends", url: "https://t.me/share/url?url=https://mivaj.com&text=" + encodeURIComponent("🚨 " + story.title) },
    ],
  ];

  if (story.imageUrl) {
    return TelegramBotService.sendPhoto(story.imageUrl, caption, inlineKeyboard);
  } else {
    return TelegramBotService.sendMessage(caption, inlineKeyboard);
  }
}