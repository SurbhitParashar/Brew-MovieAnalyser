"use client";

import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";

export default function Home() {
  const [imdbId,  setImdbId]  = useState("");
  const [movie,   setMovie]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  async function fetchMovie() {
    if (!imdbId.trim()) { setError("Enter an IMDb ID first."); return; }
    setError(""); setLoading(true); setMovie(null);
    try {
      const res = await fetch("/api/movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbId: imdbId.trim() }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setMovie(await res.json());
    } catch {
      setError("Couldn't load that IMDb ID — double-check and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) { if (e.key === "Enter") fetchMovie(); }

  const examples = ["tt0816692", "tt0111161", "tt0468569"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,700;1,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Outfit', sans-serif; background: #060810; color: #e2e8f0; min-height: 100vh;
        }

        .hp {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 100% 60% at 50% -8%, rgba(79,70,229,0.2), transparent),
            radial-gradient(ellipse 55% 45% at 88% 88%, rgba(14,165,233,0.08), transparent),
            #060810;
          display: flex; flex-direction: column; align-items: center;
          padding: 72px 20px 100px;
        }

        /* ── HERO ── */
        .hp-hero {
          text-align: center; max-width: 580px; margin-bottom: 44px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.75s ease, transform 0.75s ease;
        }
        .hp-hero.in { opacity: 1; transform: translateY(0); }

        .hp-kicker {
          display: inline-flex; align-items: center; gap: 8px; margin-bottom: 22px;
          padding: 5px 14px 5px 10px; border-radius: 99px;
          background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.18);
          font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          color: #818cf8;
        }
        .hp-kicker-icon {
          width: 20px; height: 20px; border-radius: 6px; background: rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center; font-size: 11px;
        }

        .hp-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(36px, 6.5vw, 58px);
          font-weight: 700; line-height: 1.05; letter-spacing: -0.025em;
          color: #f1f5f9; margin-bottom: 16px;
        }
        .hp-title-accent {
          font-style: italic; font-weight: 500;
          background: linear-gradient(135deg, #818cf8 0%, #67e8f9 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .hp-desc {
          font-size: 15px; font-weight: 300; line-height: 1.75; color: #334155;
          max-width: 400px; margin: 0 auto;
        }

        /* ── SEARCH ── */
        .hp-search-outer {
          width: 100%; max-width: 540px; margin-bottom: 14px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.75s ease 0.12s, transform 0.75s ease 0.12s;
        }
        .hp-search-outer.in { opacity: 1; transform: translateY(0); }

        .hp-search {
          display: flex; align-items: center; gap: 0;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px; overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .hp-search:focus-within {
          border-color: rgba(99,102,241,0.45);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.09), 0 8px 32px rgba(0,0,0,0.4);
        }
        .hp-search-icon { padding: 0 15px; color: #334155; display: flex; align-items: center; flex-shrink: 0; }
        .hp-input {
          flex: 1; background: none; border: none; outline: none;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 400;
          color: #e2e8f0; padding: 16px 0; caret-color: #818cf8;
          letter-spacing: 0.01em;
        }
        .hp-input::placeholder { color: #1e293b; }

        .hp-go {
          margin: 6px 6px 6px 0;
          padding: 10px 20px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border: none; border-radius: 10px; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 11.5px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #fff; flex-shrink: 0;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(79,70,229,0.35);
        }
        .hp-go:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(79,70,229,0.5); filter: brightness(1.08); }
        .hp-go:active:not(:disabled) { transform: translateY(0); }
        .hp-go:disabled { opacity: 0.35; cursor: not-allowed; }

        /* ── EXAMPLES ── */
        .hp-examples {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center;
          font-size: 11px; color: #1e293b;
          opacity: 0; transition: opacity 0.6s ease 0.25s;
        }
        .hp-examples.in { opacity: 1; }
        .hp-ex-label { font-weight: 500; letter-spacing: 0.05em; }
        .hp-ex-chip {
          padding: 3px 10px; border-radius: 6px; font-family: monospace; font-size: 10.5px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          color: #64748b; cursor: pointer; transition: all 0.18s;
        }
        .hp-ex-chip:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.25); color: #a5b4fc; }

        /* ── ERROR ── */
        .hp-err {
          font-size: 12px; color: #fca5a5; padding: 8px 16px; border-radius: 9px;
          background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18);
          max-width: 540px; text-align: center; margin-top: 2px;
          animation: shake 0.3s ease;
        }
        @keyframes shake { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-5px)} 70%{transform:translateX(5px)} }

        /* ── FEATURES ── */
        .hp-feats {
          display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 36px;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
        }
        .hp-feats.in { opacity: 1; transform: translateY(0); }
        .hp-feat {
          display: flex; align-items: center; gap: 6px; padding: 5px 12px;
          border-radius: 99px; font-size: 11px; font-weight: 500; letter-spacing: 0.02em;
          color: #334155; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.2s;
        }
        .hp-feat:hover { color: #64748b; border-color: rgba(255,255,255,0.1); }

        /* ── SKELETON ── */
        .hp-skel { width: 100%; max-width: 940px; margin-top: 52px; }
        .skel-hero {
          height: 215px; border-radius: 16px 16px 0 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.025) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.025) 75%);
          background-size: 200% 100%; animation: shimmer 1.7s infinite;
          border: 1px solid rgba(255,255,255,0.06); border-bottom: none;
        }
        .skel-tabs {
          height: 44px; background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.06); border-top: none; border-bottom: none;
        }
        .skel-body {
          height: 155px; border-radius: 0 0 16px 16px;
          background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.06); border-top: none;
          padding: 24px; display: flex; flex-direction: column; gap: 11px;
        }
        .skel-ln {
          border-radius: 5px;
          background: linear-gradient(90deg, rgba(255,255,255,0.025) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.025) 75%);
          background-size: 200% 100%; animation: shimmer 1.7s infinite;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skel-status {
          display: flex; align-items: center; justify-content: center; gap: 9px;
          margin-top: 18px; font-size: 11.5px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #334155;
        }
        .skel-spin {
          width: 13px; height: 13px; border-radius: 50%;
          border: 2px solid rgba(99,102,241,0.18); border-top-color: #6366f1;
          animation: sp 0.85s linear infinite;
        }
        @keyframes sp { to { transform: rotate(360deg); } }

        /* ── RESULT ── */
        .hp-result { width: 100%; max-width: 940px; margin-top: 52px; }

        @media (max-width: 480px) {
          .hp { padding: 48px 16px 80px; }
          .hp-go { padding: 10px 14px; font-size: 10.5px; }
        }
      `}</style>

      <div className="hp">

        {/* HERO */}
        <div className={`hp-hero${mounted ? " in" : ""}`}>
          <div className="hp-kicker">
            <div className="hp-kicker-icon">✦</div>
            AI-Powered Film Intelligence
          </div>
          <h1 className="hp-title">
            Movie Insight<br />
            <span className="hp-title-accent">Builder</span>
          </h1>
          <p className="hp-desc">
            Drop any IMDb ID for a deep-cut analysis — sentiment, emotional tone, audience demographics, and more.
          </p>
        </div>

        {/* SEARCH */}
        <div className={`hp-search-outer${mounted ? " in" : ""}`}>
          <div className="hp-search">
            <div className="hp-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              className="hp-input"
              placeholder="IMDb ID — e.g. tt0816692"
              value={imdbId}
              onChange={e => { setImdbId(e.target.value); setError(""); }}
              onKeyDown={handleKey}
              disabled={loading}
              spellCheck={false}
            />
            <button className="hp-go" onClick={fetchMovie} disabled={loading || !imdbId.trim()}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        </div>

        {/* EXAMPLES */}
        {!movie && !loading && !error && (
          <div className={`hp-examples${mounted ? " in" : ""}`}>
            <span className="hp-ex-label">Try:</span>
            {examples.map(id => (
              <span key={id} className="hp-ex-chip" onClick={() => { setImdbId(id); setError(""); }}>{id}</span>
            ))}
          </div>
        )}

        {/* ERROR */}
        {error && <div className="hp-err">⚠ {error}</div>}

        {/* FEATURE PILLS */}
        {!movie && !loading && (
          <div className={`hp-feats${mounted ? " in" : ""}`}>
            {[["🎭","Emotional Tone"],["📊","Sentiment Score"],["🎯","Age Targeting"],["⚡","Polarization"],["🕐","Watch Guide"]].map(([ic, tx]) => (
              <div key={tx} className="hp-feat">{ic} {tx}</div>
            ))}
          </div>
        )}

        {/* SKELETON */}
        {loading && (
          <div className="hp-skel">
            <div className="skel-hero" />
            <div className="skel-tabs" />
            <div className="skel-body">
              <div className="skel-ln" style={{ height: 9, width: "28%" }} />
              <div className="skel-ln" style={{ height: 7, width: "92%" }} />
              <div className="skel-ln" style={{ height: 7, width: "78%" }} />
              <div className="skel-ln" style={{ height: 7, width: "55%" }} />
            </div>
            <div className="skel-status"><div className="skel-spin" /> Analyzing reviews…</div>
          </div>
        )}

        {/* RESULT */}
        {movie && !loading && (
          <div className="hp-result"><MovieCard movie={movie} /></div>
        )}

      </div>
    </>
  );
}