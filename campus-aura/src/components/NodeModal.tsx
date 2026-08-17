import { useState, useEffect, useRef } from "react";
import type { NodeData } from "@/pages/CampusAura";
import { socket } from "@/lib/socket";

interface Props {
  node: NodeData;
  onClose: () => void;
}

interface DmMessage {
  id: string;
  fromId: string;
  text: string;
  timestamp: string;
}

const MY_ANON_ID = `Anon #${Math.floor(100 + Math.random() * 900)}`;

const emotions = ["Stressed", "Anxious", "Burned Out", "Overwhelmed", "Distress", "Elevated", "Stable", "Calm"];
const depts = ["Engineering", "Medical School", "Computer Science", "Business", "Law School", "Architecture", "Liberal Arts", "Fine Arts"];

export function NodeModal({ node, onClose }: Props) {
  const [view, setView] = useState<"info" | "dm">("info");
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [input, setInput] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [reported, setReported] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [reportToast, setReportToast] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const dept = depts[node.index % depts.length];
  const emotion = node.isDanger ? "Distress" : emotions[node.index % (emotions.length - 2)];
  const roomId = `dm-${node.id.replace(/\s/g, "-")}`;

  useEffect(() => {
    socket.emit("join_dm", roomId);
    const handler = (msg: DmMessage) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => {
        if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight;
      }, 50);
    };
    socket.on("dm_message", handler);
    return () => { socket.off("dm_message", handler); };
  }, [roomId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || blocked) return;
    socket.emit("send_dm", { roomId, message: input.trim(), fromId: MY_ANON_ID });
    setInput("");
  };

  const handleReport = () => {
    setShowReportConfirm(false);
    setReported(true);
    setReportToast(true);
    setTimeout(() => setReportToast(false), 3500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 190,
        }}
      />

      {/* Report toast */}
      {reportToast && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 400, background: "rgba(255,170,0,0.15)", border: "1px solid rgba(255,170,0,0.5)",
          color: "#ffaa00", padding: "10px 20px", borderRadius: 10,
          fontWeight: "bold", fontSize: 13, backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <FlagIcon /> Report submitted. Our team will review this user.
        </div>
      )}

      {/* Modal panel */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          maxHeight: "85vh",
          zIndex: 200,
          background: "rgba(10,10,14,0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#9ca3af", borderRadius: "50%", width: 30, height: 30,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}
          onMouseOver={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
          onMouseOut={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
        >
          <XIcon />
        </button>

        {/* INFO VIEW */}
        {view === "info" && (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, marginTop: 4 }}>
              <div style={{
                padding: 10, borderRadius: 10,
                background: "rgba(0,243,255,0.08)",
                border: "1px solid rgba(0,243,255,0.25)",
                color: "#00f3ff", display: "flex",
              }}>
                <UserIcon />
              </div>
              <div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0 }}>{node.id}</h3>
                <p style={{ margin: 0, fontFamily: "monospace", fontWeight: 700, fontSize: 10, color: "#00f3ff", letterSpacing: "0.1em", textTransform: "uppercase" }}>{dept}</p>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Detected State</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: node.isDanger ? "#ff003c" : "#ff00e5" }}>{emotion}</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Live Vitals</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "monospace" }}>{node.hr} bpm</div>
              </div>
            </div>

            {/* Danger banner */}
            {node.isDanger && (
              <div style={{ background: "rgba(255,0,60,0.08)", border: "1px solid rgba(255,0,60,0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <AlertIcon />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11, color: "#ff003c", textTransform: "uppercase", letterSpacing: "0.1em" }}>Severe Distress</div>
                  <div style={{ color: "#d1d5db", fontSize: 10, marginTop: 2 }}>This node exhibits markers of severe distress.</div>
                </div>
              </div>
            )}

            {/* Anonymous hint */}
            <div style={{ fontSize: 10, color: "#6b7280", textAlign: "center", marginBottom: 14, fontStyle: "italic" }}>
              All chats are 100% anonymous — no identity is ever shared.
            </div>

            {/* CTA */}
            <button
              onClick={() => setView("dm")}
              style={{
                width: "100%", padding: "12px 0",
                background: "rgba(0,243,255,0.1)", border: "1px solid rgba(0,243,255,0.3)",
                borderRadius: 12, color: "#00f3ff", fontWeight: 700, fontSize: 13,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(0,243,255,0.2)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(0,243,255,0.1)"; }}
            >
              <MessageIcon /> Send Anonymous Message
            </button>
          </div>
        )}

        {/* DM VIEW */}
        {view === "dm" && (
          <div style={{ display: "flex", flexDirection: "column", height: 480 }}>
            {/* DM Header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0,
            }}>
              <button
                onClick={() => setView("info")}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                onMouseOver={e => { e.currentTarget.style.color = "#fff"; }}
                onMouseOut={e => { e.currentTarget.style.color = "#9ca3af"; }}
              >
                <ArrowLeftIcon />
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Chat: {node.id}</div>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#00f3ff" }}>End-to-End Encrypted · Anonymous</div>
              </div>

              {/* Block + Report buttons */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {!blocked && (
                  <button
                    onClick={() => setBlocked(true)}
                    style={{ fontSize: 10, color: "#ff003c", background: "rgba(255,0,60,0.08)", border: "1px solid rgba(255,0,60,0.3)", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(255,0,60,0.2)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,0,60,0.08)"; }}
                    title="Block this user"
                  >
                    <BanIcon /> Block
                  </button>
                )}
                {!reported && (
                  <button
                    onClick={() => setShowReportConfirm(true)}
                    style={{ fontSize: 10, color: "#ffaa00", background: "rgba(255,170,0,0.08)", border: "1px solid rgba(255,170,0,0.3)", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(255,170,0,0.2)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,170,0,0.08)"; }}
                    title="Report this user"
                  >
                    <FlagIcon /> Report
                  </button>
                )}
                {reported && (
                  <span style={{ fontSize: 10, color: "#6b7280", padding: "4px 8px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6 }}>Reported</span>
                )}
              </div>
            </div>

            {/* Report confirm dialog */}
            {showReportConfirm && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)",
                zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 20,
              }}>
                <div style={{ background: "rgba(18,18,24,0.98)", border: "1px solid rgba(255,170,0,0.4)", borderRadius: 14, padding: 24, width: 280, textAlign: "center" }}>
                  <FlagIcon size={28} color="#ffaa00" />
                  <h4 style={{ color: "#fff", fontWeight: 700, margin: "12px 0 6px" }}>Report this user?</h4>
                  <p style={{ color: "#9ca3af", fontSize: 12, margin: "0 0 18px" }}>This will flag the conversation for moderator review. The user remains anonymous.</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setShowReportConfirm(false)}
                      style={{ flex: 1, padding: "9px 0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#9ca3af", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReport}
                      style={{ flex: 1, padding: "9px 0", background: "rgba(255,170,0,0.15)", border: "1px solid rgba(255,170,0,0.5)", borderRadius: 8, color: "#ffaa00", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                    >
                      Yes, Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div
              ref={historyRef}
              style={{
                flex: 1, overflowY: "auto", padding: "12px 16px",
                display: "flex", flexDirection: "column", gap: 8,
                scrollbarWidth: "none",
              }}
            >
              <div style={{ textAlign: "center", fontSize: 10, color: "#4b5563", fontStyle: "italic", marginBottom: 4 }}>
                Kindness is powerful. All messages are anonymous.
              </div>
              {messages.map(msg => {
                const isMe = msg.fromId === MY_ANON_ID;
                return (
                  <div
                    key={msg.id}
                    style={{
                      padding: "8px 12px", borderRadius: 10, maxWidth: "78%", fontSize: 13,
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      background: isMe ? "rgba(0,243,255,0.15)" : "rgba(255,255,255,0.06)",
                      border: isMe ? "1px solid rgba(0,243,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
                      color: isMe ? "#e0fffe" : "#d1d5db",
                    }}
                  >
                    {msg.text}
                  </div>
                );
              })}
              {messages.length === 0 && !blocked && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", fontSize: 12, fontStyle: "italic" }}>
                  No messages yet. Say something kind.
                </div>
              )}
              {blocked && (
                <div style={{ background: "rgba(255,0,60,0.08)", color: "#ff003c", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,0,60,0.3)", textAlign: "center", fontSize: 12, fontWeight: 700, marginTop: 8 }}>
                  You have blocked this user. No more messages.
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={blocked ? "User blocked." : "Type a message..."}
                disabled={blocked}
                style={{
                  flex: 1, background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 10, padding: "9px 14px",
                  color: "#fff", fontSize: 13,
                  opacity: blocked ? 0.4 : 1,
                }}
              />
              <button
                type="submit"
                disabled={blocked}
                style={{
                  background: blocked ? "rgba(255,255,255,0.05)" : "#00f3ff",
                  color: blocked ? "#555" : "#000",
                  border: "none", borderRadius: 10,
                  padding: "9px 14px", cursor: blocked ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center",
                  transition: "background 0.2s",
                }}
              >
                <SendIcon color={blocked ? "#555" : "#000"} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

/* Icons */
function XIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function UserIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function AlertIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff003c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function MessageIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function ArrowLeftIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
function BanIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>;
}
function FlagIcon({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;
}
function SendIcon({ color = "#000" }: { color?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
