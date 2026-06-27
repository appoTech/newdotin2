import React, { useEffect, useRef } from "react";

const STAR_COUNT = 140;
const WARP_STAR_COUNT = 180;
const GLOBE_POINTS = 1500;
const GLOBE_RADIUS = 120;
const ROTATION_SPEED = 0.0035;

function createStars(width, height, dpr) {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width * dpr,
    y: Math.random() * height * dpr,
    r: Math.random() * 1.8 + 0.4,
    a: Math.random() * 0.7 + 0.2,
    drift: Math.random() * 0.15 + 0.02,
  }));
}

function createGlobePoints() {
  return Array.from({ length: GLOBE_POINTS }, (_, index) => {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = 2 * Math.PI * Math.random();

    return {
      x: GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi),
      y: GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi),
      z: GLOBE_RADIUS * Math.cos(theta),
      size: Math.random() * 1.8 + 0.7,
    };
  });
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function createWarpStars(width, height, dpr) {
  return Array.from({ length: WARP_STAR_COUNT }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: Math.random() * 0.35 + 0.02,
    speed: Math.random() * 0.018 + 0.01,
    size: Math.random() * 1.8 + 0.8,
    alpha: Math.random() * 0.55 + 0.25,
    offsetX: (Math.random() - 0.5) * width * dpr * 0.08,
    offsetY: (Math.random() - 0.5) * height * dpr * 0.08,
  }));
}

export default function GlobeEntry() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let frameId = 0;
    let rotation = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let warpStars = [];
    const points = createGlobePoints();
    const introDuration = 3200;
    const startZoom = 0.72;
    const endZoom = 2.4;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      stars = createStars(width, height, dpr);
      warpStars = createWarpStars(width, height, dpr);
    };

    const drawBackground = () => {
      const gradient = context.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.45,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.max(canvas.width, canvas.height) * 0.65
      );

      gradient.addColorStop(0, "rgba(20, 34, 66, 0.18)");
      gradient.addColorStop(0.45, "rgba(6, 12, 26, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = (time) => {
      stars.forEach((star, index) => {
        const pulse = 0.65 + Math.sin(time * 0.0015 + index) * 0.35;
        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${star.a * pulse})`;
        context.arc(
          star.x + Math.sin(time * 0.00015 + index) * star.drift * 10,
          star.y + Math.cos(time * 0.00015 + index) * star.drift * 10,
          star.r * dpr,
          0,
          Math.PI * 2
        );
        context.fill();
      });
    };

    const drawGlobe = (introProgress) => {
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.38;
      const zoom = startZoom - (startZoom - endZoom) * easeOutCubic(introProgress);
      const scale = (Math.min(canvas.width, canvas.height) / 720) * zoom;
      const radius = GLOBE_RADIUS * scale * dpr;
      const entryFade = 1 - Math.max(0, (introProgress - 0.58) / 0.42);

      const shell = context.createRadialGradient(
        centerX - radius * 0.28,
        centerY - radius * 0.38,
        radius * 0.08,
        centerX,
        centerY,
        radius * 1.08
      );
      shell.addColorStop(0, `rgba(160, 235, 255, ${0.2 * entryFade})`);
      shell.addColorStop(0.45, `rgba(52, 124, 255, ${0.1 * entryFade})`);
      shell.addColorStop(0.85, `rgba(18, 32, 60, ${0.04 * entryFade})`);
      shell.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.beginPath();
      context.fillStyle = shell;
      context.arc(centerX, centerY, radius * 1.02, 0, Math.PI * 2);
      context.fill();

      const projected = points
        .map((point) => {
          const rx = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
          const rz = point.x * Math.sin(rotation) + point.z * Math.cos(rotation);
          const perspective = 1 / (1 + (rz + GLOBE_RADIUS) / (GLOBE_RADIUS * 2.8));

          return {
            x: centerX + rx * perspective * scale * dpr,
            y: centerY + point.y * perspective * scale * dpr,
            depth: rz,
            size: point.size * perspective * dpr,
            alpha: (0.2 + ((rz + GLOBE_RADIUS) / (GLOBE_RADIUS * 2)) * 0.8) * entryFade,
          };
        })
        .sort((a, b) => a.depth - b.depth);

      projected.forEach((point) => {
        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${point.alpha})`;
        context.arc(point.x, point.y, Math.max(0.8, point.size), 0, Math.PI * 2);
        context.fill();
      });
    };

    const drawWarpField = (progress) => {
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.38;
      const intensity = 1 - easeOutCubic(progress);
      const spread = 0.22 + easeOutCubic(progress) * 2.8;

      warpStars.forEach((star, index) => {
        const distance = (star.distance + progress * (3.5 + star.speed * 12)) * spread;
        const dx = Math.cos(star.angle) * distance * width * 0.34 * dpr + star.offsetX;
        const dy = Math.sin(star.angle) * distance * height * 0.3 * dpr + star.offsetY;
        const tailX = Math.cos(star.angle) * (16 + progress * 180) * star.speed * dpr;
        const tailY = Math.sin(star.angle) * (16 + progress * 180) * star.speed * dpr;

        const gradient = context.createLinearGradient(
          centerX + dx - tailX,
          centerY + dy - tailY,
          centerX + dx,
          centerY + dy
        );

        const alpha = Math.max(0, star.alpha * intensity);
        gradient.addColorStop(0, `rgba(120, 190, 255, 0)`);
        gradient.addColorStop(1, `rgba(220, 245, 255, ${alpha})`);

        context.beginPath();
        context.strokeStyle = gradient;
        context.lineWidth = Math.max(0.8, star.size * dpr * (0.5 + intensity));
        context.moveTo(centerX + dx - tailX, centerY + dy - tailY);
        context.lineTo(centerX + dx, centerY + dy);
        context.stroke();

        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.arc(centerX + dx, centerY + dy, Math.max(0.8, star.size * dpr), 0, Math.PI * 2);
        context.fill();

        star.angle += 0.0008 * (index % 5 === 0 ? -1 : 1);
      });
    };

    const drawInnerField = (progress, time) => {
      const enterProgress = Math.max(0, (progress - 0.52) / 0.48);
      if (enterProgress <= 0) return;

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.38;
      const pulse = easeOutCubic(enterProgress);

      points.slice(0, 900).forEach((point, index) => {
        const angle = Math.atan2(point.y, point.x) + rotation * 0.6;
        const radialBase = ((index % 29) / 29) * Math.min(canvas.width, canvas.height) * 0.42;
        const radial = radialBase * (0.35 + pulse * 0.95);
        const drift = 1 + Math.sin(time * 0.0008 + index) * 0.08;
        const x = centerX + Math.cos(angle) * radial * drift;
        const y = centerY + Math.sin(angle) * radial * 0.72 * drift;
        const alpha = 0.04 + pulse * 0.22;

        context.beginPath();
        context.fillStyle = `rgba(190, 235, 255, ${alpha})`;
        context.arc(x, y, Math.max(0.5, point.size * dpr * 0.38 * (0.6 + pulse)), 0, Math.PI * 2);
        context.fill();
      });
    };

    const render = (time) => {
      const introProgress = Math.min(time / introDuration, 1);
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      drawStars(time);
      drawWarpField(introProgress);
      drawInnerField(introProgress, time);
      context.save();
      context.globalAlpha = 0.18 + (1 - Math.max(0, (introProgress - 0.58) / 0.42)) * 0.82;
      drawGlobe(introProgress);
      context.restore();
      rotation += ROTATION_SPEED;
      frameId = window.requestAnimationFrame(render);
    };

    resize();
    frameId = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          opacity: 0.95,
        }}
      />
    </div>
  );
}
