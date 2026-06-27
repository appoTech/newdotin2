import { motion } from "framer-motion";

export default function SpaceBackground() {
  const stars = Array.from({ length: 50 });

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <rect width="100%" height="100%" fill="black" />
        {stars.map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const r = Math.random() * 1.5 + 0.5;

          return (
            <motion.circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          );
        })}
      </svg>
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(128,0,128,0.4), transparent 70%)",
        }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
