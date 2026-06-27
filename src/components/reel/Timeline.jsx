import React from "react";

export function Timeline({
  scenes,
  currentTime,
  onSeek,
  onReorder,
  onUpdate,
  onDelete,
}) {
  const total = scenes.length ? scenes[scenes.length - 1].end_time : 0;

  return (
    <div className="glass-panel rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
          Timeline · {scenes.length} scenes · {total.toFixed(2)}s
        </div>
        <div className="text-xs text-white/40 tabular-nums">
          {currentTime.toFixed(2)}s / {total.toFixed(2)}s
        </div>
      </div>

      {/* Visual timeline scrubber */}
      <div
        className="relative h-10 rounded-lg bg-black/40 overflow-hidden cursor-pointer border border-white/5"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - r.left) / r.width;
          onSeek(Math.max(0, Math.min(total, pct * total)));
        }}
      >
        {scenes.map((s) => {
          const left = (s.start_time / total) * 100;
          const width = ((s.end_time - s.start_time) / total) * 100;
          return (
            <div
              key={s.id}
              className="absolute top-0 bottom-0 border-r border-black/40 bg-gradient-to-b from-primary/30 to-primary/10 hover:from-primary/50 transition-colors"
              style={{ left: `${left}%`, width: `${width}%` }}
              title={s.text}
            />
          );
        })}
        <div
          className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_8px_white]"
          style={{ left: `${(currentTime / Math.max(total, 0.001)) * 100}%` }}
        />
      </div>

      {/* Scene blocks */}
      <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
        {scenes.map((s, idx) => (
          <SceneRow
            key={s.id}
            scene={s}
            index={idx}
            isActive={currentTime >= s.start_time && currentTime < s.end_time}
            onSeek={() => onSeek(s.start_time)}
            onMoveUp={idx > 0 ? () => onReorder(idx, idx - 1) : undefined}
            onMoveDown={
              idx < scenes.length - 1 ? () => onReorder(idx, idx + 1) : undefined
            }
            onUpdate={(patch) => onUpdate(s.id, patch)}
            onDelete={() => onDelete(s.id)}
          />
        ))}
        {scenes.length === 0 && (
          <div className="py-8 text-center text-xs text-white/30 uppercase tracking-widest">
            No scenes yet
          </div>
        )}
      </div>
    </div>
  );
}

function SceneRow({
  scene,
  index,
  isActive,
  onSeek,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onDelete,
}) {
  const dur = (scene.end_time - scene.start_time).toFixed(2);
  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors ${
        isActive
          ? "border-primary/60 bg-primary/10"
          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
        <button
          onClick={onSeek}
          className="text-white/30 hover:text-white tabular-nums w-8 text-left"
        >
          {String(index + 1).padStart(2, "0")}
        </button>
        <input
          value={scene.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="flex-1 bg-transparent outline-none text-white/90 truncate"
        />
      </div>
      
      <div className="flex items-center gap-2 justify-between sm:justify-start w-full sm:w-auto shrink-0">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            step={0.1}
            value={dur}
            onChange={(e) => {
              const d = Math.max(0.2, parseFloat(e.target.value) || 1);
              onUpdate({ end_time: scene.start_time + d });
            }}
            className="w-12 bg-black/40 border border-white/5 rounded px-1.5 py-0.5 text-white/70 tabular-nums text-right"
          />
          <span className="text-white/30">s</span>
        </div>
        
        <select
          value={scene.animation}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="bg-black/40 border border-white/5 rounded px-1.5 py-0.5 text-white/70"
        >
          {[
            "fade_in","slide_left","slide_up","zoom_pop","letter_by_letter",
            "bounce","typewriter","shake","glitch","pulse",
          ].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        
        <div className="flex opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <IconBtn disabled={!onMoveUp} onClick={onMoveUp} label="↑" />
          <IconBtn disabled={!onMoveDown} onClick={onMoveDown} label="↓" />
          <IconBtn onClick={onDelete} label="×" />
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  onClick,
  label,
  disabled,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-6 h-6 grid place-items-center text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}
