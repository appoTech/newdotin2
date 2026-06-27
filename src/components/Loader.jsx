import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Jupiter from "../assets/jupiter.png";

export default function LoadingScreen({ isLoading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    if (isLoading) {
      setProgress(0); // reset when loading starts
      interval = setInterval(() => {
        setProgress((old) => {
          if (old >= 90) return old; // hold at 90 until done
          return old + 5;
        });
      }, 200);
    } else {
      // instantly finish when loading ends
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500); // reset for next time
      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-md z-50">
      {/* Rotating Loader */}
      <motion.img
        src={Jupiter}
        className="w-14 h-14 border-4 border-gray-300 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Progress Bar */}
      <div className="w-64 mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
      </div>

      <p className="mt-3 text-gray-700 font-medium">{progress}%</p>
    </div>
  );
}
