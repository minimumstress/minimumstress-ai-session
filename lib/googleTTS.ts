// lib/googleTTS.ts
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Servis hesabı kimlik bilgilerini yükle
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: path.join(process.cwd(), 'lib', 'google-service-account.json'),
});

export async function generateTTS(text: string, languageCode = 'tr-TR', voiceName = 'tr-TR-Standard-A') {
  const request = {
    input: { text },
    voice: {
      languageCode,
      name: voiceName,
    },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);

  const outputFile = path.join(process.cwd(), 'public', `output-${Date.now()}.mp3`);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputFile, response.audioContent as Buffer, 'binary');

  // Dönen URL, Next.js'in public klasörüne göre erişilebilir olmalı
  return `/output-${Date.now()}.mp3`;
}
