'use client';

import React, { useState, useEffect, useRef } from 'react';
import AvatarInterface from '@/components/AvatarInterface';

// HeyGen SDK'sını kullanacağız (npm install @heygen/streaming-avatar)
import StreamingAvatar, { AvatarQuality, StreamingEvents } from '@heygen/streaming-avatar';

export default function SessionManager() {
  const [sessionState, setSessionState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const heygenAvatarId = "8a00795774f646939ae59f5b6195a671"; // Senin Avatar ID'n

  useEffect(() => {
    // Bileşen unmount olduğunda oturumu temizle
    return () => {
      if (avatarRef.current) {
        avatarRef.current.stopAvatar();
      }
    };
  }, []);

  const startSession = async () => {
    try {
      setIsSessionActive(true);
      
      // 1. Backend'den güvenli bir şekilde HeyGen Token al (Bir sonraki adımda bu API'yi yazacağız)
      const response = await fetch('/api/heygen-token', { method: 'POST' });
      const { token } = await response.json();

      // 2. HeyGen Avatar nesnesini başlat
      const avatar = new StreamingAvatar({ token });
      avatarRef.current = avatar;

      // 3. WebRTC Stream olaylarını dinle
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log("Stream hazır!", event.detail);
        setStream(event.detail); // Stream'i arayüze gönder
        setSessionState('listening');
      });

      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setSessionState('speaking');
      });

      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        setSessionState('listening');
      });

      // 4. Oturumu başlat
      await avatar.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: heygenAvatarId,
      });

      // 5. Mikrofonu aç ve dinlemeye başla (Voice Chat modunu aktif et)
      await avatar.startVoiceChat();

    } catch (error) {
      console.error("Seans başlatılamadı:", error);
      setIsSessionActive(false);
      setSessionState('idle');
    }
  };

  const endSession = async () => {
    if (avatarRef.current) {
      await avatarRef.current.stopAvatar();
      setStream(null);
      setIsSessionActive(false);
      setSessionState('idle');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] p-6">
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100 relative">
        
        {/* Daha önce yazdığımız AvatarInterface'i çağırıyoruz */}
        <AvatarInterface mode={sessionState} stream={stream} />

        {/* Kontrol Paneli */}
        <div className="absolute bottom-8 right-8 flex gap-4">
          {!isSessionActive ? (
            <button 
              onClick={startSession}
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg"
            >
              Seansı Başlat
            </button>
          ) : (
            <button 
              onClick={endSession}
              className="bg-red-500 text-white px-8 py-3 rounded-full font-medium hover:bg-red-600 transition-all shadow-lg"
            >
              Seansı Bitir
            </button>
          )}
        </div>

      </div>
    </div>
  );
}