import { useState, useRef, useEffect } from "react";
import type { ModalType } from "@/pages/CampusAura";

interface Props {
  onOpenModal: (type: ModalType) => void;
}

export function PersonalView({ onOpenModal }: Props) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");
  const [journalBlur, setJournalBlur] = useState(false);
  const [journalFocused, setJournalFocused] = useState(false);
  const [pinState, setPinState] = useState<"set" | "locked" | "unlocked">("set");
  const [pinInput, setPinInput] = useState("");
  const [currentPin, setCurrentPin] = useState<string | null>(null);
  const [pinError, setPinError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePin = () => {
    if (pinInput.length < 4) { setPinError("PIN must be 4 digits."); return; }
    if (pinState === "set") {
      setCurrentPin(pinInput);
      setPinState("unlocked");
      setPinInput("");
      setPinError("");
    } else if (pinState === "locked") {
      if (pinInput === currentPin) { setPinState("unlocked"); setPinInput(""); setPinError(""); }
      else { setPinError("Incorrect PIN."); }
    }
  };

  const isBlurred = journalBlur && !journalFocused;

  return (
    <div className="flex justify-between items-end pb-4 h-full w-full" style={{ gap: 16 }}>
      {/* Profile */}
      <div className="flex flex-col gap-4" style={{ width: 300 }}>
        <div className="glass-panel rounded-2xl flex flex-col h-full relative" style={{ padding: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="relative group cursor-pointer rounded-full flex items-center justify-center overflow-hidden"
              style={{ width: 48, height: 48, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.5)" }}
              onClick={() => fileRef.current?.click()}
            >
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                : <UserIcon />
              }
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.7)" }}>
                <CameraIcon />
              </div>
              <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={e => {
                const f = e.target.files?.[0]; if (!f) return;
                const r = new FileReader();
                r.onload = ev => setAvatarSrc(ev.target?.result as string);
                r.readAsDataURL(f);
              }} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-white">Anon #042</h2>
              {avatarSrc && (
                <button onClick={() => setAvatarSrc(null)} className="text-left flex items-center gap-1" style={{ fontSize: "9px", color: "#6b7280", cursor: "pointer", background: "none", border: "none" }}>
                  <Trash2Icon /> Remove
                </button>
              )}
            </div>
          </div>

          <h3 className="font-bold uppercase mb-3 flex items-center gap-2" style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.1em" }}>
            <DnaIcon /> Clinical Profile
          </h3>
          <div className="flex flex-col gap-2 mb-6">
            <div className="rounded-xl p-3" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="font-bold uppercase block mb-1" style={{ fontSize: "9px", color: "#6b7280", letterSpacing: "0.1em" }}>Genetic</span>
              <span className="font-mono text-gray-200 block" style={{ fontSize: "12px" }}>• High Cortisol</span>
            </div>
            <div className="rounded-xl p-3" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="font-bold uppercase block mb-1" style={{ fontSize: "9px", color: "#6b7280", letterSpacing: "0.1em" }}>Traits</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {["ADHD-I", "HSP"].map(t => (
                  <span key={t} className="text-white font-bold rounded" style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", fontSize: "10px" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <h3 className="font-bold uppercase mb-2 flex items-center gap-2" style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.1em" }}>
            <DumbbellIcon /> Mental Gym
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { label: "4-7-8 Breathing", icon: <PlayIcon />, modal: "breathing" as ModalType },
              { label: "5-4-3-2-1 Ground", icon: <EyeIcon />, modal: "grounding" as ModalType },
            ].map(item => (
              <div
                key={item.label}
                onClick={() => onOpenModal(item.modal)}
                className="rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              >
                <span className="text-xs font-bold text-gray-200">{item.label}</span>
                <span className="text-white">{item.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notebook */}
      <div className="flex flex-col gap-4" style={{ width: 460 }}>
        <div className="glass-panel rounded-2xl flex flex-col relative overflow-hidden" style={{ padding: 24, border: "1px solid rgba(255,255,255,0.1)", height: "70vh" }}>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2" style={{ letterSpacing: "0.1em" }}>
              <BookIcon /> Private Notebook
            </h3>
            {pinState === "unlocked" && (
              <button
                onClick={() => setPinState("locked")}
                className="font-bold flex items-center gap-1.5 transition-colors"
                style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", border: "none", padding: "6px 10px", borderRadius: 8, color: "white", cursor: "pointer" }}
              >
                <LockIcon /> Lock
              </button>
            )}
          </div>

          {/* Lock overlay */}
          {pinState !== "unlocked" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)" }}>
              <LockKeyholeIcon />
              <h4 className="text-base text-white font-bold mb-1 mt-4">
                {pinState === "set" ? "Set Notebook Passcode" : "Locked"}
              </h4>
              <p className="mb-5 font-medium text-center" style={{ fontSize: "10px", color: "#9ca3af" }}>
                {pinState === "set" ? "Create a 4-digit PIN to secure your journal." : "Enter 4-digit passcode"}
              </p>
              <input
                type="password"
                value={pinInput}
                onChange={e => { setPinInput(e.target.value.slice(0, 4)); setPinError(""); }}
                onKeyDown={e => { if (e.key === "Enter") handlePin(); }}
                maxLength={4}
                className="w-24 text-center text-white font-mono text-lg rounded-lg py-2 mb-5"
                style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", letterSpacing: "0.3em", outline: "none" }}
                placeholder="****"
              />
              {pinError && <p className="text-xs font-bold mb-3" style={{ color: "#ff003c" }}>{pinError}</p>}
              <button
                onClick={handlePin}
                className="px-6 py-2 font-bold text-xs rounded-lg transition-colors"
                style={{ background: "white", color: "black", border: "none", cursor: "pointer" }}
              >
                {pinState === "set" ? "Set PIN" : "Unlock"}
              </button>
              {pinState === "locked" && (
                <button
                  onClick={() => { setCurrentPin(null); setPinState("set"); setPinInput(""); setJournalText(""); }}
                  className="underline mt-6"
                  style={{ fontSize: "10px", color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}
                >
                  Forget PIN? Reset.
                </button>
              )}
            </div>
          )}

          <textarea
            value={journalText}
            onChange={e => setJournalText(e.target.value)}
            onFocus={() => setJournalFocused(true)}
            onBlur={() => setJournalFocused(false)}
            placeholder="Write something..."
            className={`flex-1 w-full bg-transparent resize-none text-gray-200 text-sm focus:outline-none notebook-bg ${isBlurred ? "journal-blur" : ""}`}
            style={{ border: "none", outline: "none" }}
          />

          <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <label className="flex items-center gap-2 cursor-pointer font-bold" style={{ fontSize: "10px", color: "#9ca3af" }}>
              <input type="checkbox" checked={journalBlur} onChange={e => setJournalBlur(e.target.checked)} />
              Auto-Blur unfocused
            </label>
            <span className="font-mono uppercase font-bold" style={{ fontSize: "9px", color: "#374151" }}>Local Storage Only</span>
          </div>
        </div>
      </div>

      {/* Biometrics */}
      <div className="flex flex-col gap-4" style={{ width: 300 }}>
        <div className="glass-panel rounded-2xl flex flex-col items-center justify-center relative overflow-hidden" style={{ padding: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="absolute top-4 left-4 rounded flex items-center gap-1.5 font-bold" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 8px", fontSize: "9px", color: "#d1d5db" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} /> Live Synced
          </div>
          <div className="personal-orb mb-4 mt-6" />
          <h2 className="text-xl font-bold text-white tracking-tight">Elevated</h2>
          <div className="w-full grid grid-cols-1 gap-3 mt-6">
            <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="font-bold uppercase mb-1" style={{ fontSize: "9px", color: "#9ca3af" }}>Personal ECG</div>
              <div className="text-2xl font-bold text-white font-mono flex items-end gap-1.5">
                88 <span className="mb-1" style={{ fontSize: "10px", color: "#6b7280" }}>BPM</span>
              </div>
              <svg viewBox="0 0 100 30" className="absolute bottom-0 left-0 w-full opacity-30" style={{ height: 40 }}>
                <polyline points="0,15 20,15 25,5 30,25 35,15 100,15" fill="none" stroke="#ffffff" strokeWidth="1.5" className="animate-ecg" strokeDasharray="100" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Icons */
function UserIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function CameraIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function Trash2Icon() { return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function DnaIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 12.5 1 1"/><path d="m16.5 10.5 1 1"/><path d="m10 16 1.5 1.5"/></svg>; }
function DumbbellIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg>; }
function PlayIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>; }
function EyeIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function BookIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>; }
function LockIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function LockKeyholeIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>; }
