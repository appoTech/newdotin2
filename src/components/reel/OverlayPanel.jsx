import React from "react";
import { formatCount } from "./FakeOverlay";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", tip: "Reels" },
  { id: "tiktok", label: "TikTok", tip: "For You" },
  { id: "youtube", label: "YouTube", tip: "Shorts" },
];

export function OverlayPanel({ config, onChange, enabled, onEnabled }) {
  const set = (k, v) =>
    onChange({ ...config, [k]: v });

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Fake Engagement Overlay</div>
          <div className="text-[11px] text-white/50 mt-0.5">Pixel-perfect platform UI · for creative validation</div>
        </div>
        <button
          onClick={() => onEnabled(!enabled)}
          className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-white/15"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-[22px]" : "translate-x-0.5"}`} />
        </button>
      </div>

      <div className={enabled ? "" : "opacity-40 pointer-events-none"}>
        {/* Platform picker */}
        <div className="grid grid-cols-3 gap-1.5">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => set("platform", p.id)}
              className={`rounded-lg border px-2 py-2 text-left transition-colors ${
                config.platform === p.id
                  ? "border-primary/60 bg-primary/15"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >
              <div className="text-[11px] font-semibold text-white/90">{p.label}</div>
              <div className="text-[9px] uppercase tracking-widest text-white/40">{p.tip}</div>
            </button>
          ))}
        </div>

        {/* Identity */}
        <div className="mt-4 space-y-2">
          <Field label="Handle">
            <input
              value={config.username}
              onChange={(e) => set("username", e.target.value)}
              className="w-full bg-transparent text-sm text-white/90 outline-none"
              maxLength={40}
            />
          </Field>
          <Field label="Caption">
            <input
              value={config.caption}
              onChange={(e) => set("caption", e.target.value)}
              className="w-full bg-transparent text-sm text-white/90 outline-none"
              maxLength={140}
            />
          </Field>
        </div>

        {/* Counts */}
        <div className="mt-4 space-y-2">
          <CountField label="Likes" value={config.likes} onChange={(v) => set("likes", v)} />
          <CountField label="Comments" value={config.comments} onChange={(v) => set("comments", v)} />
          <CountField label="Shares" value={config.shares} onChange={(v) => set("shares", v)} />
          {config.platform === "tiktok" && (
            <CountField label="Saves" value={config.saves} onChange={(v) => set("saves", v)} />
          )}
          {config.platform === "youtube" && (
            <CountField label="Views" value={config.views} onChange={(v) => set("views", v)} />
          )}
        </div>

        {/* Quick presets */}
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">Quick presets</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { l: "Viral", v: 1200000 },
              { l: "Hit", v: 248000 },
              { l: "Solid", v: 32400 },
              { l: "Warm", v: 8900 },
              { l: "Fresh", v: 421 },
            ].map((p) => (
              <button
                key={p.l}
                onClick={() =>
                  onChange({
                    ...config,
                    likes: p.v,
                    comments: Math.round(p.v * 0.014),
                    shares: Math.round(p.v * 0.05),
                    saves: Math.round(p.v * 0.036),
                    views: p.v * 5,
                  })
                }
                className="rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/70"
              >
                {p.l} · {formatCount(p.v)}
              </button>
            ))}
          </div>
        </div>

        {/* Stealth advice */}
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3 text-[11px] leading-relaxed text-amber-100/80">
          <div className="font-semibold text-amber-200 mb-1">Stealth tip · make it look real</div>
          Before posting, hide your real counts in the platform settings so the
          overlay doesn't overlap with native numbers:
          <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-white/60">
            {config.platform === "instagram" && (
              <>
                <li>Settings → Privacy → Posts → <span className="text-white/85">Hide Like and View Counts</span></li>
                <li>Advanced → <span className="text-white/85">Turn off commenting</span> for this reel</li>
              </>
            )}
            {config.platform === "tiktok" && (
              <>
                <li>While posting → More options → <span className="text-white/85">Comments off</span></li>
                <li>Privacy → <span className="text-white/85">Hide like count</span></li>
              </>
            )}
            {config.platform === "youtube" && (
              <>
                <li>Shorts upload → <span className="text-white/85">Don't show like count</span></li>
                <li>Comments → <span className="text-white/85">Disable comments</span></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block rounded-lg border border-white/5 bg-black/40 px-3 py-2">
      <div className="text-[9px] uppercase tracking-widest text-white/40">{label}</div>
      {children}
    </label>
  );
}

function CountField({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-white/50 w-16 shrink-0">{label}</div>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value || "0", 10)))}
        className="flex-1 min-w-0 bg-transparent text-sm text-white/90 outline-none tabular-nums"
      />
      <div className="text-xs text-white/40 tabular-nums w-12 text-right">{formatCount(value)}</div>
    </div>
  );
}
