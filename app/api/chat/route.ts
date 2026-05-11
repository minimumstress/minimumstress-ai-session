import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // isGreeting parametresini ekledik
    const { message, history, category, isSessionEnd, isGreeting } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

    const testEmail = "danisan@minimumstress.com";
    let { data: user } = await supabase.from('user_profiles').select('id, preferences').eq('user_email', testEmail).single();
    if (!user) {
      const { data: newUser } = await supabase.from('user_profiles').insert([{ user_email: testEmail }]).select().single();
      user = newUser;
    }

    // --- SEANS BİTİŞİ (Özetleme Motoru - Önceki kodun aynısı) ---
    if (isSessionEnd) {
       // ... (Bir önceki mesajdaki isSessionEnd kodları burada kalacak) ...
       return NextResponse.json({ text: "Seans kaydedildi." });
    }

    // Ortak Sistem Talimatı (Persona)
    const systemInstruction = {
      role: "model",
      parts: [{ text: `You are a sophisticated wellness professional acting specifically as a ${category}. Tone: Calm, premium, highly characteristic of your field. Responses: Max 2 sentences. USER PREFERENCES: ${JSON.stringify(user?.preferences || {})}.` }]
    };

    let contents = [];

    // --- YENİ EKLENEN: İLK KARŞILAMA MANTIĞI ---
    if (isGreeting) {
       // Gizli komut: Kendini tanıt ve sorunu sor
       contents = [{ 
         role: "user", 
         parts: [{ text: `The user has just entered your sanctuary. Give a unique, welcoming opening statement in your specific professional persona as a ${category}. End by asking a relevant, gentle question about what they want to focus on today. Do NOT use the exact same words every time.` }] 
       }];
    } else {
       // Normal konuşma akışı
       const formattedHistory = (history || []).map((item: any) => ({
         role: item.role === "assistant" ? "model" : item.role,
         parts: [{ text: item.parts[0]?.text || String(item.parts) }]
       }));
       contents = [
         ...formattedHistory,
         { role: "user", parts: [{ text: message }] }
       ];
    }

    // API'ye İstek At
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction })
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message }, { status: response.status });

    return NextResponse.json({ text: data.candidates[0].content.parts[0].text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}