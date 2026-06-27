import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Minus, Volume2 } from "lucide-react";

const PipIframe = ({ src }) => {
  const [minimized, setMinimized] = useState(true);
  const [visible, setVisible] = useState(true);
  const [showUnmute, setShowUnmute] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);

  // Track window dimensions in real-time for responsive drag boundaries
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!visible) return null;

  // Convert Shorts or watch URLs → embed URL
  const toEmbedUrl = (url) => {
    try {
      if (url.includes("instagram.com/reel/")) {
        const cleanUrl = url.split("?")[0];
        const baseUrl = cleanUrl.endsWith("/") ? cleanUrl : `${cleanUrl}/`;
        return `${baseUrl}embed/`;
      }
      if (url.includes("youtube.com/shorts/")) {
        const id = url.split("shorts/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const isDirectVideo =
    src.endsWith(".mp4") ||
    src.includes(".mp4?") ||
    src.endsWith(".webm") ||
    src.includes(".webm?") ||
    src.endsWith(".ogg") ||
    src.includes(".ogg?");

  const isInstagram = src.includes("instagram.com");
  const embedSrc = toEmbedUrl(src);
  const videoSrc = isInstagram
    ? embedSrc
    : `${embedSrc}${
        embedSrc.includes("?") ? "&" : "?"
      }autoplay=1&mute=1&enablejsapi=1&controls=0&modestbranding=1&rel=0`;

  const handleUnmute = (e) => {
    e.stopPropagation();
    setShowUnmute(false);
    setIsMuted(false);
    if (!isDirectVideo) {
      iframeRef.current?.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "unMute",
        }),
        "*"
      );
    }
  };

  // Determine current card size to calculate drag constraints dynamically
  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 768;
  const cardWidth = isMobile ? 155 : isTablet ? 190 : 220;
  const cardHeight = isMobile ? 250 : isTablet ? 305 : 350;
  const iconSize = isMobile ? 9 : 11;

  // snappy transition parameters (Instagram snap effect)
  const springTransition = {
    type: "spring",
    stiffness: 450,
    damping: 30,
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={{
        left: -windowSize.width + (minimized ? 80 : cardWidth + 30),
        right: 20,
        top: -windowSize.height + (minimized ? 100 : cardHeight + 35),
        bottom: 20,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{
        opacity: 1,
        scale: minimized ? 0.55 : 1,
        x: minimized ? "65%" : "0%",
        y: minimized ? "15%" : "0%",
        rotate: minimized ? -8 : 0,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={springTransition}
      onClick={() => {
        if (minimized) {
          setMinimized(false);
        }
      }}
      className={`
        fixed
        right-4
        bottom-4
        sm:right-6
        sm:bottom-6
        z-[9999]
        select-none
        w-[155px] h-[250px]
        sm:w-[190px] sm:h-[305px]
        md:w-[220px] md:h-[350px]
        ${minimized ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}
      `}
      style={{
        touchAction: "none",
      }}
    >
      {/* ── CARD STACK CONTAINER ── */}
      <div className="relative w-full h-full">
        {/* 1. BACKGROUND CARD (Ace of Clubs) */}
        <div
          className="absolute inset-0 bg-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] border border-black/5 flex flex-col justify-between p-2 sm:p-3 select-none pointer-events-none"
          style={{
            transform: "rotate(-12deg) translate(-10px, -6px) sm:translate(-14px, -8px)",
            boxShadow: "-6px 6px 18px rgba(0, 0, 0, 0.1), sm:-8px 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* Top-Left Suit & A */}
          <div className="flex flex-col items-center text-neutral-800 leading-none">
            <span className="font-sans font-extrabold text-lg sm:text-[22px] tracking-tighter">A</span>
            <span className="text-base sm:text-[20px] mt-0.5 leading-none">♣</span>
          </div>
        </div>

        {/* 2. FOREGROUND CARD (Ace of Diamonds) */}
        <div
          className="relative w-full h-full bg-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] border border-black/5 p-2 sm:p-3 flex flex-col items-center justify-between"
          style={{
            transform: "rotate(3deg)",
            boxShadow: "8px 12px 25px rgba(0, 0, 0, 0.12), sm:10px 15px 35px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Corner Decorations */}
          {/* Top-Left Red Suit & A */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-col items-center text-red-600 leading-none">
            <span className="font-sans font-extrabold text-lg sm:text-[22px] tracking-tighter">Å</span>
            <span className="text-base sm:text-[20px] mt-0.5 leading-none">♦</span>
          </div>

          {/* Bottom-Right Red Suit & A (Inverted) */}
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 flex flex-col items-center text-red-600 leading-none rotate-180">
            <span className="font-sans font-extrabold text-lg sm:text-[22px] tracking-tighter">Å</span>
            <span className="text-base sm:text-[20px] mt-0.5 leading-none">♦</span>
          </div>

          {/* Sleek minimalist Hover Controls */}
          {!minimized && (
            <div 
              className="absolute top-2 right-2 sm:top-3 sm:right-4 flex gap-1 sm:gap-1.5 z-50 pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()} // prevent dragging on control click
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(true);
                }}
                className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full bg-neutral-100/80 hover:bg-neutral-200 text-neutral-600 active:scale-95 transition-all duration-150"
              >
                <Minus size={iconSize} strokeWidth={2.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setVisible(false);
                }}
                className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full bg-neutral-100/80 hover:bg-red-500 hover:text-white text-neutral-600 active:scale-95 transition-all duration-150"
              >
                <X size={iconSize} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Central Black Play Screen */}
          <div 
            className="w-full flex-1 bg-[#09090b] rounded-[12px] sm:rounded-[18px] overflow-hidden relative border border-black/5 mt-9 mb-9 sm:mt-11 sm:mb-11 flex flex-col items-center justify-center"
            style={{
              boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.4)",
            }}
            onPointerDown={(e) => e.stopPropagation()} // prevent dragging on iframe interactions
          >
            {/* Unmute Overlay */}
            {showUnmute && !minimized && !isInstagram && (
              <button
                onClick={handleUnmute}
                className="
                  absolute z-30
                  flex items-center gap-1.5 sm:gap-2
                  text-[10px] sm:text-xs font-bold
                  px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                  bg-black/80 hover:bg-black hover:scale-105 active:scale-95
                  border border-white/20 shadow-lg backdrop-blur-md
                  transition-all duration-200
                  text-white
                "
              >
                <Volume2 size={11} className="animate-bounce" />
                Unmute
              </button>
            )}

            {/* Video embed iframe or direct HTML5 video player */}
            {isDirectVideo ? (
              <video
                src={src}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover pointer-events-auto"
              />
            ) : (
              <iframe
                ref={iframeRef}
                src={videoSrc}
                title="pip-iframe"
                className="w-full h-full border-none pointer-events-auto"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PipIframe;
