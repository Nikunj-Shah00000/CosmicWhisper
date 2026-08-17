import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { n: 5, text: "Things you can SEE around you." },
  { n: 4, text: "Things you can FEEL physically." },
  { n: 3, text: "Things you can HEAR." },
  { n: 2, text: "Things you can SMELL." },
  { n: 1, text: "Thing you can TASTE." },
];

export function GroundingModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const reset = () => { setStep(0); setDone(false); };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
      setTimeout(() => {
        onClose();
        reset();
      }, 3000);
    }
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const current = steps[step];

  return (
    <div className={`interactive-modal glass-panel rounded-2xl ${open ? "active" : ""}`} style={{ padding: 24 }}>
      <button
        onClick={() => { onClose(); reset(); }}
        className="absolute top-4 right-4 text-gray-500 hover:text-white"
        style={{ background: "rgba(255,255,255,0.05)", padding: 6, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex" }}
      >
        <XIcon />
      </button>
      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <EyeIcon /> Grounding Technique
      </h3>
      <p className="text-gray-400 mb-6" style={{ fontSize: "10px" }}>Pull your brain out of a panic loop.</p>
      <div className="flex flex-col gap-4">
        <div className="text-center py-4 rounded-xl" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {done ? (
            <>
              <div className="text-5xl font-black text-white mb-2">✓</div>
              <div className="text-sm font-bold text-gray-200">You are safe.</div>
            </>
          ) : (
            <>
              <div className="text-5xl font-black text-white mb-2">{current.n}</div>
              <div className="text-sm font-bold text-gray-200">{current.text}</div>
              <p className="uppercase mt-1" style={{ fontSize: "9px", color: "#6b7280", letterSpacing: "0.1em" }}>Say them out loud.</p>
            </>
          )}
        </div>
        {!done && (
          <button
            onClick={next}
            className="w-full py-3 mt-2 font-bold text-sm rounded-xl transition-colors"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", cursor: "pointer" }}
            onMouseOver={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
          >
            Done. Next Step.
          </button>
        )}
      </div>
    </div>
  );
}

function XIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function EyeIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9d00ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
