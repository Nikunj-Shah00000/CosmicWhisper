import { useState, useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { formatRelativeTime } from "@/lib/utils";
import { useGetWhisperMessages, usePostWhisperMessage } from "@workspace/api-client-react";

interface WhisperMsg {
  id: string;
  anonId: string;
  text: string;
  emotion: string;
  timestamp: string;
}

const MY_ANON_ID = `Anon #${Math.floor(100 + Math.random() * 900)}`;
const EMOTIONS = ["Stressed", "Anxious", "Hopeful", "Tired", "Burned Out", "Calm", "Overwhelmed", "Lonely"];

export function WhisperWallPanel() {
  const [messages, setMessages] = useState<WhisperMsg[]>([]);
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState("Stressed");
  const feedRef = useRef<HTMLDivElement>(null);

  const { data: initialMsgs } = useGetWhisperMessages();
  const postMutation = usePostWhisperMessage();

  useEffect(() => {
    if (initialMsgs && messages.length === 0) {
      setMessages(initialMsgs as WhisperMsg[]);
    }
  }, [initialMsgs]);

  useEffect(() => {
    const handler = (msg: WhisperMsg) => {
      setMessages(prev => {
        const next = [msg, ...prev].slice(0, 50);
        return next;
      });
      setTimeout(() => {
        if (feedRef.current) feedRef.current.scrollTop = 0;
      }, 50);
    };
    socket.on("whisper_broadcast", handler);
    return () => { socket.off("whisper_broadcast", handler); };
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    socket.emit("whisper_message", { text: text.trim(), emotion, anonId: MY_ANON_ID });
    setText("");
    setComposing(false);
  };

  return (
    <div className="flex flex-col gap-2" style={{ height: "28vh", overflow: "hidden" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2 uppercase pl-2" style={{ fontSize: "12px", letterSpacing: "0.1em", color: "#9ca3af" }}>
          <MsgDashIcon /> Whisper Wall
        </h2>
        <button
          onClick={() => setComposing(v => !v)}
          className="font-bold uppercase transition-colors"
          style={{
            fontSize: "9px", letterSpacing: "0.1em", padding: "4px 10px",
            background: composing ? "rgba(0,243,255,0.15)" : "rgba(255,255,255,0.08)",
            border: `1px solid ${composing ? "rgba(0,243,255,0.4)" : "rgba(255,255,255,0.15)"}`,
            borderRadius: 6, cursor: "pointer", color: composing ? "#00f3ff" : "#9ca3af"
          }}
        >
          {composing ? "Cancel" : "+ Whisper"}
        </button>
      </div>

      {composing && (
        <div className="glass-panel rounded-xl p-3 flex flex-col gap-2" style={{ flexShrink: 0 }}>
          <div className="flex gap-2">
            <select
              value={emotion}
              onChange={e => setEmotion(e.target.value)}
              className="text-white font-bold text-xs rounded-lg"
              style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 8px", outline: "none", flex: "0 0 auto" }}
            >
              {EMOTIONS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              placeholder="Share something anonymously..."
              maxLength={280}
              className="flex-1 text-white text-xs transition-colors"
              style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 10px", outline: "none" }}
              autoFocus
            />
            <button
              onClick={handleSend}
              style={{ background: "white", color: "black", padding: "6px 8px", borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      <div
        ref={feedRef}
        className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-4"
        style={{ flex: 1 }}
      >
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className="feed-item glass-panel rounded-xl px-3 py-2.5"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="font-bold text-white" style={{ fontSize: "12px" }}>{msg.text}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono font-bold" style={{ fontSize: "9px", color: "#9ca3af" }}>{msg.anonId}</span>
                  <span style={{ fontSize: "9px", color: "#6b7280" }}>·</span>
                  <span style={{ fontSize: "9px", color: "#6b7280" }}>{formatRelativeTime(msg.timestamp)}</span>
                </div>
              </div>
              <span className="font-bold flex-shrink-0" style={{ fontSize: "9px", color: "#00f3ff", background: "rgba(0,243,255,0.1)", border: "1px solid rgba(0,243,255,0.2)", padding: "2px 6px", borderRadius: 4 }}>{msg.emotion}</span>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center italic" style={{ fontSize: "11px", color: "#4b5563", marginTop: 12 }}>No whispers yet. Be the first.</div>
        )}
      </div>
    </div>
  );
}

function MsgDashIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="12" y2="14"/></svg>; }
function SendIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
