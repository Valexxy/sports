export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  sanitizedText: string;
}

export class SpamFilterEngine {
  private static SPAM_REGEXES = [
    /(?:\+?234|0)[789][01]\d{8}/gi,
    /whatsapp\s*(?:me|number|us|dm|chat)?\s*[:\-\s]*\+?\d+/gi,
    /wa\.me\/\d+/gi,
    /t\.me\/(?!mivajsport)[a-z0-9_]+/gi,
    /\b(100%|sure|guaranteed)\s*(fixed|correct\s*score|banker\s*odds)\b/gi,
    /\b(call\s*(baba|alhadji|prophet)|pay\s*after\s*win|fixed\s*slip)\b/gi,
    /\bhttps?:\/\/(?:bit\.ly|tinyurl\.com|cutt\.ly|goo\.gl)\/\S+/gi,
  ];

  private static BLOCKED_TERMS = [
    'inbox me', 'dm me', 'contact me', 'whatsapp me', 'call me', 'ping me',
    'fixed match', 'sure banker', 'pay first', 'sure odds', 'i have sure',
    'motherfucker', 'bastard', 'ashawo', 'oloshi', 'mumu', 'werey', 'ode'
  ];

  public static validate(text: string): ValidationResult {
    const trimmed = text.trim();
    if (trimmed.length < 3) return { isValid: false, reason: 'Too short (min 3 characters)', sanitizedText: trimmed };
    if (trimmed.length > 600) return { isValid: false, reason: 'Too long (max 600 characters)', sanitizedText: trimmed.slice(0, 600) };
    for (const regex of this.SPAM_REGEXES) {
      regex.lastIndex = 0;
      if (regex.test(trimmed)) return { isValid: false, reason: 'Spam, scam links, or phone numbers detected', sanitizedText: trimmed };
    }
    const lower = trimmed.toLowerCase();
    for (const term of this.BLOCKED_TERMS) {
      if (lower.includes(term)) return { isValid: false, reason: 'Inappropriate language detected', sanitizedText: trimmed };
    }
    return { isValid: true, sanitizedText: trimmed };
  }
}
