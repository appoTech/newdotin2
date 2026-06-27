import React, { useEffect } from "react";
import { Instagram } from "lucide-react";
import InstaStoryYT from "../components/InstaStory";

const VisualShop = (props) => {
  const videoId = props.match.params.id || "dQw4w9WgXcQ"; // Fallback video ID
  const [title, setTitle] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");
  const [error, setError] = React.useState("");
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}yt/preview/${videoId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch preview");
        }

        const { title, description, thumbnail } = await response.json();
        setTitle(title);
        setThumbnail(thumbnail);
        console.log("Preview fetched successfully:", {
          title,
          description,
          thumbnail,
        });
      } catch (error) {
        console.error("Error fetching preview:", error);
        setError(error.message);
      }
    };

    if (videoId) {
      fetchPreview();
    }
  }, [videoId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 ml-6 flex justify-center items-center">
          Photo Shop
        </h1>
        {error && <p className="font-semibold text-lg">{error}</p>}
        <InstaStoryYT
          videoId={videoId}
          thumbnail={thumbnail}
          headline={title}
        />

        {/* Main Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Caption and Hashtags */}
          <div className="bg-blue-500 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Caption and Hashtags</h2>
            <div className="flex justify-center items-center mb-4">
              <Instagram className="w-16 h-16 text-pink-300" />
            </div>
            <div className="text-sm space-x-2 text-pink-200 mb-4">
              <span>#trendingnow</span>
              <span>#viral</span>
              <span>#seo</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-black py-2 rounded text-white">
                + Create Caption
              </button>
              <button className="flex-1 bg-black py-2 rounded text-white">
                # Generate Hashtags
              </button>
            </div>
          </div>

          {/* Storytelling */}
          <div className="bg-yellow-400 rounded-xl p-6 shadow-lg text-black">
            <h2 className="text-xl font-semibold mb-4">Storytelling</h2>
            <div className="flex justify-center items-center mb-4">
              <div className="bg-black text-white px-4 py-2 rounded">
                Generating
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-black py-2 rounded text-white">
                ⦿ SEO Stories
              </button>
              <button className="flex-1 bg-black py-2 rounded text-white">
                📈 Boost Engagement
              </button>
            </div>
          </div>
        </div>

        {/* Quick Starts */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick starts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Image to Video", tag: "New" },
              { title: "Choose a Style" },
              { title: "Explore Models" },
              { title: "Train Model" },
              { title: "Ultimate Upscale" },
              { title: "Image to Prompt" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-800 p-4 rounded-xl shadow hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span>{item.title}</span>
                  {item.tag && (
                    <span className="bg-green-500 text-xs px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisualShop;
