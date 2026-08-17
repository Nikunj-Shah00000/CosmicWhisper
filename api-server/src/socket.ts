import type { Server } from "socket.io";
import { logger } from "./lib/logger";
import { whisperMessages } from "./routes/whisper";

export function initSocket(io: Server) {
  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket connected");

    socket.on("join_dm", (roomId: string) => {
      socket.join(`dm:${roomId}`);
    });

    socket.on("send_dm", (data: { roomId: string; message: string; fromId: string }) => {
      const msg = {
        id: crypto.randomUUID(),
        fromId: data.fromId,
        text: data.message,
        timestamp: new Date().toISOString(),
      };
      io.to(`dm:${data.roomId}`).emit("dm_message", msg);
    });

    socket.on("whisper_message", (data: { text: string; emotion: string; anonId: string }) => {
      const msg = {
        id: crypto.randomUUID(),
        anonId: data.anonId,
        text: data.text,
        emotion: data.emotion,
        timestamp: new Date().toISOString(),
      };
      whisperMessages.push(msg);
      if (whisperMessages.length > 100) whisperMessages.shift();
      io.emit("whisper_broadcast", msg);
    });

    socket.on("disconnect", () => {
      logger.info({ socketId: socket.id }, "Socket disconnected");
    });
  });
}
