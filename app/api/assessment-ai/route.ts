import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      assessmentType,
      score,
      resultType,
      dimensions,
      answers
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const prompt = `
You are the AI Wellness Insight layer for Minimum Stress.

Assessment type: ${assessmentType}
Overall score: ${score}
Result type: ${resultType}
Dimension scores: ${JSON.stringify(dimensions)}
User answers object: ${JSON.stringify(answers)}

Your job:
- Interpret the result professionally
- Do not diagnose
- Do not claim medical certainty
- Use calm, supportive, premium wellness language
- Give useful next steps
- Recommend relevant Minimum Stress pathways
- Keep it concise and practical
- Use "consultants & instructors", not "practitioners"

Return ONLY valid JSON with this exact structure:

{
  "summaryTitle": "string",
  "professionalSummary": "string",
  "topPatterns": ["string", "string", "string"],
  "sevenDayFocus": [
    {
      "title": "string",
      "why": "string",
      "action": "string"
    }
  ],
  "recommendedPathways": ["string", "string", "string"],
  "closingNote": "string",
  "disclaimer": "string"
}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "Gemini request failed",
          details: errorText
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        summaryTitle: "Your personalized insight is ready",
        professionalSummary: text,
        topPatterns: [],
        sevenDayFocus: [],
        recommendedPathways: [],
        closingNote: "",
        disclaimer: "This is educational information only and is not medical advice."
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        details: String(error)
      },
      { status: 500 }
    );
  }
}