import React from "react";

// Truncate to 100 words
const truncateWords = (text, limit = 100) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

const VideoCard = ({ rank, title, thumbnail, description }) => {
  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white p-3 rounded-xl shadow-[0_0_20px_#9D4EDD]/50 w-full gap-4 mb-3 border border-[#9D4EDD]/40 hover:shadow-[0_0_25px_#FF00A0]/70 transition-all duration-300">
      <div className="flex items-start gap-4 w-full">
        {/* Thumbnail with Rank */}
        <div className="relative w-36 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-[0_0_10px_#00F5FF]/50">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 bg-[#FF00A0]/80 text-white text-xs px-2 py-0.5 rounded-br-md font-semibold shadow-[0_0_10px_#FF00A0]">
            #{rank}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="text-lg font-semibold truncate text-[#00F5FF] drop-shadow-[0_0_8px_#00F5FF]">
            {title}
          </div>
          {description && (
            <div className="text-sm text-gray-300 mt-1 line-clamp-2">
              {truncateWords(description, 100)}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {/* Uncomment if needed */}
      {/* <div className="flex items-center justify-between gap-2">
        <button className="w-[50%] bg-[#9D4EDD] py-2 rounded-lg text-sm font-semibold hover:bg-[#FF00A0] transition-colors shadow-[0_0_10px_#9D4EDD] hover:shadow-[0_0_15px_#FF00A0]">
          Paste Content
        </button>
        <button className="w-[50%] bg-[#00F5FF] py-2 rounded-lg text-sm font-semibold text-black hover:bg-[#00D4E0] transition-colors shadow-[0_0_10px_#00F5FF] hover:shadow-[0_0_15px_#00F5FF]">
          Content Cart
        </button>
      </div> */}
    </div>
  );
};

export default VideoCard;
