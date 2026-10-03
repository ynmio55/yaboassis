// 100% Free Offline Thai Text-to-Speech (TTS) Voice Feedback

export function speakThai(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Try to find a Thai voice if available in system
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find((v) => v.lang.includes('th') || v.lang.includes('TH'));
      if (thaiVoice) {
        utterance.voice = thaiVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS Speech Synthesis error:', err);
    }
  }
}
