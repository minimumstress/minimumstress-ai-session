// lib/did.ts
export async function createTalkingAvatarVideo(text: string, voiceUrl: string) {
  const res = await fetch('https://api.d-id.com/talks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.DID_API_KEY}`,
    },
    body: JSON.stringify({
      script: {
        type: 'audio',
        subtitles: false,
        audio_url: voiceUrl,
        provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' }
      },
      source_url: 'https://create-images-results.d-id.com/DefaultPersonas/Elly/image.jpeg',
    }),
  });

  if (!res.ok) {
    console.error('D-ID video oluşturulamadı', await res.text());
    throw new Error('D-ID video hatası');
  }

  const data = await res.json();
  return data;
}
