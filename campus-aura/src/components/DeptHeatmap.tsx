import { useState, useEffect } from "react";

const deptsData = [
  { n: "Computer Science", base: 80, emotion: "Burnout" },
  { n: "Medical School", base: 85, emotion: "Anxiety" },
  { n: "Engineering", base: 65, emotion: "Stressed" },
  { n: "Business", base: 45, emotion: "Elevated" },
  { n: "Liberal Arts", base: 25, emotion: "Stable" },
  { n: "Architecture", base: 75, emotion: "Fatigue" },
  { n: "Law School", base: 82, emotion: "Panic" },
  { n: "Fine Arts", base: 35, emotion: "Calm" },
  { n: "Education", base: 40, emotion: "Stable" },
  { n: "Psychology", base: 60, emotion: "Fatigue" },
  { n: "Physics", base: 70, emotion: "Overwhelmed" },
  { n: "Mathematics", base: 55, emotion: "Stressed" },
];

function getEmotionColor(score: number) {
  if (score >= 75) return "#ff003c";
  if (score >= 55) return "#ffcc00";
  if (score >= 40) return "#9ca3af";
  return "#6b7280";
}

export function DeptHeatmap() {
  const [scores, setScores] = useState(() => deptsData.map(d => d.base));

  useEffect(() => {
    const interval = setInterval(() => {
      setScores(prev => prev.map((s, i) => Math.max(0, Math.min(100, deptsData[i].base + (Math.random() * 8 - 4)))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl flex flex-col gap-2 overflow-hidden" style={{ padding: 16, height: "28vh", minHeight: 160 }}>
      <h3 className="font-bold uppercase flex items-center gap-2 mb-2 pb-2" style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <BarChartIcon /> Department Analytics
      </h3>
      <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-2">
        {deptsData.map((d, i) => {
          const s = Math.round(scores[i]);
          const color = getEmotionColor(s);
          return (
            <div
              key={d.n}
              className="flex justify-between items-center rounded-xl transition-colors cursor-default"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px 12px" }}
            >
              <div>
                <div className="font-bold text-white uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>{d.n}</div>
                <div className="mt-1 font-bold flex items-center gap-1" style={{ fontSize: "9px", color }}>
                  <ActivityIcon /> {d.emotion}
                </div>
              </div>
              <div className="font-mono font-bold text-white text-xs">{s}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarChartIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>; }
function ActivityIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
