import React from "react";
import { motion } from "framer-motion";
import { Video, Package, User } from "lucide-react";

const logos = [
  { id: 1, name: "Video", icon: <Video size={32} /> },
  { id: 2, name: "Product", icon: <Package size={32} /> },
  { id: 3, name: "Profile", icon: <User size={32} /> },
];

const LogoBox = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-6 p-10 w-fit mx-auto">
      {/* First Row: Video and Product */}
      {logos.slice(0, 2).map((logo, index) => (
        <motion.div
              className="flex justify-center items-center h-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              delay={0.2 + index * 0.1}
            >
        <motion.div
          key={logo.id}
          className="w-28 h-28 bg-gray-100 text-black rounded-lg flex justify-center items-center shadow-md hover:shadow-xl transition"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.2 }}
          >
            {logo.icon}
          </motion.div>
        </motion.div>
        </motion.div>
      ))}

      {/* Empty Cell to Push Profile Centered */}
      <div className="col-span-1" />

      {/* Second Row Centered: Profile */}
      <motion.div
              className="flex justify-center items-center h-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              delay={0.2 + 2 * 0.1}
            >
      <motion.div
        className="w-28 h-28 bg-gray-100 rounded-lg text-black flex justify-center items-center shadow-md hover:shadow-xl transition col-span-1 col-start-1 col-end-3 mx-auto"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {logos[2].icon}
        </motion.div>
      </motion.div>
      </motion.div>
    </div>
  );
};

export default LogoBox;

