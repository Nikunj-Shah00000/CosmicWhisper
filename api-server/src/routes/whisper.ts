import { Router } from "express";
import { logger } from "../lib/logger";

export interface WhisperMsg {
  id: string;
  anonId: string;
  text: string;
  emotion: string;
  timestamp: string;
}

export const whisperMessages: WhisperMsg[] = [
  { id: crypto.randomUUID(), anonId: "Anon #711", text: "Exams are crushing me rn but im staying strong 💪", emotion: "Stressed", timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
  { id: crypto.randomUUID(), anonId: "Anon #204", text: "Does anyone else feel completely invisible here?", emotion: "Lonely", timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString() },
  { id: crypto.randomUUID(), anonId: "Anon #556", text: "Just breathed through a panic attack. I made it.", emotion: "Anxious", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: crypto.randomUUID(), anonId: "Anon #089", text: "3am and still coding. Send help or coffee.", emotion: "Burnout", timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
  { id: crypto.randomUUID(), anonId: "Anon #333", text: "Small win today: actually went outside 🌤️", emotion: "Hopeful", timestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString() },
];

const router = Router();

router.get("/whisper/messages", (req, res) => {
  res.json([...whisperMessages].reverse().slice(0, 50));
});

router.post("/whisper/messages", (req, res) => {
  const { text, emotion } = req.body as { text?: string; emotion?: string };
  if (!text || !emotion) {
    res.status(400).json({ error: "text and emotion required" });
    return;
  }
  const msg: WhisperMsg = {
    id: crypto.randomUUID(),
    anonId: `Anon #${Math.floor(100 + Math.random() * 900)}`,
    text: String(text).slice(0, 280),
    emotion: String(emotion).slice(0, 50),
    timestamp: new Date().toISOString(),
  };
  whisperMessages.push(msg);
  if (whisperMessages.length > 100) whisperMessages.shift();
  req.log.info({ msgId: msg.id }, "Whisper message posted");
  res.status(201).json(msg);
});

export default router;
