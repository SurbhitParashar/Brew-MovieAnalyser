import { useState, useEffect, useRef } from "react";

const mockMovie = {
  title: "Oppenheimer",
  year: "2023",
  rating: "8.9/10",
  poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
  sentiment: "positive",
  plot: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, and the moral reckoning that followed.",
  cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr.", "Florence Pugh", "Josh Hartnett"],
  summary: "Viewers praise the film's unflinching portrayal of scientific ambition and moral conflict. The non-linear narrative structure earns widespread acclaim for its layered tension and emotional payoff.",
  emotionalTone: "Tense, cerebral, and profoundly unsettling. Audiences report feelings of awe, dread, and philosophical unease long after the credits roll.",
  bestTime: "Evening with uninterrupted focus. Best in theatre or premium home audio.",
  ageRange: "Primarily resonates with adults 28–55. Younger viewers appreciate spectacle; older audiences connect with historical and political weight.",
  polarization: "Moderate polarization. A minority find the pacing slow; the majority consider Nolan's restraint a masterful and deliberate artistic choice that elevates the film beyond typical blockbuster fare.",
};

const sentimentMap = {
  positive: { label: "Positive", color: "#22c55e" },
  negative: { label: "Negative", color: "#ef4444" },
  neutral:  { label: "Mixed",    color: "#f59e0b" },
};

function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.05 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function RatingRing({ rating, color }) {
  const r = 30, circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);
  const ref = useRef(); const iv = useInView(ref);
  useEffect(() => {
    if (!iv) return;
    const t = setTimeout(() => setOff(circ * (1 - rating / 10)), 400);
    return () => clearTimeout(t);
  }, [iv, rating, circ]);
  return (
    <div ref={ref} style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg style={{ transform: "rotate(-90deg)" }} width="72" height="72" viewBox="0 0 72 72">
        <circle fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5" cx="36" cy="36" r={r} />
        <circle fill="none" strokeWidth="4.5" strokeLinecap="round" stroke={color}
          cx="36" cy="36" r={r} strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)", filter: `drop-shadow(0 0 6px ${color}90)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color }}>{rating}</span>
        <span style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#475569", marginTop: 3 }}>IMDb</span>
      </div>
    </div>
  );
}

function GaugeBar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0);
  const ref = useRef(); const iv = useInView(ref);
  useEffect(() => {
    if (!iv) return;
    const t = setTimeout(() => setW(pct), delay);
    return () => clearTimeout(t);
  }, [iv, pct, delay]);
  return (
    <div ref={ref} style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: color, transition: "width 1.1s cubic-bezier(.22,1,.36,1)", borderRadius: 99, boxShadow: `0 0 8px ${color}70` }} />
    </div>
  );
}

/* ── Asymmetric Insight Cards ── */
const insightLayouts = [
  /* Audience Summary — tall left card */
  { icon: "👥", label: "Audience Summary",  key: "summary",      accent: "#6366f1",
    style: { gridArea: "a", minHeight: 180 }, size: "lg" },
  /* Emotional Tone — medium top-right */
  { icon: "🎭", label: "Emotional Tone",     key: "emotionalTone", accent: "#e879f9",
    style: { gridArea: "b" }, size: "md" },
  /* Best Time — small */
  { icon: "🕐", label: "Best Time to Watch", key: "bestTime",     accent: "#38bdf8",
    style: { gridArea: "c" }, size: "sm" },
  /* Age Range — small */
  { icon: "🎯", label: "Ideal Age Range",    key: "ageRange",     accent: "#fb923c",
    style: { gridArea: "d" }, size: "sm" },
  /* Polarization — wide bottom */
  { icon: "⚡", label: "Polarization Level", key: "polarization", accent: "#facc15",
    style: { gridArea: "e", minHeight: 100 }, size: "wide" },
];

function InsightBlock({ icon, label, value, accent, style, size, index }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 300 + index * 80); return () => clearTimeout(t); }, []);

  const fontSizes = { lg: 13.5, md: 13, sm: 12.5, wide: 13 };
  const iconSizes = { lg: 40, md: 36, sm: 30, wide: 34 };

  return (
    <div style={{
      ...style,
      background: "rgba(255,255,255,0.018)",
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: 14,
      padding: size === "sm" ? "16px 16px" : "20px 22px",
      position: "relative", overflow: "hidden",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0) scale(1)" : "translateY(14px) scale(0.98)",
      transition: `opacity 0.55s ease, transform 0.55s ease`,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = `rgba(${hexToRgb(accent)},0.06)`; e.currentTarget.style.borderColor = `${accent}35`; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.018)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
    >
      {/* top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, width: size === "wide" ? "40%" : "60%", height: 2, background: `linear-gradient(to right, ${accent}, transparent)`, borderRadius: 2 }} />
      {/* bg glow orb */}
      <div style={{ position: "absolute", bottom: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${accent}12, transparent 70%)`, pointerEvents: "none" }} />

      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: size === "sm" ? 10 : 14 }}>
          <div style={{
            width: iconSizes[size], height: iconSizes[size], borderRadius: size === "sm" ? 8 : 10, flexShrink: 0,
            background: `${accent}15`, border: `1px solid ${accent}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size === "sm" ? 14 : 16,
          }}>{icon}</div>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, opacity: 0.5, marginTop: 4 }} />
        </div>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#475569", marginBottom: size === "sm" ? 6 : 8 }}>{label}</div>
        <div style={{ fontSize: fontSizes[size], lineHeight: 1.72, color: "#64748b", fontWeight: 300 }}>{value}</div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "124,58,237";
}

export default function MovieCard({ movie = mockMovie }) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState("overview");
  const s = sentimentMap[movie?.sentiment] || sentimentMap.neutral;

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);
  if (!movie) return null;

  const ratingNum = parseFloat(movie.rating);

  const sentimentBars = [
    { label: "Positive", color: "#22c55e", pct: movie.sentiment === "positive" ? 74 : movie.sentiment === "neutral" ? 42 : 18 },
    { label: "Neutral",  color: "#f59e0b", pct: 20 },
    { label: "Negative", color: "#ef4444", pct: movie.sentiment === "negative" ? 62 : movie.sentiment === "neutral" ? 38 : 6 },
  ];

  const tabs = [["overview","Overview"],["cast","Cast"],["sentiment","Sentiment"],["insights","AI Insights"]];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,700;1,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #060810; font-family: 'Outfit', sans-serif; color: #e2e8f0; min-height: 100vh;
        }
        .mc-page { min-height: 100vh; padding: 48px 20px 80px; display: flex; align-items: flex-start; justify-content: center; }
        .mc-card { width: 100%; max-width: 940px; opacity: 0; transform: translateY(22px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .mc-card.in { opacity: 1; transform: translateY(0); }

        /* HERO */
        .mc-hero {
          display: flex; position: relative; overflow: hidden; border-radius: 16px 16px 0 0;
          background: #0d1017; border: 1px solid rgba(255,255,255,0.07); border-bottom: none;
        }
        .mc-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 80% at 100% 50%, rgba(88,28,235,0.09), transparent);
        }
        .mc-poster-col { position: relative; flex-shrink: 0; width: 190px; }
        .mc-poster { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.8) saturate(0.8) contrast(1.05); }
        .mc-poster-fade { position: absolute; inset: 0; background: linear-gradient(105deg, transparent 40%, #0d1017 95%); }
        .mc-hero-body { flex: 1; padding: 28px 28px 24px; position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; }

        .mc-tags { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .mc-tag-group { display: flex; gap: 6px; }
        .mc-chip {
          padding: 3px 11px; border-radius: 99px; font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase; border: 1px solid;
        }
        .mc-chip-yr { color: #94a3b8; background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.09); }
        .mc-chip-type { color: #a78bfa; background: rgba(124,58,237,0.07); border-color: rgba(124,58,237,0.18); }

        .mc-title {
          font-family: 'Fraunces', serif; font-size: clamp(22px,3.8vw,36px);
          font-weight: 700; line-height: 1.1; color: #f1f5f9; margin-bottom: 16px; letter-spacing: -0.02em;
        }
        .mc-title em { font-style: italic; font-weight: 500; color: #94a3b8; }

        .mc-meta { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
        .mc-mi { display: flex; flex-direction: column; gap: 2px; }
        .mc-ml { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #334155; }
        .mc-mv { font-size: 13.5px; color: #cbd5e1; font-weight: 500; }
        .mc-sep { width: 1px; height: 26px; background: rgba(255,255,255,0.07); }

        .mc-spill {
          display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px;
          border-radius: 99px; font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; border: 1px solid; width: fit-content;
        }
        .mc-sdot { width: 6px; height: 6px; border-radius: 50%; animation: blink 2.2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

        /* TABS */
        .mc-tabs {
          display: flex; background: #090c15; overflow-x: auto; scrollbar-width: none;
          border: 1px solid rgba(255,255,255,0.07); border-top: none; border-bottom: none;
        }
        .mc-tabs::-webkit-scrollbar { display: none; }
        .mc-tab {
          padding: 12px 22px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: #334155; background: none; border: none; cursor: pointer;
          position: relative; transition: color 0.2s; white-space: nowrap; font-family: 'Outfit', sans-serif;
        }
        .mc-tab:hover { color: #64748b; }
        .mc-tab.on { color: #e2e8f0; }
        .mc-tab.on::after {
          content: ''; position: absolute; bottom: 0; left: 16px; right: 16px; height: 1.5px;
          background: linear-gradient(90deg, #818cf8, #67e8f9); border-radius: 2px 2px 0 0;
        }

        /* BODY */
        .mc-body {
          background: #090c15; border: 1px solid rgba(255,255,255,0.07);
          border-top: none; border-radius: 0 0 16px 16px; padding: 28px;
        }
        .mc-ey { font-size: 9.5px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #6366f1; margin-bottom: 11px; }
        .mc-txt { font-size: 14px; line-height: 1.84; color: #64748b; font-weight: 300; }

        .mc-cast { display: flex; flex-wrap: wrap; gap: 8px; }
        .mc-ctag {
          padding: 5px 13px; border-radius: 7px; font-size: 12.5px; font-weight: 400;
          color: #94a3b8; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          cursor: default; transition: all 0.2s;
        }
        .mc-ctag:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.3); color: #c7d2fe; }

        .mc-sbars { display: flex; flex-direction: column; gap: 13px; }
        .mc-srow { display: flex; align-items: center; gap: 11px; }
        .mc-slbl { font-size: 11.5px; font-weight: 500; color: #475569; width: 66px; flex-shrink: 0; }
        .mc-sbar { flex: 1; }
        .mc-spct { font-size: 11.5px; font-weight: 700; width: 34px; text-align: right; flex-shrink: 0; }
        .mc-hr { height: 1px; background: rgba(255,255,255,0.05); margin: 22px 0; }

        /* INSIGHT ASYMMETRIC GRID */
        .mc-ig {
          display: grid;
          grid-template-areas:
            "a b b"
            "a c d"
            "e e e";
          grid-template-columns: 1.4fr 1fr 1fr;
          grid-template-rows: auto auto auto;
          gap: 11px;
        }

        @media (max-width: 620px) {
          .mc-hero { flex-direction: column; }
          .mc-poster-col { width: 100%; height: 190px; }
          .mc-poster-fade { background: linear-gradient(to bottom, transparent 50%, #0d1017 100%); }
          .mc-hero-body { padding: 18px; }
          .mc-ig { grid-template-areas: "a" "b" "c" "d" "e"; grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="mc-page">
        <div className={`mc-card${mounted ? " in" : ""}`}>

          {/* HERO */}
          <div className="mc-hero">
            <div className="mc-poster-col">
              <img src={movie.poster} alt={movie.title} className="mc-poster" />
              <div className="mc-poster-fade" />
            </div>
            <div className="mc-hero-body">
              <div>
                <div className="mc-tags">
                  <div className="mc-tag-group">
                    <span className="mc-chip mc-chip-yr">{movie.year}</span>
                    <span className="mc-chip mc-chip-type">Film Analysis</span>
                  </div>
                  <RatingRing rating={ratingNum} color={s.color} />
                </div>
                <h1 className="mc-title">{movie.title}</h1>
                <div className="mc-meta">
                  <div className="mc-mi">
                    <span className="mc-ml">IMDb Score</span>
                    <span className="mc-mv">{movie.rating}</span>
                  </div>
                  <div className="mc-sep" />
                  <div className="mc-mi">
                    <span className="mc-ml">Release</span>
                    <span className="mc-mv">{movie.year}</span>
                  </div>
                  <div className="mc-sep" />
                  <div className="mc-mi">
                    <span className="mc-ml">Cast</span>
                    <span className="mc-mv">{movie.cast?.length || 0} leads</span>
                  </div>
                </div>
              </div>
              <span className="mc-spill" style={{ color: s.color, background: `${s.color}12`, borderColor: `${s.color}38` }}>
                <span className="mc-sdot" style={{ background: s.color }} />
                Audience Sentiment — {s.label}
              </span>
            </div>
          </div>

          {/* TABS */}
          <div className="mc-tabs">
            {tabs.map(([id, lbl]) => (
              <button key={id} className={`mc-tab${tab === id ? " on" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* BODY */}
          <div className="mc-body">

            {tab === "overview" && (
              <>
                <div className="mc-ey">Plot Synopsis</div>
                <p className="mc-txt">{movie.plot}</p>
              </>
            )}

            {tab === "cast" && (
              <>
                <div className="mc-ey">Starring</div>
                <div className="mc-cast">
                  {movie.cast?.map((a, i) => <span key={i} className="mc-ctag">{a}</span>)}
                </div>
              </>
            )}

            {tab === "sentiment" && (
              <>
                <div className="mc-ey">Sentiment Distribution</div>
                <div className="mc-sbars">
                  {sentimentBars.map((row, i) => (
                    <div key={row.label} className="mc-srow">
                      <span className="mc-slbl">{row.label}</span>
                      <div className="mc-sbar"><GaugeBar pct={row.pct} color={row.color} delay={i * 120} /></div>
                      <span className="mc-spct" style={{ color: row.color }}>{row.pct}%</span>
                    </div>
                  ))}
                </div>
                <div className="mc-hr" />
                <div className="mc-ey">Verdict</div>
                <p className="mc-txt">Based on aggregated audience data, this film skews strongly {s.label.toLowerCase()} with broad critical and viewer acclaim.</p>
              </>
            )}

            {tab === "insights" && (
              <>
                <div className="mc-ey" style={{ marginBottom: 16 }}>AI-Powered Analysis</div>
                <div className="mc-ig">
                  {insightLayouts.map((item, i) => (
                    <InsightBlock
                      key={item.key}
                      icon={item.icon}
                      label={item.label}
                      value={movie[item.key] || "—"}
                      accent={item.accent}
                      style={item.style}
                      size={item.size}
                      index={i}
                    />
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}