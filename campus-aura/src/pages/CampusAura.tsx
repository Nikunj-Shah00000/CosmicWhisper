import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ConstellationCanvas } from "@/components/ConstellationCanvas";
import { NodeModal } from "@/components/NodeModal";
import { WhisperWallPanel } from "@/components/WhisperWallPanel";
import { AIChatBot } from "@/components/AIChatBot";
import { BreathingModal } from "@/components/BreathingModal";
import { GroundingModal } from "@/components/GroundingModal";
import { SupportModal } from "@/components/SupportModal";
import { PersonalView } from "@/components/PersonalView";
import { DeptHeatmap } from "@/components/DeptHeatmap";

export interface NodeData {
  id: string;
  hr: number;
  isDanger: boolean;
  index: number;
  position: { x: number; y: number; z: number };
}

export type ModalType = "breathing" | "grounding" | "support" | null;

export default function CampusAura() {
  const [isGlobal, setIsGlobal] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const handleNodeClick = useCallback((node: NodeData) => {
    setSelectedNode(node);
  }, []);

  const handleCloseNodeModal = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#030305" }}>
      {/* Three.js constellation canvas */}
      <ConstellationCanvas
        isGlobal={isGlobal}
        onNodeClick={handleNodeClick}
        cameraRef={cameraRef}
      />

      {/* Tooltip rendered by ConstellationCanvas internally */}

      {/* Node modal (anonymous DM chat) */}
      {selectedNode && (
        <NodeModal node={selectedNode} onClose={handleCloseNodeModal} />
      )}

      {/* Breathing modal */}
      <BreathingModal open={openModal === "breathing"} onClose={() => setOpenModal(null)} />

      {/* Grounding modal */}
      <GroundingModal open={openModal === "grounding"} onClose={() => setOpenModal(null)} />

      {/* Support modal */}
      <SupportModal open={openModal === "support"} onClose={() => setOpenModal(null)} />

      {/* Main UI overlay */}
      <div
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100vw", height: "100vh",
          zIndex: 10, pointerEvents: "none",
          display: "flex", flexDirection: "column", padding: "2rem"
        }}
      >
        {/* HEADER */}
        <header className="flex justify-between items-center" style={{ pointerEvents: "auto" }}>
          <div
            className="glass-panel rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
            style={{ padding: "12px 20px" }}
            onClick={() => {
              if (cameraRef.current) {
                cameraRef.current.position.set(0, 15, 45);
              }
            }}
          >
            <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center animate-breathe orb-glow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
                <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
                <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
                <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
                <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
                <path d="M6 18a4 4 0 0 1-1.967-.516"/>
                <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-white">CampusAura AI</h1>
              <p className="text-gray-400 font-bold uppercase mt-0.5" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>Psychological OS</p>
            </div>
          </div>

          {/* View toggle */}
          <div
            className={`toggle-container ${!isGlobal ? "toggle-right" : ""}`}
            onClick={() => setIsGlobal(v => !v)}
            style={{ userSelect: "none" }}
          >
            <div className="toggle-slider" />
            <div className={`toggle-btn ${isGlobal ? "active" : ""}`}>Global Radar</div>
            <div className={`toggle-btn ${!isGlobal ? "active" : ""}`}>My Dashboard</div>
          </div>

          <div className="glass-panel rounded-2xl flex items-center gap-4" style={{ padding: "10px 20px" }}>
            <div className="radar-box" style={{ width: 32, height: 32 }}><div className="radar-sweep" /></div>
            <div className="flex flex-col">
              <span className="text-gray-400 font-bold uppercase" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>Status</span>
              <span className="font-bold text-xs" style={{ color: "#00f3ff" }}>Monitoring</span>
            </div>
          </div>
        </header>

        {/* GLOBAL VIEW */}
        <div
          className={`view-transition ${isGlobal ? "view-active" : "view-hidden"} flex justify-between items-end w-full`}
          style={{
            position: "absolute",
            top: 110, bottom: 16, left: 0,
            padding: "0 2rem",
            overflow: "hidden",
          }}
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-3 h-full" style={{ width: 380, overflow: "hidden" }}>
            {/* Crisis Lifeline */}
            <div className="glass-panel rounded-2xl flex items-center gap-4 flex-shrink-0" style={{ padding: "12px 16px", borderColor: "rgba(255,0,60,0.3)" }}>
              <div className="rounded-lg flex-shrink-0 flex items-center justify-center" style={{ padding: "8px", background: "rgba(255,0,60,0.1)" }}>
                <PhoneIcon color="#ff003c" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">India Crisis Lifeline</h3>
                <div className="mt-0.5 font-mono font-bold text-sm" style={{ color: "#ff003c" }}>9152987821 <span className="text-gray-500 px-1">|</span> 14416</div>
                <div className="font-mono text-gray-400" style={{ fontSize: "10px" }}>Kiran: 1800-599-0019</div>
              </div>
            </div>

            {/* Department Heatmap */}
            <DeptHeatmap />

            {/* Whisper Wall */}
            <WhisperWallPanel />
          </div>

          {/* RIGHT COLUMN — pinned to bottom */}
          <div className="flex flex-col gap-4 justify-end h-full" style={{ width: 320 }}>
            <PredictivePulse />
          </div>
        </div>

        {/* PERSONAL VIEW */}
        <div
          className={`view-transition ${!isGlobal ? "view-active" : "view-hidden"} flex justify-between items-end pb-4 h-full w-full`}
          style={{ position: "absolute", bottom: 0, left: 0, padding: "0 2rem 1rem" }}
        >
          <PersonalView onOpenModal={setOpenModal} />
        </div>
      </div>

      {/* Help button */}
      <button
        onClick={() => setOpenModal("support")}
        className="fixed flex items-center gap-2"
        style={{
          bottom: 24, left: 24, zIndex: 50,
          padding: "6px 12px",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 8,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          color: "#9ca3af",
          pointerEvents: "auto"
        }}
      >
        <LifebuoyIcon />
        <span className="font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#d1d5db" }}>Help</span>
      </button>

      {/* AI Chatbot */}
      <AIChatBot open={aiChatOpen} onToggle={() => setAiChatOpen(v => !v)} />
    </div>
  );
}

function PredictivePulse() {
  const [risk, setRisk] = useState(15);
  const [mood, setMood] = useState("Stable");

  useEffect(() => {
    const interval = setInterval(() => {
      const r = Math.max(5, Math.min(95, 15 + (Math.random() - 0.4) * 20));
      setRisk(Math.round(r));
      setMood(r > 70 ? "Turbulent" : r > 40 ? "Elevated" : "Stable");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isAlert = risk > 60;

  return (
    <div className="glass-panel rounded-2xl relative overflow-hidden" style={{ padding: "24px" }}>
      <div style={{ position: "relative", zIndex: 10 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold uppercase flex items-center gap-2" style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.1em" }}>
            <ActivityIcon /> Predictive Pulse
          </h2>
        </div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">{mood}</div>
            <div className="text-gray-400 mt-1 font-bold uppercase" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>Atmosphere</div>
          </div>
          <div className="rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)", padding: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
            {isAlert
              ? <AlertTriangleIcon color="#ff003c" className="animate-pulse" />
              : <ShieldCheckIcon color="#00f3ff" />
            }
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-2 font-mono">
            <span className="text-gray-400">Crisis Probability</span>
            <span className="font-bold text-white">{risk}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.8)", height: 6, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${risk}%`, background: risk > 60 ? "#ff003c" : risk > 35 ? "#ffcc00" : "white" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Inline icons ---- */
function PhoneIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12.6a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.29 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function LifebuoyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/>
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}
function AlertTriangleIcon({ color = "currentColor", className = "" }: { color?: string; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}
function ShieldCheckIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
