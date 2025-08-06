import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const DAILY_API_KEY = process.env.DAILY_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { email, name, product } = req.body;

  try {
    const dailyRes = await axios.post(
      "https://api.daily.co/v1/rooms",
      {
        properties: {
          enable_chat: true,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 saat geçerli oda
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const roomUrl = dailyRes.data.url;

    return res.status(200).json({ roomUrl });
  } catch (error: any) {
    console.error("Daily API error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to create room" });
  }
}
