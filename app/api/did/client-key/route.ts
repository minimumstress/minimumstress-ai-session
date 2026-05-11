import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiKey = process.env.DID_API_KEY;
    const authHeader = Buffer.from(apiKey!).toString('base64');

    const response = await fetch("https://api.d-id.com/agents/client-key", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allowed_domains: ["localhost:3000"] 
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}