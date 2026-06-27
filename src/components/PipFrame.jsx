import React, { useState, useRef } from "react";
import Draggable from "react-draggable";

const PipIframe = ({ src }) => {
  const [minimized, setMinimized] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showUnmute, setShowUnmute] = useState(true);
  const iframeRef = useRef(null);

  if (!visible) return null;

  // force autoplay + mute + no controls
  const videoSrc = `${src}${
    src.includes("?") ? "&" : "?"
  }autoplay=1&mute=1&enablejsapi=1&controls=0&modestbranding=1&rel=0`;

  const handleUnmute = () => {
    setShowUnmute(false);

    iframeRef.current?.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "unMute",
      }),
      "*"
    );
  };

  return (
    <Draggable handle=".pip-drag-handle" cancel=".pip-btn, .pip-unmute-btn">
      <div
        className={`
    fixed 
    right-4
    top-20
    z-[9999]
    bg-black/90 shadow-xl rounded-lg overflow-hidden
    transition-all duration-200
    ${
      minimized
        ? "w-[160px] h-[100px] sm:w-[200px] sm:h-[120px]"
        : "w-[260px] h-[150px] sm:w-[360px] sm:h-[220px] md:w-[400px] md:h-[250px]"
    }
  `}
      >
        {/* Header (Drag + actions) */}
        <div className="pip-drag-handle h-8 bg-neutral-900 flex justify-end items-center px-2 gap-2 cursor-move">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized((p) => !p);
            }}
            className="pip-btn text-white text-sm hover:text-gray-300"
          >
            {minimized ? "🔼" : "🔽"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setVisible(false);
            }}
            className="pip-btn text-white text-sm hover:text-red-400"
          >
            ❌
          </button>
        </div>

        {!minimized && (
          <div className="relative w-full h-[calc(100%-32px)]">
            {/* ✅ BIG UNMUTE BUTTON */}
            {showUnmute && (
              <button
                onClick={handleUnmute}
                className="
                  pip-unmute-btn absolute
                  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  text-white text-lg font-semibold
                  px-6 py-3 rounded-full
                  bg-black/70 hover:bg-black/90
                  border border-white/40 backdrop-blur
                "
              >
                🔊 Unmute
              </button>
            )}

            {/* ✅ NO controls iframe */}
            <iframe
              ref={iframeRef}
              src={videoSrc}
              title="pip-iframe"
              className="w-full h-full border-none"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default PipIframe;
