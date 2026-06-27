import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import LoadingScreen from "./Loader";
import siren from "../assets/Siren.gif";
import fireworks from "../assets/Fireworks.gif";

const PagerElement = ({ pagermsg, pageSlug, creatorName }) => {
  const [current, setCurrent] = useState(0);
  const [msg, setmsg] = useState([]);
  const [theme, setTheme] = useState("default");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (msg.length === 0) return;

    if (msg[current]?.source === "donate") {
      setTheme("golden");
    } else if (msg[current]?.source === "sos") {
      setTheme("alert");
    } else {
      setTheme("default");
    }

    const interval = setInterval(
      () => {
        setCurrent((prev) => (prev === msg.length - 1 ? 0 : prev + 1));
      },
      msg[current]?.source === "donate"
        ? 7000
        : msg[current]?.source === "sos"
        ? 5000
        : 3000
    );

    return () => clearInterval(interval);
  }, [msg, current]);

  useEffect(() => {
    if (Array.isArray(pagermsg) && pagermsg.length > 0) {
      setmsg(pagermsg.slice(0, 18));
    } else {
      setmsg([
        {
          text: "Feel Free to Break the Minternet with your Words",
          source: "chat",
        },
      ]);
    }
  }, [pagermsg]);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? msg.length - 1 : prev - 1));
  const next = () =>
    setCurrent((prev) => (prev === msg.length - 1 ? 0 : prev + 1));

  const openPopup = (state, type) => {
    console.log("Type is : ", type);
    const link = encodeURIComponent(window.location.href);
    window.location.href = `/express/pager?link=${link}&type=${type}&slug=${pageSlug || ""}&creator=${creatorName ? encodeURIComponent(creatorName) : ""}`;
  };

  return (
    <div
      className={`flex flex-row w-full justify-center gap-1 items-center transition-all duration-500 bg-transparent`}
    >
      <LoadingScreen isLoading={loading} />
      <div className="w-full max-w-4xl flex flex-col">
        
        <div
          className={`relative w-full flex flex-col items-center p-2 rounded-2xl shadow-xl transition-all duration-500 ${
            msg[current]?.source === "donate"
              ? "bg-yellow-900 border-yellow-400"
              : msg[current]?.source === "sos"
              ? "bg-red-900 border-red-500"
              : "bg-gray-900 border-green-400"
          } border-2`}
        >
          <div className="text-gray-400 font-mono text-sm w-full text-center mb-1 drop-shadow-md">
          ~{msg[current]?.creatorName || creatorName || "Unknown"}
        </div>
          {msg[current]?.source === "donate" && (
            <img
              src={fireworks}
              alt="Fireworks Celebration"
              className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
            />
          )}

          {msg[current]?.source === "sos" && (
            <img
              src={siren}
              alt="Siren Alert"
              className="absolute top-2 left-2 w-10 h-10 animate-pulse z-[9999]"
            />
          )}
          {msg[current]?.source === "donate" && (
            <div className="w-full text-center text-yellow-300 font-bold font-mono text-sm md:text-lg mb-2">
              ⭐ {msg[current]?.name} ⭐ donated ₹{msg[current]?.amount}
            </div>
          )}

          <div className="relative w-full flex flex-col items-center overflow-visible">
            {/* Message Text Box */}
            <div
              className={`relative w-full rounded-xl text-md md:text-lg font-mono font-bold tracking-wide text-center transition-all duration-500 ease-in-out shadow-inner p-3 border-2 ${
                msg[current]?.source === "donate"
                  ? "border-yellow-400 text-yellow-300 bg-yellow-950"
                  : msg[current]?.source === "sos"
                  ? "border-red-500 text-red-300 bg-black"
                  : "border-green-400 text-green-400 bg-black"
              } ${
                expanded ? "max-h-60 overflow-y-auto" : "h-20 overflow-hidden"
              }`}
              style={{ zIndex: 20 }}
            >
              <div className={`${expanded ? "" : "line-clamp-2"}`}>
                {msg[current]?.text || msg[current]}
              </div>

              {/* Subtle gradient fade at bottom when collapsed */}
              {!expanded && msg[current]?.text?.length > 80 && (
                <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none rounded-b-xl"></div>
              )}
            </div>

            <div className="flex items-center justify-between w-full">
              <button
                onClick={prev}
                className={`p-2 rounded-md border transition-colors duration-300 ${
                  msg[current]?.source === "donate"
                    ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    : msg[current]?.source === "sos"
                    ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                    : "border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                }`}
              >
                <ChevronLeft size={12} />
              </button>

              {/* Centered Expand/Collapse Button */}
              {msg[current]?.text?.length > 40 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className={`mt-2 px-1 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shadow-md ${
                    msg[current]?.source === "donate"
                      ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-300"
                      : msg[current]?.source === "sos"
                      ? "bg-red-500 text-white hover:bg-red-400"
                      : "bg-green-400 text-black hover:bg-green-300"
                  }`}
                  title={expanded ? "Collapse message" : "Expand message"}
                  style={{ zIndex: 50 }}
                >
                  {expanded ? (
                    <>
                      <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                    </>
                  )}
                </button>
              )}

              <button
                onClick={next}
                className={`p-2 rounded-md border transition-colors duration-300 ${
                  msg[current]?.source === "donate"
                    ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    : msg[current]?.source === "sos"
                    ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                    : "border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                }`}
              >
                <ChevronRight size={12} />
              </button>
            </div>

            {/* New Connect and Reply buttons */}
            <div className="flex flex-row gap-4 justify-center w-full mt-3 mb-1">
              <button
                onClick={() => {
                  const targetSlug = msg[current]?.pageSlug || pageSlug;
                  if (targetSlug) {
                    window.location.href = `/yt/${targetSlug}`;
                  }
                }}
                className={`px-4 py-1 rounded-md border text-sm font-mono font-bold tracking-wide transition-colors duration-300 ${
                  msg[current]?.source === "donate"
                    ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    : msg[current]?.source === "sos"
                    ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                    : "border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                }`}
              >
                Connect
              </button>
              <button
                onClick={() => openPopup(true, "reply")}
                className={`px-4 py-1 rounded-md border text-sm font-mono font-bold tracking-wide transition-colors duration-300 ${
                  msg[current]?.source === "donate"
                    ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    : msg[current]?.source === "sos"
                    ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
                    : "border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                }`}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => openPopup(true, "chat")}
          className="px-1 rounded-md bg-green-500 text-black text-sm font-mono font-bold tracking-wide shadow-lg active:translate-y-0.5 border-2 border-green-700 hover:bg-green-400 transition-colors duration-200 py-1"
        >
          LEADS
        </button>
        <button
          onClick={() => openPopup(true, "donate")}
          className="rounded-md bg-yellow-500 text-black text-sm font-mono font-bold tracking-wide shadow-lg active:translate-y-0.5 border-2 border-yellow-700 hover:bg-yellow-400 transition-colors duration-200 leading-4 py-2"
        >
          ROAST
          {/* <span className="text-lg">$</span>uper Chat */}
        </button>
        <button
          onClick={() => openPopup(true, "sos")}
          className="px-1 rounded-md bg-red-500 text-black text-sm font-mono font-bold tracking-wide shadow-lg active:translate-y-0.5 border-2 border-red-700 hover:bg-red-400 transition-colors duration-200 leading-4 py-2"
        >
          Don8
        </button>
      </div>
    </div>
  );
};

export default PagerElement;
