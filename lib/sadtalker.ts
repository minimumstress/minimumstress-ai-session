// lib/sadtalker.ts
export async function generateTalkingHead(audioUrl: string) {
  const res = await fetch('http://localhost:5000/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audioUrl }),
  });

  if (!res.ok) {
    console.error('SadTalker video hatası:', await res.text());
    throw new Error('SadTalker video üretilemedi');
  }

  const data = await res.json();
  return data.videoUrl; // Örn: "/generated/avatar123.mp4"
}
