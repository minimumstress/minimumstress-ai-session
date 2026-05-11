import { NextResponse } from 'next/server';

/**
 * MINIMUM STRESS - D-ID WEB-RTC BRIDGE (APRIL 2026)
 * Bu dosya: Yayın oluşturma, Sinyalleşme ve Konuşma komutlarını yönetir.
 */
export async function POST(req: Request) {
  try {
    const apiKey = process.env.DID_API_KEY;

    if (!apiKey) {
      console.error('❌ .env.local içerisinde DID_API_KEY bulunamadı!');
      return NextResponse.json({ error: 'API Key eksik' }, { status: 500 });
    }

    // D-ID Auth Header (Base64 zorunluluğu)
    const authHeader = Buffer.from(apiKey).toString('base64');
    const body = await req.json();

    // --- SENARYO 1: AVATARI KONUŞTURMA (TALK ACTION) ---
    // Bu kısım avatarın dudaklarının hareket etmesini sağlar.
    if (body.action === 'talk') {
      const talkResponse = await fetch(`https://api.d-id.com/talks/streams/${body.streamId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: body.script,
          config: { 
            driver_expressions: { 
              expressions: [{ expression: 'smile', intensity: 1.0 }] 
            } 
          },
          session_id: body.sessionId
        }),
      });

      const talkData = await talkResponse.json();
      return NextResponse.json(talkData);
    }

    // --- SENARYO 2: SİNYALLEŞME (SIGNALING ACTION) ---
    // WebRTC el sıkışmasını (answer paketini) iletir.
    if (body.answer) {
      const signalResponse = await fetch(`https://api.d-id.com/talks/streams/${body.streamId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: body.answer,
          session_id: body.sessionId,
        }),
      });

      return NextResponse.json({ success: signalResponse.ok });
    }

    // --- SENARYO 3: YAYIN OLUŞTURMA (CREATE ACTION - DEFAULT) ---
    // İlk bağlantıyı başlatan kısımdır.
    const createResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg", // Örnek koç görseli
      }),
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      console.error('❌ D-ID API Reddi:', createData);
      return NextResponse.json({ 
        error: 'D-ID Connection Failed', 
        details: createData 
      }, { status: createResponse.status });
    }

    return NextResponse.json(createData);

  } catch (error: any) {
    console.error('❌ SUNUCU HATASI:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}