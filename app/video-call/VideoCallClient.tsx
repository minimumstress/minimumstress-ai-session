'use client';

import { useState, useEffect } from 'react';

export default function VideoCallClient() {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  // Örn: kendi room URL'ini buraya sabit yazabilir ya da server'dan dinamik alabilirsin
  useEffect(() => {
    setRoomUrl('https://minimumstress.daily.co/Ai-Session'); // Kendi linkini koy!
  }, []);

  const handleAssistantClick = async () => {
    setLoading(true);
    const userMessage = 'Hello, how are you feeling today?';

    const res = await fetch('/api/avatar-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userMessage }),
    });

    const data = await res.json();
    setAudioUrl(data.audioUrl);
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {/* Video Görüşme Alanı */}
      {roomUrl && (
        <iframe
          src={roomUrl}
          allow="camera; microphone; fullscreen"
          style={{ width: '100%', height: '500px', borderRadius: '12px', border: '1px solid #ccc' }}
        ></iframe>
      )}

      {/* AI Asistan Butonu + Ses */}
      <div>
        <button
          onClick={handleAssistantClick}
          disabled={loading}
          style={{
            backgroundColor: '#4ade80',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Assistant is speaking...' : 'AI Assistant Speak'}
        </button>

        {audioUrl && (
          <audio controls autoPlay src={audioUrl} style={{ marginTop: '1rem' }} />
        )}
      </div>
    </div>
  );
}
