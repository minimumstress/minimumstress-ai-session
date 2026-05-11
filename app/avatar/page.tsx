'use client';

import { useState } from 'react';

export default function AvatarPage() {
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    setLoading(true);
    setVideoUrl('');

    try {
      const res = await fetch('/api/avatar-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        alert('Video alınamadı.');
      }
    } catch (err) {
      console.error('Video isteği hatası:', err);
      alert('Bir hata oluştu.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🧑‍💼 Konuşan Avatar Oluştur</h1>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="AI'nın söylemesini istediğiniz metni yazın..."
        style={{ width: '100%', padding: 10 }}
      />
      <br />
      <button onClick={generateVideo} disabled={loading || !text}>
        {loading ? 'Yükleniyor...' : 'Videoyu Oluştur'}
      </button>

      {videoUrl && (
        <div style={{ marginTop: 20 }}>
          <video src={videoUrl} controls autoPlay />
        </div>
      )}
    </div>
  );
}
