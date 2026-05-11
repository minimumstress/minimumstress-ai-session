'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Sparkles, Activity, Brain, ShieldCheck, RefreshCcw } from "lucide-react";
import CategorySelector from "@/components/CategorySelector";

export default function SessionPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [category, setCategory] = useState("");
  
  // HAFIZA YÖNETİMİ: Kesintisiz akış için Ref kullanıyoruz
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const historyRef = useRef<any[]>([]);
  const categoryRef = useRef("");
  const recognitionRef = useRef<any>(null);

  // 1. MİKROFON: Sadece 1 kez kurulur, asla resetlenmez
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        askGemini(text); 
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []); // BOŞ BAĞIMLILIK: Kesilmeyi önleyen anahtar

  const askGemini = async (userInput: string) => {
    if (!userInput.trim()) return;
    setIsThinking(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userInput, 
          history: historyRef.current, // DÜZELTME: State yerine doğrudan Ref'i gönder
          category: categoryRef.current 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Backend Error:", data.error);
        setAiResponse("I'm experiencing a sync delay. Let's try once more.");
        return;
      }

      const botReply = data.text;
      
      // DÜZELTME: Hafızayı hem Ref'e hem State'e aynı anda ve eksiksiz yaz
      const updatedHistory = [
        ...historyRef.current,
        { role: "user", parts: [{ text: userInput }] },
        { role: "model", parts: [{ text: botReply }] }
      ];
      
      historyRef.current = updatedHistory;
      setChatHistory(updatedHistory);

      setAiResponse(botReply);
      speak(botReply);
    } catch (error: any) {
      console.error("Neural Error:", error);
      setAiResponse("Connection failed. Check your network or API Key.");
    } finally {
      setIsThinking(false);
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha") || v.name.includes("Zira"));
    
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.lang = 'en-US';
    utterance.rate = 0.75; 
    utterance.pitch = 1.1; 
    
    utterance.onend = () => {
      setTimeout(() => startListening(), 600);
    };
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (isThinking) return;
    setTranscript("");
    setIsListening(true);
    try { recognitionRef.current?.start(); } catch (e) { console.log("Mic busy"); }
  };

  const handleStartSession = async (selectedCat: string) => {
    categoryRef.current = selectedCat;
    setCategory(selectedCat);
    setIsStarted(true);
    setIsThinking(true); // AI'ın düşünme animasyonunu başlat

    try {
      // Arka plana "Bana havalı bir giriş cümlesi yarat" diyoruz
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category: selectedCat,
          isGreeting: true // Bu flag sayesinde Gemini selam veriyor
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const dynamicGreeting = data.text;
        
        // Gelen selamı ekrana bas ve seslendir
        setAiResponse(dynamicGreeting);
        speak(dynamicGreeting);

        // Gelecek konuşmalar için ilk mesajı hafızaya kaydet!
        const initialHistory = [{ role: "model", parts: [{ text: dynamicGreeting }] }];
        historyRef.current = initialHistory;
        setChatHistory(initialHistory);
      }
    } catch (error) {
      console.error("Greeting failed:", error);
      const fallback = `Welcome to your ${selectedCat} session. How can I support you today?`;
      setAiResponse(fallback);
      speak(fallback);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center p-6 text-[#1D1D1F]">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xl text-center space-y-12">
             <h1 className="text-5xl font-medium tracking-tight">Neural Link</h1>
             <CategorySelector onSelect={handleStartSession} />
          </motion.div>
        ) : (
          <motion.div key="session" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-3xl">
            <div className="bg-white p-12 rounded-[60px] shadow-2xl border border-zinc-100 flex flex-col items-center gap-10">
              <div className="flex gap-4">
                 <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isListening ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                    {isListening ? 'Listening...' : 'Standby'}
                 </div>
                 <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isThinking ? 'bg-cyan-50 text-cyan-500 border-cyan-100 animate-pulse' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                    {isThinking ? 'Processing...' : 'Link Active'}
                 </div>
              </div>

              <div className="text-center space-y-10 w-full">
                 <div className="space-y-2">
                    <p className="text-[10px] text-zinc-300 uppercase font-black">Your Voice</p>
                    <p className="text-xl font-medium text-zinc-400 italic">"{transcript || "..."}"</p>
                 </div>
                 <div className="h-[1px] w-24 bg-zinc-100 mx-auto" />
                 <div className="space-y-4">
                    <p className="text-[10px] text-cyan-500 uppercase font-black tracking-widest">{category} Response</p>
                    <p className="text-3xl font-serif text-zinc-800 italic leading-snug">
                      {aiResponse}
                    </p>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                {isListening && (
                    <div className="flex gap-1.5 h-10 items-center">
                        {[1,2,3,4,5].map(i => (
                            <motion.div key={i} animate={{ height: [10, 30, 10] }} transition={{ repeat: Infinity, duration: 0.5, delay: i*0.1 }} className="w-1.5 bg-cyan-400 rounded-full" />
                        ))}
                    </div>
                )}
                {!isListening && !isThinking && (
                    <button onClick={startListening} className="p-6 bg-cyan-500 text-white rounded-full shadow-lg hover:scale-110 transition-all"><Mic size={32} /></button>
                )}
                <button onClick={() => window.location.reload()} className="text-[10px] font-bold text-zinc-300 hover:text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCcw size={12} /> Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}