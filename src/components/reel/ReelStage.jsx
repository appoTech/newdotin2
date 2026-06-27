import React, { useEffect, useRef, useState } from "react";

export function ReelStage(props) {
  const {
    scenes,
    theme,
    playing,
    currentTime,
    onTimeUpdate,
    fontScale,
    letterSpacing,
    lineHeight,
    glowIntensity,
    shadowIntensity,
    align,
    customBg,
    customColor,
    speed,
    onEnded,
    overlay,
  } = props;

  const rafRef = useRef(null);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    lastRef.current = performance.now();
    const total = scenes.length ? scenes[scenes.length - 1].end_time : 0;
    const tick = (now) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      const next = currentTime + dt * speed;
      if (next >= total) {
        onTimeUpdate(total);
        onEnded?.();
        return;
      }
      onTimeUpdate(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, currentTime, speed, scenes]);

  const active = scenes.find(
    (s) => currentTime >= s.start_time && currentTime < s.end_time,
  );

  const bg = customBg ?? theme.background;
  const color = customColor ?? theme.textColor;

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden rounded-[28px]"
      style={{
        background: bg,
      }}
    >
      {/* subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* progress bar */}
      <ReelProgress scenes={scenes} currentTime={currentTime} />

      <div
        className="absolute inset-0 flex"
        style={{
          alignItems: "center",
          justifyContent: align === "left" ? "flex-start" : "center",
          padding: align === "left" ? "0 8%" : "0 6%",
        }}
      >
        {active ? (
          <SceneText
            key={active.id + active.animation}
            scene={active}
            theme={theme}
            fontScale={fontScale}
            letterSpacing={letterSpacing}
            lineHeight={lineHeight}
            glowIntensity={glowIntensity}
            shadowIntensity={shadowIntensity}
            align={align}
            color={color}
          />
        ) : (
          <EmptyHint hasScenes={scenes.length > 0} />
        )}
      </div>
      {overlay}
    </div>
  );
}

function EmptyHint({ hasScenes }) {
  return (
    <div className="w-full text-center text-white/40 text-sm tracking-widest uppercase">
      {hasScenes ? "▶  Press play" : "Paste text to generate reel"}
    </div>
  );
}

function ReelProgress({
  scenes,
  currentTime,
}) {
  if (!scenes.length) return null;
  return (
    <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
      {scenes.map((s) => {
        const dur = s.end_time - s.start_time;
        const pct =
          currentTime >= s.end_time
            ? 100
            : currentTime <= s.start_time
              ? 0
              : ((currentTime - s.start_time) / dur) * 100;
        return (
          <div
            key={s.id}
            className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden"
          >
            <div
              className="h-full bg-white"
              style={{ width: `${pct}%`, transition: "width 0.08s linear" }}
            />
          </div>
        );
      })}
    </div>
  );
}

function SceneText({
  scene,
  theme,
  fontScale,
  letterSpacing,
  lineHeight,
  glowIntensity,
  shadowIntensity,
  align,
  color,
}) {
  const fontSize = scene.font_size * fontScale;
  const display =
    theme.textTransform === "uppercase" ? scene.text.toUpperCase() : scene.text;

  const shadows = [];
  if (theme.textShadow) shadows.push(theme.textShadow);
  if (glowIntensity > 0) {
    shadows.push(
      `0 0 ${10 * glowIntensity}px ${color}`,
      `0 0 ${30 * glowIntensity}px ${color}`,
    );
  }
  if (shadowIntensity > 0) {
    shadows.push(`0 ${8 * shadowIntensity}px ${20 * shadowIntensity}px rgba(0,0,0,0.5)`);
  }

  const baseStyle = {
    fontFamily: theme.fontFamily,
    fontWeight: theme.fontWeight,
    fontSize: `clamp(28px, ${fontSize / 10.8}cqw, ${fontSize}px)`,
    color,
    letterSpacing: `${letterSpacing}em`,
    lineHeight,
    textAlign: align,
    textShadow: shadows.join(", "),
    textTransform: theme.textTransform,
    maxWidth: "100%",
    wordBreak: "break-word",
    containerType: "inline-size",
  };

  return (
    <div className="w-full" style={{ containerType: "inline-size" }}>
      <AnimatedText
        text={display}
        animation={scene.animation}
        style={baseStyle}
      />
    </div>
  );
}

function AnimatedText({
  text,
  animation,
  style,
}) {
  if (animation === "letter_by_letter") {
    return (
      <div className="letter-by-letter" style={style}>
        {text.split("").map((ch, i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.035}s` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
    );
  }
  if (animation === "typewriter") {
    return <Typewriter text={text} style={style} />;
  }
  return (
    <div className={`anim-${animation}`} style={style}>
      {text}
    </div>
  );
}

function Typewriter({
  text,
  style,
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(i);
      if (i >= text.length) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [text]);
  return (
    <div className="typewriter-cursor" style={style}>
      {text.slice(0, shown)}
    </div>
  );
}
