import { useState, useRef, useEffect } from "react";

interface Props {
  open: boolean;
  onToggle: () => void;
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

const botReplies = [
  "I hear you. Let's unpack that together. Tell me more.",
  "That sounds really difficult. How long have you been feeling this way?",
  "Your feelings are valid. What do you think triggered this?",
  "It takes courage to talk about this. I'm here to listen.",
  "Let's take a breath together. Would you like to try a short grounding exercise?",
  "You're not alone in feeling this way. Many students experience similar challenges.",
  "Thank you for sharing that with me. What kind of support feels most helpful right now?",
  "That's a really insightful observation. How does it make you feel?",
];

export function AIChatBot({ open, onToggle }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "bot", text: "Hello! I'm Aura. I'm equipped with a Ph.D. level understanding of psychology. Tell me what's on your mind." }
  ]);
  const [input, setInput] = useState("");
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      setMessages(prev => [...prev, { id: Date.now().toString() + "b", role: "bot", text: reply }]);
    }, 900 + Math.random() * 600);
  };

  return (
    <div className="fixed flex flex-col items-end" style={{ bottom: 24, right: 24, zIndex: 50, pointerEvents: "auto" }}>
      {/* Chat panel */}
      <div
        className={`glass-panel rounded-2xl flex flex-col overflow-hidden transition-all duration-300 mb-4 ${open ? "chat-open" : "chat-closed"}`}
        style={{ width: 360, height: "32rem" }}
      >
        <div className="flex flex-col gap-1" style={{ background: "rgba(0,0,0,0.4)", padding: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <div className="flex flex-col">
              <h3 className="font-bold text-sm text-white tracking-tight">Aura Companion</h3>
              <span className="font-mono font-bold uppercase" style={{ fontSize: "9px", color: "#9ca3af", letterSpacing: "0.1em" }}>AI Therapy Agent</span>
            </div>
          </div>
        </div>

        <div
          ref={historyRef}
          className="flex-1 overflow-y-auto flex flex-col gap-3 no-scrollbar"
          style={{ padding: 16, fontSize: "13px", background: "rgba(0,0,0,0.2)" }}
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl leading-relaxed ${msg.role === "user" ? "self-end rounded-tr-none" : "self-start rounded-tl-none"}`}
              style={{
                maxWidth: "90%",
                background: msg.role === "user" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
                border: msg.role === "bot" ? "1px solid rgba(255,255,255,0.2)" : "none",
                color: "#f3f4f6"
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2"
          style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.6)" }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 text-white text-xs transition-colors"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 12px", outline: "none" }}
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex items-center transition-colors"
            style={{ padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white" }}
            onMouseOver={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
          >
            <SendIcon />
          </button>
        </form>
      </div>

      {/* Orb button */}
      <button
        onClick={onToggle}
        className="w-14 h-14 rounded-full flex items-center justify-center orb-glow transition-transform duration-200 hover:scale-105 shadow-lg"
        style={{ background: "white", border: "1px solid #d1d5db", cursor: "pointer" }}
      >
        <MessageCircleIcon />
      </button>
    </div>
  );
}

function SendIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
function MessageCircleIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
