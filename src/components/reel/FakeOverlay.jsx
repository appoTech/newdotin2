import React from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, ThumbsDown, Share2, RefreshCw, Music2 } from "lucide-react";

export const DEFAULT_OVERLAY = {
  platform: "instagram",
  likes: 248000,
  comments: 3421,
  shares: 12400,
  saves: 8900,
  views: 1200000,
  username: "@yourhandle",
  caption: "made with text2reel ✦",
  avatarColor: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
};

export function formatCount(n) {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (n < 1000000) return Math.round(n / 1000) + "K";
  if (n < 10000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n < 1000000000) return Math.round(n / 1000000) + "M";
  return (n / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
}

export function FakeOverlay({ config }) {
  if (config.platform === "instagram") return <InstagramOverlay c={config} />;
  if (config.platform === "tiktok") return <TikTokOverlay c={config} />;
  return <YouTubeOverlay c={config} />;
}

/* ----------------------------- INSTAGRAM ----------------------------- */
function InstagramOverlay({ c }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Right rail */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-3 sm:gap-5 text-white">
        <IgAction icon={<Heart className="h-7 w-7" strokeWidth={1.8} />} label={formatCount(c.likes)} />
        <IgAction icon={<MessageCircle className="h-7 w-7" strokeWidth={1.8} style={{ transform: "scaleX(-1)" }} />} label={formatCount(c.comments)} />
        <IgAction icon={<RefreshCw className="h-6 w-6" strokeWidth={1.8} />} label={formatCount(c.shares)} />
        <IgAction icon={<Send className="h-6 w-6 -rotate-12" strokeWidth={1.8} />} />
        <IgAction icon={<Bookmark className="h-6 w-6" strokeWidth={1.8} />} />
        <MoreHorizontal className="h-6 w-6" strokeWidth={1.8} />
        {/* spinning audio */}
        <div className="mt-1 h-7 w-7 rounded-md border border-white/40 grid place-items-center" style={{ background: c.avatarColor }}>
          <Music2 className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Bottom caption */}
      <div className="absolute left-3 right-16 bottom-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-full ring-1 ring-white/80" style={{ background: c.avatarColor }} />
          <span className="text-[13px] font-semibold drop-shadow">{c.username}</span>
          <span className="text-[11px] border border-white/70 rounded px-1.5 py-[1px] ml-1">Follow</span>
        </div>
        <div className="text-[12px] leading-snug drop-shadow line-clamp-2">{c.caption}</div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] opacity-90">
          <Music2 className="h-3 w-3" />
          <span className="truncate">Original audio · {c.username}</span>
        </div>
      </div>
    </div>
  );
}

function IgAction({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
      {icon}
      {label && <span className="text-[11px] font-semibold tabular-nums">{label}</span>}
    </div>
  );
}

/* ------------------------------ TIKTOK ------------------------------ */
function TikTokOverlay({ c }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* top tabs */}
      <div className="absolute top-2 left-0 right-0 flex justify-center gap-5 text-white text-[13px] font-semibold">
        <span className="opacity-60">Following</span>
        <span className="relative">
          For You
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-5 bg-white rounded-full" />
        </span>
      </div>

      {/* Right rail */}
      <div className="absolute right-2 bottom-20 flex flex-col items-center gap-5 text-white">
        <div className="relative">
          <div className="h-11 w-11 rounded-full ring-2 ring-white" style={{ background: c.avatarColor }} />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-[#fe2c55] grid place-items-center text-white text-sm font-bold leading-none">+</div>
        </div>
        <TtAction icon={<Heart className="h-9 w-9" fill="currentColor" />} label={formatCount(c.likes)} />
        <TtAction icon={<MessageCircle className="h-9 w-9" fill="currentColor" style={{ transform: "scaleX(-1)" }} />} label={formatCount(c.comments)} />
        <TtAction icon={<Bookmark className="h-8 w-8" fill="#facc15" stroke="#facc15" />} label={formatCount(c.saves)} />
        <TtAction icon={<Share2 className="h-8 w-8" fill="currentColor" />} label={formatCount(c.shares)} />
        {/* spinning disc */}
        <div className="mt-1 h-10 w-10 rounded-full grid place-items-center" style={{ background: "radial-gradient(circle,#444 30%,#111 31%,#111 60%,#333 61%)" }}>
          <Music2 className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Bottom caption */}
      <div className="absolute left-3 right-16 bottom-4 text-white">
        <div className="text-[14px] font-bold drop-shadow">{c.username}</div>
        <div className="text-[12px] leading-snug drop-shadow mt-1 line-clamp-2">{c.caption}</div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
          <Music2 className="h-3 w-3" />
          <span className="truncate">original sound - {c.username}</span>
        </div>
      </div>
    </div>
  );
}

function TtAction({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
      {icon}
      <span className="text-[12px] font-semibold tabular-nums">{label}</span>
    </div>
  );
}

/* --------------------------- YOUTUBE SHORTS --------------------------- */
function YouTubeOverlay({ c }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none" style={{ fontFamily: "'Roboto','Inter',system-ui,sans-serif" }}>
      {/* Right rail */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 text-white">
        <YtAction icon={<ThumbsUp className="h-6 w-6" />} label={formatCount(c.likes)} />
        <YtAction icon={<ThumbsDown className="h-6 w-6" />} label="Dislike" />
        <YtAction icon={<MessageCircle className="h-6 w-6" />} label={formatCount(c.comments)} />
        <YtAction icon={<Share2 className="h-6 w-6" />} label="Share" />
        <YtAction icon={<RefreshCw className="h-6 w-6" />} label="Remix" />
        <YtAction icon={<MoreHorizontal className="h-6 w-6" />} label="" />
        <div className="mt-1 h-9 w-9 rounded-full ring-2 ring-white" style={{ background: c.avatarColor }} />
      </div>

      {/* Bottom caption */}
      <div className="absolute left-3 right-16 bottom-4 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-7 w-7 rounded-full" style={{ background: c.avatarColor }} />
          <span className="text-[13px] font-semibold drop-shadow">{c.username}</span>
          <span className="text-[11px] bg-white text-black rounded-full px-2.5 py-[2px] ml-1 font-semibold">Subscribe</span>
        </div>
        <div className="text-[12px] leading-snug drop-shadow line-clamp-2">{c.caption}</div>
        <div className="mt-1 text-[11px] opacity-80 tabular-nums">{formatCount(c.views)} views</div>
      </div>
    </div>
  );
}

function YtAction({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
      <div className="h-11 w-11 rounded-full bg-white/15 backdrop-blur-sm grid place-items-center">{icon}</div>
      {label && <span className="text-[11px] font-medium tabular-nums">{label}</span>}
    </div>
  );
}
