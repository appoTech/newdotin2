// src/components/Player.jsx
import { useEffect } from "react";

export default function Player({ videoId, playerRef, onEvent, isHost }) {
  useEffect(() => {
    const loadPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        height: "390",
        width: "640",
        videoId,
        playerVars: {
          autoplay: 1, // IMPORTANT
          mute: 1, // required for autoplay on viewer devices
          controls: isHost ? 1 : 0,
          disablekb: isHost ? 0 : 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (e) => {
            // ALWAYS mute for autoplay compatibility
            e.target.mute();

            // host only: allow interactive controls
            if (isHost) e.target.unMute();
          },
          onStateChange: onEvent,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      // load IFrame API dynamically
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = loadPlayer;
    }
  }, [videoId, isHost]);

  return (
    <div className="relative w-full max-w-3xl aspect-video">
      <div id="yt-player" className="w-full h-full"></div>

      {/* Viewer overlay */}
      {!isHost && (
        <div className="absolute inset-0 bg-transparent pointer-events-auto z-10"></div>
      )}
    </div>
  );
}
