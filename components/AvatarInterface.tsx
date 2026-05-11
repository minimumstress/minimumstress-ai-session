'use client';

import React, { useRef, useEffect } from 'react';

interface AvatarInterfaceProps {
  mode: 'idle' | 'listening' | 'speaking';
  stream?: MediaStream | null; // HeyGen veya Daily.co'dan gelecek video akışı
}

export default function AvatarInterface({ mode, stream }: AvatarInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Gelen WebRTC stream'i video elementine bağlıyoruz
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full h-[500px] bg-[#FAFAFA] relative overflow-hidden flex items-center justify-center">
      
      {/* Avatar Video Akışı */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-700 ${stream ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: 'none' }}
      />

      {/* Stream henüz yokken gösterilecek minimalist bekleme ekranı */}
      {!stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA]">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-cyan-600 rounded-full animate-spin mb-4" />
          <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">Bağlantı Kuruluyor...</span>
        </div>
      )}

      {/* Durum Göstergesi (Status Badge) */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-full border border-gray-100 shadow-sm">
        <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
          mode === 'speaking' ? 'bg-cyan-500 animate-pulse' :
          mode === 'listening' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'
        }`} />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {mode === 'speaking' ? 'COACH IS SPEAKING' :
           mode === 'listening' ? 'COACH IS LISTENING' : 'COACH IS READY'}
        </span>
      </div>

    </div>
  );
}