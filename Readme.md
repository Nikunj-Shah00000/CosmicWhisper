# CampusAura AI

A real-time anonymous psychological monitoring platform for campuses — a Three.js emotion constellation where clicking any star (node) opens an anonymous encrypted chat, plus a live Whisper Wall group chat for sharing feelings anonymously.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/campus-aura run dev` — run the frontend (port 25833)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Socket.io (real-time anonymous chat)
- Frontend: React + Vite + Three.js constellation
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `artifacts/api-server/src/routes/whisper.ts` — Whisper Wall REST routes + in-memory storage
- `artifacts/api-server/src/socket.ts` — Socket.io real-time chat handler
- `artifacts/campus-aura/src/pages/CampusAura.tsx` — Main page
- `artifacts/campus-aura/src/components/ConstellationCanvas.tsx` — Three.js galaxy
- `artifacts/campus-aura/src/components/NodeModal.tsx` — Anonymous DM chat (click on a star)
- `artifacts/campus-aura/src/components/WhisperWallPanel.tsx` — Real-time group whisper wall
- `artifacts/campus-aura/src/lib/socket.ts` — Socket.io client singleton

## Architecture decisions

- All chat is fully anonymous — no auth, no user accounts, no PII stored
- Whisper Wall uses in-memory storage (resets on restart); easily swappable for DB
- Socket.io path is `/api/socket.io` so it routes through the shared proxy
- Three.js constellation runs purely on the frontend; node data is generated client-side
- DM rooms are created per node ID; messages are real-time only (no persistence)

## Product

- Emotion constellation: 800 animated nodes representing anonymous campus members
- Click a star → anonymous DM chat opens with that node
- Whisper Wall: live group anonymous chat visible to everyone, with emotion tags
- My Dashboard: private journal (PIN-locked), mental gym exercises, biometric display
- Department Analytics: live stress scores per department
- Predictive Pulse: campus-wide crisis probability indicator
- Aura AI companion: empathetic chatbot

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- WebGL requires a real browser (not screenshot/headless). The constellation works in Chrome/Firefox/Safari.
- Socket.io connects to `/api/socket.io` — if the API server is not running, chat will be offline-only
- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec changes

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
