/**
 * BROWSER-NATIVE WEB SPEECH & VOICE ENGINE
 * Hands-free Voice Search & Live Match Commentator Text-to-Speech
 * 100% Free with zero API keys required.
 */

// 1. Text-to-Speech Stadium Commentator Voice
export function speakStadiumCommentary(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0; // Commentator tempo
    utterance.pitch = 1.1; // Excited pitch

    // Prefer English voices
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
  }
}

// 2. Voice Search Match Filter Hook
export function startVoiceSearch(onResult: (transcript: string) => void) {
  if (typeof window === 'undefined') return;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('🎤 Voice search is not supported in this browser. Try Chrome or Safari!');
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (err: any) => {
      console.warn('Voice recognition error:', err);
    };

    recognition.start();
  } catch (err) {
    console.warn('Voice recognition initialization failed:', err);
  }
}
