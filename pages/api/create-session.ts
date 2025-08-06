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
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          "Content-Type":
