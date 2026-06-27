import { useState, useEffect, useRef } from "react";
import { RotateCwSquare , RotateCcwSquare , VolumeOff } from "lucide-react";
const getUserAgent = () => {
  let agent = navigator.userAgent.toLowerCase();
  if (agent.includes("android")) return "android";
  if (agent.includes("iphone")) return "ios";
  return "desktop";
};

const VideoFrame = ({
  videoId,
  showControls,
  iframeRef,
  buttonText,
  setButtonText,
  setState,
  setShowControls,
  onOpenShareTray,
}) => {
  const [userAgent, setUserAgent] = useState("");
  const [landscapeText, setLandscapeText] = useState("");
  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isCalibrated, setIsCalibrated] = useState(false);

  useEffect(() => {
    if (buttonText !== "Theatre Mode") {
      setIsCalibrated(false);
    }
  }, [buttonText]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          loop: 1,
          playlist: videoId,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    };
  }, [videoId]);

  const handleUnmute = () => {
    if (playerRef.current) {
      playerRef.current.unMute();
      setIsMuted(false);
    }
  };

  useEffect(() => {
    const ua = getUserAgent();
    setUserAgent(ua);
    if (buttonText.toLowerCase() === "theatre mode") {
      setShowControls(true);
    }
    const getLandscapeDetails = () => {
      //remove window.open from every where to get back to theatre mode functionality 

      // if (buttonText === "Theatre Mode") {
      //   window.open("https://loginskip.com")
      // }
      if (buttonText === "Theatre Mode" && ua !== "desktop") {
        // window.open("https://loginskip.com")
        return "&playsinline=1&orientation=landscape";
      }
      
      return "";
    };
    setLandscapeText(getLandscapeDetails());
  }, [buttonText]);

  const getFrameClasses = () => {
    if (buttonText === "Theatre Mode") {
      // window.open("https://loginskip.com")
      // if (userAgent === "desktop") {
      //   return `w-[90vw] aspect-video  object-contain  transition-transform duration-500 ease-out rounded-xl`;
      // } else {
      //   return `w-[100vh] h-[100vw] rotate-90 object-cover transition-transform duration-500 ease-out rounded-xl`;
      // }
    }
    return `w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500 ease-out rounded-xl`;
  };

  const getDivClasses = () => {
    if (buttonText === "Share Mode")       onOpenShareTray?.("true");
    if (buttonText === "Theatre Mode") {
      return `fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-[9999] border border-[#9D4EDD] rounded-t-xl overflow-hidden`;
    }
    return "relative overflow-hidden bg-black rounded-t-xl border border-[#9D4EDD]";
  };

  const handleExitTheatre = () => {
    setShowControls(false);
    setButtonText("MAIN SCREEN");
  };

  const getButtonClasses = () => {
    if (buttonText === "Theatre Mode") {
      return `absolute top-4 left-4 z-10 bg-[#FF00A0] hover:bg-[#9D4EDD] p-2 rounded-full shadow-[0_0_20px_#FF00A0] transition-all hover:scale-110`;
    }
    return "hidden";
  };

  return (
    <div className={getDivClasses()}>
      <button
        className={getButtonClasses()}
        onClick={handleExitTheatre}
        style={{
          position: "absolute",
          pointerEvents: "auto",
          zIndex: 10000,
        }}
      >
        X
      </button>

      {buttonText === "Theatre Mode" && userAgent !== "desktop" && !isCalibrated && (
        <button
          className="flex items-center gap-1 absolute bottom-10 left-1/2 -translate-x-1/2 z-[10000] bg-[#FF00A0] hover:bg-[#9D4EDD] px-4 py-2 text-white font-bold shadow-[0_0_20px_#FF00A0] transition-all hover:scale-105"
          onClick={() => setIsCalibrated(true)}
        >
        <RotateCwSquare />  Calibrate Screen <RotateCcwSquare />
        </button>
      )}

      <div
        className={`flex items-center justify-center ${
          buttonText === "Theatre Mode" && userAgent !== "desktop" && !isCalibrated
            ? "rotate-90 w-[100vh] h-[100vw]"
            : "w-full aspect-video"
        }`}
        style={{
          transformOrigin: "center center",
          overflow: "hidden",
        }}
      >
        <div id="yt-player" className="w-full h-full"></div>
      </div>

      {isMuted && (
        <button
          onClick={handleUnmute}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                 flex items-center justify-center bg-black/50 rounded-full
                 p-6 transition-all duration-500 hover:scale-110"
          style={{ zIndex: 10 }}
        >
          <VolumeOff size={80} className="text-white" />
        </button>
      )}
    </div>
  );
};

export default VideoFrame;
