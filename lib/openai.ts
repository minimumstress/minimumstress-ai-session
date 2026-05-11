// lib/openai.ts
export async function sendChatMessage(message: string) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('OpenAI API hatası:', error);
    throw new Error('Chat API başarısız.');
  }

  const data = await res.json();
  return data.message; // 👈 OpenAI'den dönen cevabı alıyoruz
}
