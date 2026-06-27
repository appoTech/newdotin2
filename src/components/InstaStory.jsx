import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Camera, Link2, Play } from "lucide-react";
import logo from "../assets/spawnsers2.png";
import { addStory } from "../helper/api";

const InstaStoryYT = ({
  download = true,
  videoId,
  thumbnail,
  url,
  headline = "New Video Just Dropped! 🚀",
}) => {
  const storyRef = useRef(null);
  const storyRefwithQR = useRef(null);
  const [thumbUrl, setThumbUrl] = useState("");

  useEffect(() => {
    if (thumbnail) {
      setThumbUrl(thumbnail);
    }
  }, [thumbnail]);

  const handleDownloadAndOpenStory = async () => {
    if (!storyRef.current) return;

    try {
      const dataUrl = await toPng(storyRef.current);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `insta_story_${videoId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // const blob = await (await fetch(dataUrl)).blob();
      // const file = new File([blob], `insta_story_${videoId}.png`, {
      //   type: "image/png",
      // });

      // const formData = new FormData();
      // formData.append("story", file);
      // formData.append("videoId", videoId);
      // try {
      //   const res = await fetch(
      //     `${process.env.REACT_APP_API_URL}upload-story`,
      //     {
      //       method: "POST",
      //       body: formData,
      //     }
      //   );

      //   const result = await res.json();
      //   if (result.success) {
      //     console.log("✅ Uploaded to MinIO:", result.url);
      //     try {
      //       let res = await addStory(videoId, result.url);
      //       if (res.status === 200) {
      //         console.log("Story added successfully");
      //       } else {
      //         console.error("Failed to add story", res);
      //       }
      //     } catch (error) {
      //       console.error("Error adding story:", error);
      //     }
      //   } else {
      //     console.error("❌ Upload failed:", result.error);
      //   }
      // } catch (err) {
      //   console.error("Error uploading to MinIO:", err);
      // }
      setTimeout(() => {
        const ua = navigator.userAgent.toLowerCase();
        if (/android/.test(ua) || /iphone|ipad|ipod/.test(ua)) {
          window.location.href = "instagram://story-camera";
        } else {
          alert("Please upload the downloaded image to Instagram Stories.");
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to process story", error);
    }
  };

  // const handleDownloadQR = async () => {
  //   if (!storyRefwithQR.current) return;
  //   try {
  //     const dataUrl = await toPng(storyRefwithQR.current);
  //     const link = document.createElement("a");
  //     link.download = `insta_story_${videoId}withQR.png`;
  //     link.href = dataUrl;
  //     link.click();
  //   } catch (error) {
  //     console.error("Failed to download image", error);
  //   }
  // };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-6 p-2 flex-wrap">
      {/* Original Story */}
      <div className="flex flex-col items-center w-full sm:w-auto">
        <div
          style={{
            backgroundSize: "150% 155%",
            backgroundPosition: "center",
            backgroundImage: `url(${logo})`,
          }}
          ref={storyRef}
          className="relative w-full max-w-[250px] aspect-[9/16] overflow-hidden rounded-2xl shadow-xl border-1 border-black bg-black text-white flex flex-col justify-center items-center"
        >
          {thumbUrl && (
            <img
              crossOrigin="anonymous"
              src={thumbUrl}
              alt="Thumbnail"
              className="w-full bject-cover"
            />
          )}

          <div className="relative z-10 p-4 text-center">
            <div className="text-base font-bold drop-shadow-lg text-white line-clamp-2">
              {headline.length > 40
                ? headline.substring(0, 40) + "..."
                : headline}
            </div>

            <div className="flex justify-center items-center mt-4 bg-white text-black rounded-md px-3 py-1 text-sm font-medium shadow">
              <Play size={18} className="mr-1" /> Paste Here
            </div>

            <div className="absolute -bottom-2 left-0 right-0 text-center text-xs md:text-sm font-semibold text-white">
              Spawnsered by Spawnsers
            </div>
          </div>
        </div>

        {download && (
          <button
            onClick={handleDownloadAndOpenStory}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow text-sm sm:text-base"
          >
            Add to Story
          </button>
        )}
      </div>

      {/* Story with QR */}
      {/* <div className="flex flex-col items-center space-y-4 w-full sm:w-auto">
        <div
          style={{
            backgroundSize: "150% 155%",
            backgroundPosition: "center",
            backgroundImage: `url(${logo})`,
          }}
          ref={storyRefwithQR}
          className="relative w-full sm:max-w-[300px] aspect-[9/16] overflow-hidden rounded-2xl border border-gray-300 bg-black text-white flex flex-col justify-center items-center"
        >
          <div className="z-10 flex justify-center items-center bg-white text-black rounded-md px-4 py-10 text-xs font-medium shadow mb-2 mt-2">
            <Camera size={18} className="mr-2" /> Add QR Here
          </div>

          {thumbUrl && (
            <img
              crossOrigin="anonymous"
              src={thumbUrl}
              alt="Thumbnail"
              className="w-full bject-cover"
            />
          )}

          <div className="relative z-10 p-4 text-center">
            <div className="text-base sm:text-lg md:text-xl font-bold drop-shadow-lg text-white">
              {headline}
            </div>

            <div className="flex justify-center items-center mt-4 bg-white text-black rounded-md px-3 py-1 text-sm font-medium">
              <Link2 size={18} className="mr-1" /> Add Link Here
            </div>

            <div className="absolute -bottom-2 left-0 right-0 text-center text-xs md:text-sm font-semibold text-white">
              Spawnsered by Spawnsers
            </div>
          </div>
        </div>

        {download && (
          <button
            onClick={handleDownloadQR}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow text-sm sm:text-base"
          >
            Download Story
          </button>
        )}
      </div> */}
    </div>
  );
};

export default InstaStoryYT;
