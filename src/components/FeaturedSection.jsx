import React from "react";

export default function FeaturedSection() {
  const featured = [
    {
      id: 1,
      title: "Main Featured Video",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      main: true,
    },
    {
      id: 2,
      title: "Featured Video 2",
      url: "https://www.youtube.com/watch?v=abcd1234",
      thumbnail: "https://img.youtube.com/vi/abcd1234/hqdefault.jpg",
    },
    {
      id: 3,
      title: "Featured Video 3",
      url: "https://www.youtube.com/watch?v=wxyz5678",
      thumbnail: "https://img.youtube.com/vi/wxyz5678/hqdefault.jpg",
    },
    {
      id: 4,
      title: "Featured Video 4",
      url: "https://www.youtube.com/watch?v=lmno9999",
      thumbnail: "https://img.youtube.com/vi/lmno9999/hqdefault.jpg",
    },
  ];

  const mainVideo = featured.find((item) => item.main);
  const otherVideos = featured.filter((item) => !item.main);

  return (
    <section className="px-6 py-10 bg-gray-950 text-white">
      <h2 className="text-3xl font-bold mb-6">🎥 Featured on YouTube</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Featured Video */}
        <a
          href={mainVideo?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group md:col-span-2 rounded-2xl overflow-hidden shadow-lg"
        >
          <img
            src={mainVideo?.thumbnail}
            alt={mainVideo?.title}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="bg-red-600 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <h3 className="absolute bottom-3 left-3 text-xl font-semibold">
            {mainVideo?.title}
          </h3>
        </a>

        {/* Other Featured Links */}
        <div className="flex flex-col gap-4">
          {otherVideos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 rounded-xl bg-gray-900 hover:bg-gray-800 transition"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-24 h-16 rounded-lg object-cover"
              />
              <p className="font-medium">{video.title}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
