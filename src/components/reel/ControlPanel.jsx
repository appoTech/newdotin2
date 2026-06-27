import React from "react";
import { THEMES } from "../../lib/reel/engine";

export function ControlPanel(p) {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-6">
      <Section title="Theme">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
          {Object.values(THEMES).map((t) => (
            <button
              key={t.id}
              onClick={() => p.onTheme(t.id)}
              className={`group flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all ${
                p.themeId === t.id
                  ? "border-primary/60 bg-primary/10"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >
              <div
                className="h-9 w-9 rounded-lg border border-white/10 grid place-items-center text-xs font-bold shrink-0"
                style={{ background: t.background, color: t.textColor, fontFamily: t.fontFamily }}
              >
                Aa
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/90">{t.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 truncate">
                  {t.tagline}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <Slider label="Font scale" value={p.fontScale} min={0.5} max={1.6} step={0.05} onChange={p.onFontScale} fmt={(v) => `${(v * 100).toFixed(0)}%`} />
        <Slider label="Letter spacing" value={p.letterSpacing} min={-0.05} max={0.2} step={0.01} onChange={p.onLetterSpacing} fmt={(v) => `${v.toFixed(2)}em`} />
        <Slider label="Line height" value={p.lineHeight} min={0.9} max={1.6} step={0.05} onChange={p.onLineHeight} fmt={(v) => v.toFixed(2)} />
        <div className="flex gap-2 pt-1">
          {["center", "left"].map((a) => (
            <button
              key={a}
              onClick={() => p.onAlign(a)}
              className={`flex-1 rounded-lg border px-3 py-1.5 text-xs uppercase tracking-widest ${
                p.align === a
                  ? "border-primary/60 bg-primary/15 text-white"
                  : "border-white/5 text-white/50 hover:text-white/80"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Effects">
        <Slider label="Glow" value={p.glow} min={0} max={2} step={0.05} onChange={p.onGlow} fmt={(v) => v.toFixed(2)} />
        <Slider label="Shadow" value={p.shadow} min={0} max={2} step={0.05} onChange={p.onShadow} fmt={(v) => v.toFixed(2)} />
        <Slider label="Playback speed" value={p.speed} min={0.25} max={2} step={0.05} onChange={p.onSpeed} fmt={(v) => `${v.toFixed(2)}×`} />
      </Section>

      <Section title="Custom colors">
        <div className="grid grid-cols-2 gap-3">
          <ColorField label="Text" value={p.customColor} onChange={p.onCustomColor} />
          <ColorField label="Background" value={p.customBg} onChange={p.onCustomBg} />
        </div>
        <button
          onClick={p.resetCustom}
          className="mt-2 w-full text-[10px] uppercase tracking-widest text-white/40 hover:text-white/70 py-1"
        >
          Reset to theme
        </button>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, fmt,
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-white/60 mb-1.5">
        <span>{label}</span>
        <span className="tabular-nums text-white/90">{fmt(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </div>
  );
}

function ColorField({
  label, value, onChange,
}) {
  const isSolid = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{label}</div>
      <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/40 p-1.5">
        <input
          type="color"
          value={isSolid ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 rounded cursor-pointer bg-transparent border-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-xs text-white/80 outline-none"
        />
      </div>
    </label>
  );
}
