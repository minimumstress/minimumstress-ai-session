"use client";

import { motion } from "framer-motion";

type Props = {
  mode?: "idle" | "listening" | "speaking";
};

export default function HologramCore({ mode = "idle" }: Props) {
  // Modlara göre ölçeklendirme (speaking modunda daha enerjik)
  const scaleMap = {
    idle: [1, 1.03, 1],
    listening: [1, 1.1, 1.05, 1.15, 1],
    speaking: [1, 1.18, 0.95, 1.25, 1],
  };

  // Modlara göre dış parlama renkleri
  const glowMap = {
    idle: "shadow-[0_0_90px_rgba(86,190,255,0.25)]",
    listening: "shadow-[0_0_120px_rgba(34,211,238,0.45)]",
    speaking: "shadow-[0_0_160px_rgba(16,185,129,0.5)]", // Konuşurken yeşile çalan bir güven rengi
  };

  return (
    <div className="relative flex h-[360px] w-[360px] items-center justify-center sm:h-[450px] sm:w-[450px]">
      
      {/* 1. DIŞ ATMOSFER (Aura) */}
      <motion.div
        className="absolute h-[350px] w-[350px] rounded-full border border-cyan-400/5 bg-cyan-400/5 blur-[80px] sm:h-[420px] sm:w-[420px]"
        animate={{ 
          scale: mode === "idle" ? [1, 1.1, 1] : [1, 1.3, 1],
          opacity: mode === "idle" ? 0.3 : 0.6 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2. DÖNEN HALKALAR (Teknoloji Hissi) */}
      <motion.div
        className="absolute h-[320px] w-[320px] rounded-full border-t border-b border-white/10 sm:h-[380px] sm:w-[380px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute h-[280px] w-[280px] rounded-full border-l border-r border-cyan-300/20 sm:h-[340px] sm:w-[340px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* 3. ANA ÇEKİRDEK (Hologram Küresi) */}
      <motion.div
        className={`absolute h-[190px] w-[190px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff,rgba(107,213,255,1)_30%,rgba(56,189,248,0.8)_60%,rgba(15,23,42,1)_95%)] ${glowMap[mode]} sm:h-[230px] sm:w-[230px] z-20`}
        animate={{
          scale: scaleMap[mode],
          opacity: [0.95, 1, 0.95],
          rotate: mode === "speaking" ? [0, 5, -5, 0] : 0
        }}
        transition={{
          duration: mode === "idle" ? 5 : 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 4. KONUŞMA PARÇACIKLARI (Orbiting Dust) */}
      {mode !== "idle" && (
        <>
          <motion.div
            className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_15px_white] z-30"
            animate={{
              x: [120, 0, -120, 0, 120],
              y: [0, 120, 0, -120, 0],
              scale: [1, 1.5, 1, 0.5, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_10px_cyan] z-30"
            animate={{
              x: [-100, 0, 100, 0, -100],
              y: [0, -100, 0, 100, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      {/* 5. TABAN YANSIMASI (Floor Glow) */}
      <motion.div
        className="absolute -bottom-4 h-[15px] w-[200px] rounded-[100%] bg-cyan-400/20 blur-xl"
        animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [0.8, 1.2, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* 6. TARAMA ÇİZGİSİ (Scanner Effect) */}
      <motion.div
        className="absolute h-[1px] w-[250px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent z-40"
        animate={{ y: [-100, 100, -100] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ opacity: mode === "idle" ? 0.1 : 0.4 }}
      />

    </div>
  );
}