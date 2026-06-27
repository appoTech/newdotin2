import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  DEFAULT_PARSE,
  parseText,
  THEMES,
  totalDuration,
} from "../lib/reel/engine";
import { ReelStage } from "../components/reel/ReelStage";
import { Timeline } from "../components/reel/Timeline";
import { ControlPanel } from "../components/reel/ControlPanel";
import { OverlayPanel } from "../components/reel/OverlayPanel";
import { FakeOverlay, DEFAULT_OVERLAY } from "../components/reel/FakeOverlay";
import "../css/TextToReel.css";

const SAMPLE = `The future doesn't ask for permission.
It arrives in fragments — quiet, relentless, undeniable.

Most people wait for clarity. Builders move without it.
They ship, they learn, they ship again.

You don't need more time. You need momentum.
Start small. Stay loud. Compound everything.`;

export default function TextToReel() {
  const [input, setInput] = useState(SAMPLE);
  const [themeId, setThemeId] = useState("creator");
  const [scenes, setScenes] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [fontScale, setFontScale] = useState(1);
  const [letterSpacing, setLetterSpacing] = useState(-0.02);
  const [lineHeight, setLineHeight] = useState(1.05);
  const [speed, setSpeed] = useState(1);
  const [glow, setGlow] = useState(0.6);
  const [shadow, setShadow] = useState(0.3);
  const [align, setAlign] = useState("center");
  const [customBg, setCustomBg] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [overlay, setOverlay] = useState(DEFAULT_OVERLAY);
  const [overlayEnabled, setOverlayEnabled] = useState(true);

  const theme = THEMES[themeId];

  // Dynamic Google Font Injection
  useEffect(() => {
    const linkId = "text-to-reel-fonts";
    if (!document.getElementById(linkId)) {
      const preconnect1 = document.createElement("link");
      preconnect1.rel = "preconnect";
      preconnect1.href = "https://fonts.googleapis.com";
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement("link");
      preconnect2.rel = "preconnect";
      preconnect2.href = "https://fonts.gstatic.com";
      preconnect2.crossOrigin = "anonymous";
      document.head.appendChild(preconnect2);

      const linkF = document.createElement("link");
      linkF.id = linkId;
      linkF.rel = "stylesheet";
      linkF.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
      document.head.appendChild(linkF);
    }
  }, []);

  // Auto-generate on mount / when theme or input changes (deterministic)
  useEffect(() => {
    if (!input.trim()) {
      setScenes([]);
      return;
    }
    const next = parseText(input, { ...DEFAULT_PARSE, theme });
    setScenes(next);
    setCurrentTime(0);
  }, [input, themeId]); // theme controls fontSizeBase + animations + colors

  const total = totalDuration(scenes);

  const handleReorder = (from, to) => {
    setScenes((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return rebuildTiming(next);
    });
  };

  const handleUpdate = (id, patch) => {
    setScenes((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
      // If duration changed, propagate
      if ("end_time" in patch || "start_time" in patch) {
        return rebuildTiming(next);
      }
      return next;
    });
  };

  const handleDelete = (id) => {
    setScenes((prev) => rebuildTiming(prev.filter((s) => s.id !== id)));
  };

  const exportJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ theme: themeId, scenes }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text2reel-scenes.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-to-reel-theme min-h-screen hero-bg">
      <Helmet>
        <title>Text2Reel — Turn Words into reels</title>
        <meta
          name="description"
          content="Paste any blog, article, or thread. Get a beautiful 9:16 animated reel — built with pure deterministic frontend logic. No AI."
        />
        <meta property="og:title" content="Text2Reel Engine" />
        <meta
          property="og:description"
          content="Turn any blog or text into a beautiful animated text-only reel instantly."
        />
      </Helmet>

      <Header onExport={exportJSON} sceneCount={scenes.length} duration={total} />

      <div className="mx-auto max-w-[1500px] px-6 pb-16">
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1fr_460px_320px] lg:items-start">
          {/* LEFT — Input + timeline */}
          <div className="space-y-5 min-w-0 order-2 lg:order-1 w-full max-w-4xl mx-auto">
            <InputCard value={input} onChange={setInput} />
            <Timeline
              scenes={scenes}
              currentTime={currentTime}
              onSeek={(t) => {
                setPlaying(false);
                setCurrentTime(t);
              }}
              onReorder={handleReorder}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>

          {/* MIDDLE — Reel preview */}
          <div className="space-y-4 order-1 lg:order-2 w-full max-w-[380px] mx-auto flex flex-col items-center">
            <div className="glass-panel rounded-[32px] p-3 w-full">
              <div className="w-full aspect-[9/16] relative">
                <ReelStage
                  scenes={scenes}
                  theme={theme}
                  playing={playing}
                  currentTime={currentTime}
                  onTimeUpdate={setCurrentTime}
                  fontScale={fontScale}
                  letterSpacing={letterSpacing}
                  lineHeight={lineHeight}
                  glowIntensity={glow}
                  shadowIntensity={shadow}
                  align={align}
                  customBg={customBg || undefined}
                  customColor={customColor || undefined}
                  speed={speed}
                  onEnded={() => setPlaying(false)}
                  overlay={overlayEnabled ? <FakeOverlay config={overlay} /> : null}
                />
              </div>
            </div>

            <div className="w-full">
              <PlaybackBar
                playing={playing}
                onPlay={() => {
                  if (currentTime >= total) setCurrentTime(0);
                  setPlaying((p) => !p);
                }}
                onReset={() => {
                  setPlaying(false);
                  setCurrentTime(0);
                }}
                currentTime={currentTime}
                total={total}
              />
            </div>
          </div>

          {/* RIGHT — Controls */}
          <div className="space-y-5 order-3 lg:order-3 w-full max-w-xl mx-auto">
            <OverlayPanel
              config={overlay}
              onChange={setOverlay}
              enabled={overlayEnabled}
              onEnabled={setOverlayEnabled}
            />
            <ControlPanel
              themeId={themeId}
              onTheme={setThemeId}
              fontScale={fontScale} onFontScale={setFontScale}
              letterSpacing={letterSpacing} onLetterSpacing={setLetterSpacing}
              lineHeight={lineHeight} onLineHeight={setLineHeight}
              speed={speed} onSpeed={setSpeed}
              glow={glow} onGlow={setGlow}
              shadow={shadow} onShadow={setShadow}
              align={align} onAlign={setAlign}
              customBg={customBg} onCustomBg={setCustomBg}
              customColor={customColor} onCustomColor={setCustomColor}
              resetCustom={() => { setCustomBg(""); setCustomColor(""); }}
            />
          </div>

        </div>

        <Footer />
      </div>
    </div>
  );
}

function rebuildTiming(scenes) {
  let t = 0;
  return scenes.map((s) => {
    const dur = Math.max(0.2, s.end_time - s.start_time);
    const start = t;
    const end = t + dur;
    t = end + DEFAULT_PARSE.punctuationPause * 0.3; // tiny inter-scene breath
    return { ...s, start_time: round2(start), end_time: round2(end) };
  });
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function Header({
  onExport, sceneCount, duration,
}) {
  return (
    <header className="mx-auto max-w-[1500px] px-6 pt-8 pb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl border border-white/10 bg-black/60 grid place-items-center shadow-[var(--shadow-glow)]">
          <span className="text-gradient-gold font-black text-lg">T²</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Text<span className="text-gradient-gold">2</span>Reel
          </h1>
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Deterministic · Zero AI · Pure Logic
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-4 text-xs text-white/50 tabular-nums">
          <span>{sceneCount} scenes</span>
          <span className="h-3 w-px bg-white/10" />
          <span>{duration.toFixed(2)}s</span>
        </div>
        <button
          onClick={onExport}
          disabled={!sceneCount}
          className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 px-4 py-2 text-xs uppercase tracking-widest transition-colors"
        >
          Export JSON
        </button>
      </div>
    </header>
  );
}

function InputCard({
  value, onChange,
}) {
  const ref = useRef(null);
  const stats = useMemo(() => {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    return { words, chars: value.length };
  }, [value]);

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
          Paste your text
        </div>
        <div className="text-xs text-white/40 tabular-nums">
          {stats.words} words · {stats.chars} chars
        </div>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a blog, article, or thread here…"
        className="w-full h-44 resize-none rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-sm leading-relaxed text-white/85 outline-none focus:border-primary/50 transition-colors"
        spellCheck={false}
      />
      <div className="flex flex-wrap gap-2">
        <Chip onClick={() => onChange("")}>Clear</Chip>
        <Chip
          onClick={async () => {
            try {
              const t = await navigator.clipboard.readText();
              if (t) onChange(t);
            } catch { /* ignore */ }
          }}
        >
          Paste from clipboard
        </Chip>
      </div>
    </div>
  );
}

function Chip({
  children, onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] px-3 py-1 text-[11px] uppercase tracking-widest text-white/60"
    >
      {children}
    </button>
  );
}

function PlaybackBar({
  playing, onPlay, onReset, currentTime, total,
}) {
  return (
    <div className="glass-panel rounded-2xl p-3 flex items-center gap-3">
      <button
        onClick={onPlay}
        className="h-11 w-11 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-glow)] hover:scale-[1.03] active:scale-95 transition-transform"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <button
        onClick={onReset}
        className="h-11 w-11 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] grid place-items-center text-white/70"
        title="Reset"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
        </svg>
      </button>
      <div className="flex-1 text-xs text-white/50 tabular-nums">
        {currentTime.toFixed(2)} / {total.toFixed(2)}s
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-12 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
      Text2Reel · Pure Frontend Engine · No AI · No Servers
    </footer>
  );
}
