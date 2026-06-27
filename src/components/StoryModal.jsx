import React, { useEffect, useState } from "react";
import InstaStoryYT from "./InstaStory";
import { use } from "react";

const StoryModal = ({ isOpen, onClose, title, thumbnail, shortId,link }) => {
  const [title1, settitle] = useState();
  const [thumbnail1, setthumbnail] = useState();
  useEffect(() => {
    if (title || thumbnail){
      return;
    }
    else{
      try {
        const fetchMetadata = async () => {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}yt/preview/${shortId}`
          );
          const data = await response.json();
          settitle(data.title || "🔥 AppOpener.com");
          setthumbnail(data.thumbnail);
        };
        fetchMetadata();
      }
      catch (error) {
        console.error("Error fetching video metadata:", error);
      }
    }
  }, [shortId, link]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-4 w-[400px] md:w-[800px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Super Story</h2>
          <button
            onClick={() => onClose()}
            className="text-gray-500 font-semibold text-xl hover:text-black"
          >
            X
          </button>
        </div>
        <InstaStoryYT videoId={shortId} thumbnail={thumbnail ? thumbnail : thumbnail1} headline={title ? title : title1} url={link} />
        <a
          href={`/visualShop/${shortId}`}
          className="flex items-center w-auto justify-center no-underline"
        >
          <button className="text-center p-2 text-black b-1 border-gray-300 bg-gray-300 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-300">
            VisualShop
          </button>
        </a>
      </div>
    </div>
  );
};

export default StoryModal;
