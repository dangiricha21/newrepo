/* eslint-disable @typescript-eslint/no-explicit-any */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const startVoiceDetection = (callback: (text: string) => void) => {
  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onerror = (e: any) => {
    console.error("Mic error:", e.error);
  };

  recognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript;

    if (!text || text.trim() === "") {
      console.warn("Empty voice input");
      return;
    }

    callback(text);
  };

  try {
    recognition.start();
  } catch (err) {
    console.error("Mic start failed:", err);
  }
};