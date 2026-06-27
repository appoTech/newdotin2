// Pure deterministic parser — no AI, no semantic logic.

export const THEMES = {
  minimal: {
    id: "minimal",
    name: "Minimal",
    tagline: "White on black. Pure.",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    textColor: "#FFFFFF",
    background: "#000000",
    fontSizeBase: 110,
    animations: ["fade_in", "slide_up"],
    textTransform: "none",
  },
  luxury: {
    id: "luxury",
    name: "Luxury",
    tagline: "Gold serif. Cinematic.",
    fontFamily: "'Playfair Display', 'Times New Roman', serif",
    fontWeight: 700,
    letterSpacing: "0.01em",
    textColor: "#E9C77B",
    background:
      "radial-gradient(ellipse at center, #1a1a1a 0%, #050505 70%)",
    fontSizeBase: 120,
    animations: ["zoom_pop", "fade_in"],
    textShadow: "0 8px 40px rgba(233,199,123,0.25)",
  },
  viral: {
    id: "viral",
    name: "Viral",
    tagline: "Bold. Loud. Fast.",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    textColor: "#FFFFFF",
    background:
      "linear-gradient(135deg, #ff2e63 0%, #08d9d6 100%)",
    fontSizeBase: 150,
    animations: ["bounce", "zoom_pop", "shake"],
    textTransform: "uppercase",
    textShadow: "0 6px 0 rgba(0,0,0,0.35)",
  },
  hacker: {
    id: "hacker",
    name: "Hacker",
    tagline: "Terminal. Typewriter.",
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontWeight: 500,
    letterSpacing: "0em",
    textColor: "#00FF88",
    background:
      "radial-gradient(ellipse at top, #001a0d 0%, #000 80%)",
    fontSizeBase: 88,
    animations: ["typewriter", "glitch"],
    textShadow: "0 0 12px rgba(0,255,136,0.55)",
    align: "left",
  },
  creator: {
    id: "creator",
    name: "Creator",
    tagline: "Neon. Gradient. Glow.",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    textColor: "#FFFFFF",
    background:
      "linear-gradient(135deg, #6a00f4 0%, #ff006e 50%, #ffbe0b 100%)",
    fontSizeBase: 130,
    animations: ["letter_by_letter", "slide_up", "zoom_pop", "pulse"],
    textShadow:
      "0 0 18px rgba(255,255,255,0.5), 0 0 40px rgba(255,0,110,0.6)",
  },
};

export const DEFAULT_PARSE = {
  wordsPerChunkMin: 2,
  wordsPerChunkMax: 5,
  wordDuration: 0.35,
  minFrame: 1,
  maxFrame: 4,
  punctuationPause: 0.4,
};

// Deterministic id
let idCounter = 0;
const nextId = () => `s_${++idCounter}_${Date.now().toString(36)}`;

// Splits text into chunks of N words, respecting punctuation and line breaks.
export function parseText(input, opts) {
  idCounter = 0;
  const lines = input
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Split each line on sentence-ending punctuation, but keep punctuation
  const segments = [];
  for (const line of lines) {
    // Split on , . ! ? ; : while keeping the delimiter
    const parts = line.split(/([.!?,;:])/);
    let buffer = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      if (/^[.!?,;:]$/.test(part)) {
        buffer += part;
        if (buffer.trim()) {
          segments.push({
            text: buffer.trim(),
            endsWithPunct: /[.!?]/.test(part),
          });
        }
        buffer = "";
      } else {
        buffer += part;
      }
    }
    if (buffer.trim()) {
      segments.push({ text: buffer.trim(), endsWithPunct: true });
    }
  }

  // Now chunk each segment into 2-5 word groups (deterministic round-robin)
  const scenes = [];
  let t = 0;
  let animIdx = 0;
  const animations = opts.theme.animations;

  for (const seg of segments) {
    const words = seg.text.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;

    // Strip trailing punctuation off last word for the display chunk grouping,
    // but keep it visible.
    let i = 0;
    while (i < words.length) {
      // Deterministic chunk size: cycle min..max based on remaining
      const remaining = words.length - i;
      let chunkSize = opts.wordsPerChunkMax;
      if (remaining <= opts.wordsPerChunkMax) {
        chunkSize = remaining;
      } else {
        // Choose size so leftover isn't tiny: prefer max, fallback to min
        const leftoverIfMax = remaining - opts.wordsPerChunkMax;
        if (leftoverIfMax > 0 && leftoverIfMax < opts.wordsPerChunkMin) {
          chunkSize = Math.max(
            opts.wordsPerChunkMin,
            opts.wordsPerChunkMax - 1,
          );
        }
      }
      const chunkWords = words.slice(i, i + chunkSize);
      i += chunkSize;

      const chunkText = chunkWords.join(" ");
      const rawDuration = chunkWords.length * opts.wordDuration;
      const duration = Math.max(
        opts.minFrame,
        Math.min(opts.maxFrame, rawDuration),
      );

      const isLastInSegment = i >= words.length;
      const pause = isLastInSegment && seg.endsWithPunct
        ? opts.punctuationPause
        : 0;

      const animation = animations[animIdx % animations.length];
      animIdx++;

      scenes.push({
        id: nextId(),
        text: chunkText,
        start_time: round2(t),
        end_time: round2(t + duration),
        animation,
        font_size: opts.theme.fontSizeBase,
        text_color: opts.theme.textColor,
        background_type: opts.theme.background,
      });
      t += duration + pause;
    }
  }

  return scenes;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function totalDuration(scenes) {
  if (scenes.length === 0) return 0;
  return scenes[scenes.length - 1].end_time;
}
