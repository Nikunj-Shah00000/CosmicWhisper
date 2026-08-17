import { io } from "socket.io-client";

const BASE = import.meta.env.BASE_URL ?? "/";

export const socket = io({
  path: `${BASE.replace(/\/$/, "")}/api/socket.io`.replace(/\/\//g, "/"),
  transports: ["websocket", "polling"],
  autoConnect: true,
});
