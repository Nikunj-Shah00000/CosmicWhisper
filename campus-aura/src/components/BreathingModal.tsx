import { useState, useEffect, useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function BreathingModal({ open, onClose }: Props) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [counter, setCounter] = useState(4);
  const [label, setLabel] = useState("READY");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phaseLabel = (ph: number, cnt: number) => {
    if (ph === 0) return `INHALE (${cnt})`;
    if (ph === 1) return `HOLD (${cnt})`;
    return `EXHALE (${cnt})`;
  };

  const start = () => {
    setRunning(true);
    let ph = 0;
    let cnt = 4;
    setLabel(phaseLabel(ph, cnt));
    intervalRef.current = setInterval(() => {
      cnt--;
      if (cnt < 0) {
        ph = (ph + 1) % 3;
        cnt = ph === 0 ? 4 : ph === 1 ? 7 : 8;
      }
      setLabel(phaseLabel(ph, cnt));
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setLabel("READY");
    setPhase(0);
    setCounter(4);
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  useEffect(() => {
    if (!open) stop();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [open]);

  return (
    <div className={`interactive-modal glass-panel rounded-2xl flex flex-col items-center justify-center ${open ? "active" : ""}`} style={{ padding: 24 }}>
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white"
        style={{ background: "rgba(255,255,255,0.05)", padding: 6, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex" }}
      >
        <XIcon />
      </button>
      <h3 className="text-lg font-bold text-white mb-1">4-7-8 Breathing</h3>
      <p className="text-gray-400 mb-6 text-center" style={{ fontSize: "10px" }}>Follow the circle to bypass your amygdala.</p>

      <div className="relative flex items-center justify-center mb-6" style={{ width: 128, height: 128 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "rgba(0,243,255,0.1)",
            border: "2px solid #00f3ff",
            animation: running ? "breatheCircle 15s linear infinite" : "none",
            transition: "transform 0.5s ease"
          }}
        />
        <div className="text-xl font-bold text-white z-10 font-mono tracking-wider">{label}</div>
      </div>

      {!running ? (
        <button
          onClick={start}
          className="px-6 py-2 font-bold text-sm rounded-lg transition-colors"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", cursor: "pointer" }}
          onMouseOver={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
          onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
        >
          Start
        </button>
      ) : (
        <button
          onClick={stop}
          className="px-6 py-2 font-bold text-sm rounded-lg transition-colors"
          style={{ background: "rgba(255,0,60,0.15)", border: "1px solid rgba(255,0,60,0.3)", color: "#ff003c", cursor: "pointer" }}
        >
          Stop
        </button>
      )}
    </div>
  );
}

function XIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
