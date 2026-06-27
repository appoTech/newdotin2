import React from "react";

export const SaturnSVG = ({ className }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="30" fill="#004699" /> {/* Darker Blue */}
    <ellipse
      cx="50"
      cy="50"
      rx="48"
      ry="15"
      transform="rotate(-20 50 50)"
      stroke="#FF0000"
      strokeWidth="4"
      fill="none"
    />
  </svg>
);

const AnimatedTokens = () => {
  // Generate random positions for the tokens - increased to 80
  const tokens = React.useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 5 + 8}s`,
      size: Math.random() * 0.6 + 0.4,
    }));
  }, []);

  // Generate additional floating tokens - increased to 20
  const floatingTokens = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 80 + 10}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 5 + 10}s`,
      size: Math.random() * 0.5 + 0.5,
      rotation: Math.random() > 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {tokens.map((token) => (
        <div
          key={token.id}
          className="absolute"
          style={{
            left: token.left,
            top: "-50px",
            transform: `scale(${token.size})`,
            animationDelay: token.delay,
            animationDuration: token.duration,
          }}
        >
          <SaturnSVG
            className={`
              animate-rain opacity-40 
              ${token.id % 7 === 0 ? "animate-rain-delay-1" : ""}
              ${token.id % 7 === 1 ? "animate-rain-delay-2" : ""}
              ${token.id % 7 === 2 ? "animate-rain-delay-3" : ""}
              ${token.id % 7 === 3 ? "animate-rain-delay-4" : ""}
              ${token.id % 7 === 4 ? "animate-rain-delay-5" : ""}
              ${token.id % 7 === 5 ? "animate-rain-delay-6" : ""}
              ${token.id % 7 === 6 ? "animate-rain-delay-7" : ""}
            `}
          />
        </div>
      ))}

      {/* Floating tokens */}
      {floatingTokens.map((token) => (
        <div
          key={`float-${token.id}`}
          className="absolute"
          style={{
            left: token.left,
            top: token.top,
            animationDelay: token.delay,
          }}
        >
          <SaturnSVG
            className={`
              animate-float opacity-40
              ${token.rotation ? "animate-rotate" : "animate-rotate-reverse"}
            `}
          />
        </div>
      ))}
    </div>
  );
};

export default AnimatedTokens;
