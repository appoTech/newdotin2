import React, { useEffect, useRef } from "react";

const Star_Animation = ({ count = 50 }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    // Create `count` stars from center
    const generateStars = () => {
      stars = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = 0.5 + Math.random() * 1.5;
        stars.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          size: 1 + Math.random() * 2,
        });
      }
    };

    generateStars();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let star of stars) {
        star.x += star.dx;
        star.y += star.dy;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        // Reset star to center if it goes off-screen
        if (
          star.x < 0 ||
          star.x > canvas.width ||
          star.y < 0 ||
          star.y > canvas.height
        ) {
          const angle = Math.random() * 2 * Math.PI;
          const speed = 0.5 + Math.random() * 1.5;
          star.x = canvas.width / 2;
          star.y = canvas.height / 2;
          star.dx = Math.cos(angle) * speed;
          star.dy = Math.sin(angle) * speed;
        }
      }
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default Star_Animation;
