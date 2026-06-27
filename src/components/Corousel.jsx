import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import logo from "../assets/favicon.ico";
import story1 from "../assets/story1.jpeg";
import story2 from "../assets/story2.jpeg";
import story3 from "../assets/story3.jpeg";

export default function StoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stories] = useState([
    { id: 1, thumbnail: story1 },
    { id: 2, thumbnail: story3 },
    { id: 3, thumbnail: story2 },
  ]);

  const timerRef = useRef(null);

  // handle progress animation
  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    setProgress(0);
    clearInterval(timerRef.current);

    const duration = 5000; // 5s per story
    let startTime = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        handleNext();
      } else {
        setProgress((elapsed / duration) * 100);
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [current, isOpen, stories]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const openStory = (index) => {
    setCurrent(index);
    setIsOpen(true);
  };

  return (
    <div className="z-999 w-full pl-16">
      {/* Story Tray (Instagram-style circles) */}
      <div className="flex w-full gap-4 p-2 overflow-x-auto">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => openStory(index)}
          >
            <div className="w-16 h-16 rounded-lg p-[3px] bg-gradient-to-tr from-pink-500 to-yellow-400">
              <img
                src={logo}
                alt={`story-logo`}
                className="w-full h-full object-cover rounded-lg border-2 border-black"
              />
            </div>
          </div>
        ))}
      </div>
      {isOpen && stories.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 w-screen h-screen [transform:translate3d(0,0,999px)] [will-change:transform] [contain:paint]"
        >
          <div className="relative w-[400px] h-[700px] bg-black rounded-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-10 text-white bg-black/50 p-2 rounded-full"
            >
              <X size={24} />
            </button>

            {/* Story Image */}
            <motion.img
              key={stories[current].shortId}
              src={stories[current].thumbnail}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            />

            {/* Progress Bars */}
            <div className="absolute top-2 left-0 right-0 flex space-x-1 px-4">
              {stories.map((_, index) => (
                <div
                  key={index}
                  className="h-1 bg-gray-600 flex-1 rounded overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-white"
                    animate={{
                      width:
                        index < current
                          ? "100%"
                          : index === current
                          ? `${progress}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ))}
            </div>

            {/* ✅ View Story Button (over image, centered at bottom) */}
            {stories[current].link && (
              <a
                href={stories[current].link}
                className="absolute px-10 w-full bottom-32 left-1/2 -translate-x-1/2 z-10"
              >
                <button className="px-4 py-3 bg-white w-full text-gray-800 font-bold text-xl rounded-lg shadow hover:bg-gray-200">
                  View Story
                </button>
              </a>
            )}

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/40 p-2 rounded-full"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/40 p-2 rounded-full"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
