'use client';

import { useState, useEffect, useRef } from 'react';

export default function VoicePage() {
  const [recognizedText, setRecognizedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const langRef = useRef('tr-TR'); // Varsayılan Türkçe

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tarayıcınız sesli konuşmayı desteklemiyor.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langRef.current;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
      setListening(false);

      // AI'ye gönder
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: transcript }),
      });

      const data = await res.json();
      setAiResponse(data.response);

      // AI yanıtını doğru dilde sesli oku
      const utterance = new SpeechSynthesisUtterance(data.response);
      utterance.lang = recognition.lang; // aynı dilde oku
      speechSynthesis.speak(utterance);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error('Hata:', e);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setRecognizedText('');
      setAiResponse('');
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎤 Sesli Konuşma</h1>
      <p><strong>Tanımlanan Metin:</strong> {recognizedText}</p>
      <p><strong>AI Yanıtı:</strong> {aiResponse}</p>

      <button onClick={startListening} disabled={listening}>
        Dinlemeye Başla
      </button>
      <button onClick={stopListening} disabled={!listening} style={{ marginLeft: 10 }}>
        Durdur
      </button>
    </div>
  );
}
