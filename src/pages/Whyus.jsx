import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import BottomNav from "../components/bottom";

const whyUsData = [
  {
    id: "A",
    title: "Automation Simplified",
    content:
      "AppOpener automates the application decorating process with just a link from creator.",
  },
  {
    id: "B",
    title: "Community of Curiosity",
    content:
      "AppOpener belongs to the community of readers, experimenters and virtual assistants that enters educative blogs, books & biases over chatting globally to all humankind.",
  },
  {
    id: "C",
    title: "Cultural Transformation",
    content:
      "AppØ converts energetic reactions from enthusiasts reps' youth to transcend generational wealth and wear to satiate the unsatisfaction of stagnant dogmas and trichotic mythological mouldings through deet&fleet of data and common cosmic ground for peace 4 all.",
  },
  {
    id: "D",
    title: "Deetox 2 Dandy",
    content: "Deetox 2 Dandy",
  },
];

const WhyUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f051e] to-[#1c0932] text-white flex flex-col items-center py-16 px-4 md:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center items-center gap-2">
          <Sparkles className="text-pink-500 w-6 h-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#9D4EDD] via-[#FF00A0] to-[#FFB347] bg-clip-text text-transparent">
            Why Us?
          </h1>
          <Sparkles className="text-pink-500 w-6 h-6" />
        </div>
        <p className="text-gray-400 mt-3 text-base md:text-lg">
          Discover what makes AppOpener extraordinary
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 max-w-5xl w-full">
        {whyUsData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="bg-[#140722]/60 backdrop-blur-lg border border-[#9D4EDD]/40 rounded-2xl p-6 shadow-[0_0_25px_rgba(157,78,221,0.2)] hover:shadow-[0_0_35px_rgba(255,0,160,0.4)] transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-[#9D4EDD] to-[#FF00A0] w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm">
                {item.id}
              </div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {item.content}
            </p>
          </motion.div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default WhyUs;
