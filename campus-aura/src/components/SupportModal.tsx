import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { onClose(); setSubmitted(false); setSubject(""); setDesc(""); }, 2000);
  };

  return (
    <div className={`interactive-modal glass-panel rounded-2xl ${open ? "active" : ""}`} style={{ padding: 24 }}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white"
        style={{ background: "rgba(255,255,255,0.05)", padding: 6, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex" }}
      >
        <XIcon />
      </button>
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg" style={{ background: "rgba(255,255,255,0.1)", padding: 8 }}>
          <LifebuoyIcon />
        </div>
        <h3 className="text-lg font-bold text-white">Customer Support</h3>
      </div>
      <p className="text-gray-400 mb-4" style={{ fontSize: "10px" }}>Our human support team is available 24/7.</p>
      {submitted ? (
        <div className="text-center py-6">
          <div className="text-2xl mb-2">✓</div>
          <div className="text-white font-bold">Ticket submitted.</div>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Issue Subject"
            className="w-full text-white text-xs mb-3 transition-colors"
            style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 12px", outline: "none" }}
          />
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Describe the problem..."
            className="w-full text-white text-xs mb-4 resize-none transition-colors"
            rows={4}
            style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 12px", outline: "none" }}
          />
          <button
            onClick={handleSubmit}
            className="w-full py-2 font-bold text-sm rounded-lg transition-colors"
            style={{ background: "white", color: "black", border: "none", cursor: "pointer" }}
            onMouseOver={e => { e.currentTarget.style.background = "#e5e7eb"; }}
            onMouseOut={e => { e.currentTarget.style.background = "white"; }}
          >
            Submit Ticket
          </button>
        </>
      )}
    </div>
  );
}

function XIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function LifebuoyIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>; }
