'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Volume2, BrainCircuit, Sparkles } from "lucide-react";
import CategorySelector from "@/components/CategorySelector";

export default function DebugNeuralPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  // BEYİN: Koçun nasıl düşündüğünü simüle eder
  const getCoachResponse = (category: string) => {
    const responses: any = {
      "Yoga Instructor": "Nefesine odaklan. Matın üzerindeki bu an sadece senin. Akışa başlamaya hazır mısın?",
      "Pilates Instructor": "Merkez bölgeni (core) sıkı tut. Omurganı hisset. Bugün gücümüzü bulacağız.",
      "Spiritual Coach": "Evrenin enerjisi seninle. İçindeki sessizliği dinle, cevaplar orada saklı.",
      "Financial Wellness": "Finansal özgürlük bir yolculuktur. Harcamalarını değil, niyetini kontrol et."
    };
    return responses[category] || "Bugün hangi wellness yoluna girmek istersin?";
  };

  // SES: Tarayıcının ses motorunu kullanır (D-ID'ye muhtaç kalmadan test için)
  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9; // Biraz daha sakin/wellness tarzı
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartSession = () => {
    if (!selectedCategory) {
      alert("Lütfen önce bir kategori seç!");
      return;
    }
    
    setIsThinking(true);
    setAiResponse("Neural Link kuruluyor...");

    // 1 saniye "düşünme" simülasyonu (Self-learning logic testi)
    setTimeout(() => {
      const response = getCoachResponse(selectedCategory);
      setAiResponse(response);
      speakResponse(response);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100 text-center"
      >
        <div className="flex justify-center mb-8">
           <div className="p-4 bg-cyan-50 rounded-3xl">
              <BrainCircuit className="text-cyan-500" size={40} />
           </div>
        </div>

        <h1 className="text-3xl font-medium tracking-tight mb-4">Neural Logic Debugger</h1>
        <p className="text-zinc-400 mb-10">Fonksiyonları test etmek için bir kategori seç ve "Zihin Linki" kur.</p>

        <CategorySelector onSelect={(cat) => setSelectedCategory(cat)} />

        <div className="mt-12 p-8 bg-zinc-50 rounded-[30px] border border-dashed border-zinc-200 relative min-h-[150px] flex items-center justify-center">
          {isThinking ? (
            <div className="flex flex-col items-center gap-3">
               <Sparkles className="text-cyan-400 animate-spin" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">AI Thinking...</span>
            </div>
          ) : (
            <p className="text-zinc-600 font-serif text-xl italic leading-relaxed">
              {aiResponse || "Seansın başlaması için bekleniyor..."}
            </p>
          )}
        </div>

        <button 
          onClick={handleStartSession}
          disabled={isThinking}
          className="w-full mt-8 py-5 bg-black text-white rounded-full font-bold hover:shadow-2xl transition-all disabled:opacity-30 flex items-center justify-center gap-3"
        >
          <Volume2 size={20} />
          {isThinking ? "PROCESSING NEURAL DATA" : "INITIALIZE VOICE LINK"}
        </button>
      </motion.div>

      <footer className="mt-12 text-[10px] font-bold text-zinc-300 uppercase tracking-[0.5em]">
        Minimum Stress LLC • Neural Testing Unit
      </footer>
    </main>
  );
}