import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import logo from "../assets/logo.avif";
import logo1 from "../assets/Spawnsers.png";
import Boot from "../components/Boot";
import banner from "../assets/default_banner.png";
import ContactDialog from "../components/ContactDialog";
import ShareTray from "../components/ShareTray";
import GenerateLinkButton from "./SmartLink.jsx";
import { Eye } from "lucide-react";
import { useHistory } from "react-router-dom";
import "./shootingstars.css";
import RollingCounter from "./RollingCounter.jsx";
import cloud from "../assets/present-cloud.png";
import { gsap } from "gsap";
import { cn } from "../lib/utils";


// Default Metadata for fallback
const DEFAULT_METADATA = {
  bio: "Appopener",
  truncatedBio: "Default truncated bio",
  channelName: "appø",
  banner: banner,
  avatar: logo,
  channelLink: "https://www.youtube.com/@creatorcosmos",
  links: [],
};

// Chaos Noise Button Shader Code
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_tap;
  uniform float u_speed;
  uniform float u_amplitude;
  uniform float u_pulseMin;
  uniform float u_pulseMax;
  uniform float u_noiseType;

  float hash(float n) {
    return fract(sin(n) * 753.5453123);
  }

  float noiseHash(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    float n = p.x + p.y * 157.0;
    return mix(
      mix(hash(n + 0.0), hash(n + 1.0), f.x),
      mix(hash(n + 157.0), hash(n + 158.0), f.x),
      f.y
    );
  }

  float noiseTrig(vec2 p) {
    float x = p.x;
    float y = p.y;

    float n = sin(x * 1.0 + sin(y * 1.3)) * 0.5;
    n += sin(y * 1.0 + sin(x * 1.1)) * 0.5;
    n += sin((x + y) * 0.5) * 0.25;
    n += sin((x - y) * 0.7) * 0.25;

    return n * 0.5 + 0.5;
  }

  float noise(vec2 p) {
    if (u_noiseType < 0.5) {
      return noiseHash(p);
    } else {
      return noiseTrig(p);
    }
  }

  float fbm(vec2 p, vec3 a) {
    float v = 0.0;
    v += noise(p * a.x) * 0.50;
    v += noise(p * a.y) * 1.50;
    v += noise(p * a.z) * 0.125 * 0.1;
    return v;
  }

  vec3 drawLines(vec2 uv, vec3 fbmOffset, vec3 color1, float secs) {
    float timeVal = secs * 0.1;
    vec3 finalColor = vec3(0.0);

    vec3 colorSets[4];
    colorSets[0] = vec3(0.7, 0.05, 1.0);
    colorSets[1] = vec3(1.0, 0.19, 0.0);
    colorSets[2] = vec3(0.0, 1.0, 0.3);
    colorSets[3] = vec3(0.0, 0.38, 1.0);

    for(int i = 0; i < 4; i++) {
      float indexAsFloat = float(i);
      float amp = u_amplitude + (indexAsFloat * 0.0);
      float period = 2.0 + (indexAsFloat + 2.0);
      float thickness = mix(0.4, 0.2, noise(uv * 2.0));

      float t = abs(1.0 / (sin(uv.y + fbm(uv + timeVal * period, fbmOffset)) * amp) * thickness);

      finalColor += t * colorSets[i];
    }

    for(int i = 0; i < 4; i++) {
      float indexAsFloat = float(i);
      float amp = (u_amplitude * 0.5) + (indexAsFloat * 5.0);
      float period = 9.0 + (indexAsFloat + 2.0);
      float thickness = mix(0.1, 0.1, noise(uv * 12.0));

      float t = abs(1.0 / (sin(uv.y + fbm(uv + timeVal * period, fbmOffset)) * amp) * thickness);

      finalColor += t * colorSets[i] * color1;
    }

    return finalColor;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy / u_resolution.x) * 1.0 - 1.0;
    uv *= 1.5;

    vec3 lineColor1 = vec3(1.0, 0.0, 0.5);
    vec3 lineColor2 = vec3(0.3, 0.5, 1.5);

    float spread = abs(u_tap);
    vec3 finalColor = vec3(0.0);

    float t = sin(u_time) * 0.5 + 0.5;
    float pulse = mix(u_pulseMin, u_pulseMax, t);

    finalColor = drawLines(uv, vec3(65.2, 40.0, 4.0), lineColor1, u_time * u_speed) * pulse;
    finalColor += drawLines(uv, vec3(5.0 * spread / 2.0, 2.1 * spread, 1.0), lineColor2, u_time * u_speed);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

class ChaosButton {
  constructor(button, config) {
    this.button = button;
    this.canvas = button.querySelector('.chaos-canvas');
    this.config = config;
    this.startTime = Date.now();
    this.lastTime = 0;
    this.phase = 0;
    this.animationFrameId = null;

    this.currentSpeed = config.restingSpeed;
    this.currentAmplitude = config.restingAmplitude;
    this.currentPulseMin = config.restingPulseMin;
    this.currentPulseMax = config.restingPulseMax;
    this.currentTap = config.restingTap;

    this.setupWebGL();
    this.setupEvents();
    this.render();
  }

  setupWebGL() {
    const gl = this.canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    this.gl = gl;

    const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    this.program = program;
    gl.useProgram(program);

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    this.uniformLocations = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      tap: gl.getUniformLocation(program, 'u_tap'),
      speed: gl.getUniformLocation(program, 'u_speed'),
      amplitude: gl.getUniformLocation(program, 'u_amplitude'),
      pulseMin: gl.getUniformLocation(program, 'u_pulseMin'),
      pulseMax: gl.getUniformLocation(program, 'u_pulseMax'),
      noiseType: gl.getUniformLocation(program, 'u_noiseType'),
    };

    this.resize();
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  resize() {
    if (!this.gl) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = this.button.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(
      this.uniformLocations.resolution,
      this.canvas.width,
      this.canvas.height
    );
  }

  setupEvents() {
    const activate = () => {
      gsap.killTweensOf(this);
      gsap.to(this, {
        currentSpeed: this.config.activeSpeed,
        currentAmplitude: this.config.activeAmplitude,
        currentPulseMin: this.config.activePulseMin,
        currentPulseMax: this.config.activePulseMax,
        currentTap: this.config.activeTap,
        duration: this.config.activeDuration,
        ease: this.config.activeEase,
      });
    };

    const deactivate = () => {
      gsap.killTweensOf(this);
      gsap.to(this, {
        currentSpeed: this.config.restingSpeed,
        currentAmplitude: this.config.restingAmplitude,
        currentPulseMin: this.config.restingPulseMin,
        currentPulseMax: this.config.restingPulseMax,
        currentTap: this.config.restingTap,
        duration: this.config.restingDuration,
        ease: this.config.restingEase,
      });
    };

    this.button.addEventListener('mousedown', activate);
    this.button.addEventListener('mouseup', deactivate);
    this.button.addEventListener('mouseleave', deactivate);
    this.button.addEventListener('touchstart', activate);
    this.button.addEventListener('touchend', deactivate);

    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    gsap.killTweensOf(this);
  }

  render = () => {
    if (!this.gl) return;
    const time = (Date.now() - this.startTime) / 1000;
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    this.phase += deltaTime * this.currentSpeed;

    if (this.phase > 1000) {
      this.phase = this.phase % 1000;
    }

    this.gl.uniform1f(this.uniformLocations.time, this.phase);
    this.gl.uniform1f(this.uniformLocations.tap, this.currentTap);
    this.gl.uniform1f(this.uniformLocations.speed, 1.0);
    this.gl.uniform1f(this.uniformLocations.amplitude, this.currentAmplitude);
    this.gl.uniform1f(this.uniformLocations.pulseMin, this.currentPulseMin);
    this.gl.uniform1f(this.uniformLocations.pulseMax, this.currentPulseMax);
    this.gl.uniform1f(this.uniformLocations.noiseType, this.config.noiseType === 'trig' ? 1.0 : 0.0);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    this.animationFrameId = requestAnimationFrame(this.render);
  };
}

const UserProfile = (props) => {
  const history = useHistory();
  const videoId = props.video_id;
  const visitorCount = props.visitorCount;
  const [showPopup, setShowPopup] = useState(false);
  const [showSecondPopup, setShowSecondPopup] = useState(false);
  const [showThirdPopup, setShowThirdPopup] = useState(false);
  const [data, setChannelData] = useState(DEFAULT_METADATA);
  const [loading, setloading] = useState(false);
  const [completed, setcompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showGeneratedLink, setShowGeneratedLink] = useState(false);
  const isMobile = window.innerWidth <= 640; // sm breakpoint in Tailwind

  const launchButtonRef = useRef(null);
  const oceanCanvasRef = useRef(null);

  useEffect(() => {
    let chaosInstance = null;
    if (completed && launchButtonRef.current) {
      const config = {
        noiseType: 'trig',
        // Resting state
        restingSpeed: 0.35,
        restingAmplitude: 80,
        restingPulseMin: 0.05,
        restingPulseMax: 0.2,
        restingTap: 1.0,
        // Active state
        activeSpeed: 2.8,
        activeAmplitude: 10,
        activePulseMin: 0.05,
        activePulseMax: 0.4,
        activeTap: 1.0,
        // Animation
        activeDuration: 0.26,
        activeEase: 'power2.out',
        restingDuration: 3,
        restingEase: 'power2.out',
      };
      try {
        chaosInstance = new ChaosButton(launchButtonRef.current, config);
      } catch (err) {
        console.error("Failed to initialize ChaosButton:", err);
      }
    }
    return () => {
      if (chaosInstance) {
        chaosInstance.destroy();
      }
    };
  }, [completed]);

  useEffect(() => {
    const canvas = oceanCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W, H, DPR, horizonY, oceanH;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width || window.innerWidth;
      H = rect.height || 100;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      horizonY = H * 0.42;
      oceanH = H - horizonY;
    }

    window.addEventListener("resize", resize);
    resize();

    const KEYS = [
      {
        t: 0.0,
        name: "DAWN",
        skyTop: [38, 44, 86],
        skyHor: [247, 176, 128],
        sun: [255, 238, 206],
        glow: [255, 178, 120],
        wFar: [176, 150, 150],
        wNear: [34, 62, 84],
        foam: [255, 244, 234],
        sunH: 0.1,
        glit: 0.7,
        star: 0
      },
      {
        t: 0.28,
        name: "MORNING",
        skyTop: [64, 134, 206],
        skyHor: [188, 222, 236],
        sun: [255, 255, 246],
        glow: [255, 250, 224],
        wFar: [120, 186, 196],
        wNear: [20, 92, 114],
        foam: [255, 255, 255],
        sunH: 0.55,
        glit: 0.5,
        star: 0
      },
      {
        t: 0.5,
        name: "MIDDAY",
        skyTop: [58, 142, 214],
        skyHor: [176, 216, 230],
        sun: [255, 255, 248],
        glow: [255, 252, 232],
        wFar: [96, 178, 188],
        wNear: [16, 96, 120],
        foam: [255, 255, 255],
        sunH: 0.92,
        glit: 0.45,
        star: 0
      },
      {
        t: 0.68,
        name: "GOLDEN HOUR",
        skyTop: [74, 92, 156],
        skyHor: [255, 202, 120],
        sun: [255, 236, 194],
        glow: [255, 168, 92],
        wFar: [206, 164, 118],
        wNear: [34, 78, 98],
        foam: [255, 244, 228],
        sunH: 0.3,
        glit: 0.95,
        star: 0
      },
      {
        t: 0.84,
        name: "SUNSET",
        skyTop: [48, 38, 86],
        skyHor: [255, 108, 68],
        sun: [255, 206, 148],
        glow: [255, 92, 58],
        wFar: [188, 98, 84],
        wNear: [30, 42, 72],
        foam: [255, 222, 200],
        sunH: 0.06,
        glit: 1.0,
        star: 0.15
      },
      {
        t: 1.0,
        name: "MOONLIT",
        skyTop: [8, 12, 30],
        skyHor: [34, 44, 82],
        sun: [228, 234, 255],
        glow: [140, 164, 216],
        wFar: [28, 42, 76],
        wNear: [6, 16, 32],
        foam: [196, 208, 234],
        sunH: 0.55,
        glit: 0.55,
        star: 1
      }
    ];

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    function lerpRGB(a, b, t) {
      return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
    }
    function rgb(c, a = 1) {
      return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
    }

    function getPalette(t) {
      let i = 0;
      while (i < KEYS.length - 1 && t > KEYS[i + 1].t) i++;
      const a = KEYS[i],
        b = KEYS[Math.min(i + 1, KEYS.length - 1)];
      const span = b.t - a.t || 1;
      const k = Math.max(0, Math.min(1, (t - a.t) / span));
      return {
        name: k < 0.5 ? a.name : b.name,
        skyTop: lerpRGB(a.skyTop, b.skyTop, k),
        skyHor: lerpRGB(a.skyHor, b.skyHor, k),
        sun: lerpRGB(a.sun, b.sun, k),
        glow: lerpRGB(a.glow, b.glow, k),
        wFar: lerpRGB(a.wFar, b.wFar, k),
        wNear: lerpRGB(a.wNear, b.wNear, k),
        foam: lerpRGB(a.foam, b.foam, k),
        sunH: lerp(a.sunH, b.sunH, k),
        glit: lerp(a.glit, b.glit, k),
        star: lerp(a.star, b.star, k)
      };
    }

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.4,
      r: Math.random() * 1.2 + 0.3,
      tw: Math.random() * Math.PI * 2
    }));

    const clouds = Array.from({ length: 5 }, () => ({
      x: Math.random(),
      y: 0.08 + Math.random() * 0.18,
      w: 0.18 + Math.random() * 0.22,
      speed: 0.000015 + Math.random() * 0.00002
    }));

    const birds = Array.from({ length: 4 }, () => ({
      x: Math.random(),
      y: 0.15 + Math.random() * 0.18,
      speed: 0.00004 + Math.random() * 0.00004,
      size: 8 + Math.random() * 6,
      flap: Math.random() * Math.PI * 2
    }));

    let mouseX = 0.5;
    const onMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth;
    };
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouseX = e.touches[0].clientX / window.innerWidth;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    let T = 0;
    let animationFrameId;

    function draw() {
      T += 0.016;

      let timeOfDay = 0.28; // morning
      if (props.currentTheme && props.currentTheme.bg) {
        const bg = props.currentTheme.bg;
        if (bg.includes("slate") || bg.includes("indigo")) {
          timeOfDay = 1.0; // MOONLIT / Night
        } else if (bg.includes("purple") || bg.includes("pink")) {
          timeOfDay = 0.84; // SUNSET / Evening
        } else if (bg.includes("orange")) {
          timeOfDay = 0.28; // MORNING
        }
      }

      const P = getPalette(timeOfDay);

      const sunX = W * (0.5 + (mouseX - 0.5) * 0.25);
      const sunY = horizonY - P.sunH * horizonY * 0.82;

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, horizonY + oceanH * 0.1);
      sky.addColorStop(0, rgb(P.skyTop));
      sky.addColorStop(0.7, rgb(lerpRGB(P.skyTop, P.skyHor, 0.55)));
      sky.addColorStop(1, rgb(P.skyHor));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, horizonY + 2);

      // stars
      if (P.star > 0.01) {
        stars.forEach((s) => {
          const tw = 0.5 + 0.5 * Math.sin(T * 2 + s.tw);
          ctx.fillStyle = rgb([255, 255, 255], P.star * tw * 0.9);
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * horizonY, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // sun glow
      const glowR = Math.min(W, H) * 0.5;
      const g = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, glowR);
      g.addColorStop(0, rgb(P.glow, 0.55));
      g.addColorStop(0.25, rgb(P.glow, 0.22));
      g.addColorStop(1, rgb(P.glow, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, horizonY + oceanH * 0.4);

      // sun disc
      const sunR = Math.min(W, H) * 0.045;
      const sd = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      sd.addColorStop(0, rgb(P.sun, 1));
      sd.addColorStop(0.7, rgb(P.sun, 0.95));
      sd.addColorStop(1, rgb(P.sun, 0.2));
      ctx.fillStyle = sd;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // clouds
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > 1.3) c.x = -0.3;
        const cx = c.x * W,
          cy = c.y * horizonY,
          cw = c.w * W;
        ctx.fillStyle = rgb(lerpRGB(P.skyHor, [255, 255, 255], 0.25), 0.16);
        for (let j = 0; j < 4; j++) {
          ctx.beginPath();
          ctx.ellipse(
            cx + j * cw * 0.22,
            cy + Math.sin(j) * 6,
            cw * (0.3 - j * 0.04),
            cw * 0.06,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });

      // birds
      birds.forEach((b) => {
        b.x += b.speed;
        b.flap += 0.15;
        if (b.x > 1.2) {
          b.x = -0.2;
          b.y = 0.15 + Math.random() * 0.18;
        }
        const bx = b.x * W,
          by = b.y * horizonY;
        const wing = Math.sin(b.flap) * b.size * 0.5;
        ctx.strokeStyle = rgb(lerpRGB(P.skyTop, [0, 0, 0], 0.3), 0.5);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx - b.size, by + wing);
        ctx.quadraticCurveTo(bx, by - b.size * 0.3, bx, by);
        ctx.quadraticCurveTo(bx, by - b.size * 0.3, bx + b.size, by + wing);
        ctx.stroke();
      });

      // horizon haze
      const haze = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 40);
      haze.addColorStop(0, rgb(P.skyHor, 0));
      haze.addColorStop(0.5, rgb(P.skyHor, 0.45));
      haze.addColorStop(1, rgb(P.wFar, 0));
      ctx.fillStyle = haze;
      ctx.fillRect(0, horizonY - 40, W, 80);

      // ocean swells
      const NUM = 26;
      for (let i = 0; i < NUM; i++) {
        const depth = i / (NUM - 1);
        const yTop = horizonY + Math.pow(depth, 1.9) * oceanH;
        const amp = lerp(0.6, 30, depth);
        const wlen = lerp(46, 340, depth);
        const speed = lerp(0.25, 0.9, depth);
        const phase = T * speed + i * 0.9;
        const col = lerpRGB(P.wFar, P.wNear, depth);

        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(0, yTop + Math.sin(phase) * amp);
        for (let x = 0; x <= W; x += 6) {
          const y =
            yTop +
            Math.sin(x / wlen + phase) * amp +
            Math.sin(x / (wlen * 0.4) + phase * 1.6) * amp * 0.3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = rgb(col);
        ctx.fill();

        ctx.lineWidth = lerp(0.6, 2.2, depth);
        ctx.beginPath();
        let started = false;
        for (let x = 0; x <= W; x += 6) {
          const y =
            yTop +
            Math.sin(x / wlen + phase) * amp +
            Math.sin(x / (wlen * 0.4) + phase * 1.6) * amp * 0.3;
          if (started) {
            ctx.lineTo(x, y);
          } else {
            ctx.moveTo(x, y);
            started = true;
          }
        }
        const sunCloseness = 1 - Math.min(1, Math.abs(sunX - W * 0.5) / (W * 0.5));
        ctx.strokeStyle = rgb(lerpRGB(col, P.sun, 0.55), lerp(0.05, 0.3, depth));
        ctx.stroke();

        if (depth > 0.62) {
          const foamA = (depth - 0.62) / 0.38;
          for (let x = 0; x <= W; x += 9) {
            const y =
              yTop +
              Math.sin(x / wlen + phase) * amp +
              Math.sin(x / (wlen * 0.4) + phase * 1.6) * amp * 0.3;
            const crest = Math.sin(x / wlen + phase);
            if (crest > 0.55 && Math.random() > 0.45) {
              ctx.fillStyle = rgb(P.foam, foamA * (0.18 + Math.random() * 0.35));
              ctx.fillRect(
                x + (Math.random() - 0.5) * 6,
                y - Math.random() * 3,
                1.5 + Math.random() * 3,
                1.5 + Math.random() * 2
              );
            }
          }
        }
      }

      // sun glitter path
      const glitterCount = 220;
      for (let i = 0; i < glitterCount; i++) {
        const dy = Math.random();
        const y = horizonY + Math.pow(dy, 1.5) * oceanH;
        const spread = lerp(6, W * 0.3, dy);
        const x = sunX + (Math.random() - 0.5) * 2 * spread;
        const distFade = 1 - Math.min(1, Math.abs(x - sunX) / (spread + 1));
        const flick = 0.25 + Math.random() * 0.75;
        const a = distFade * distFade * flick * P.glit * (1 - dy * 0.25);
        if (a < 0.02) continue;
        ctx.fillStyle = rgb(P.sun, a * 0.85);
        const len = 1 + Math.random() * (2 + dy * 4);
        ctx.fillRect(x, y, len, 1 + dy);
      }

      // Vignette
      const vig = ctx.createRadialGradient(
        W / 2,
        H * 0.55,
        H * 0.25,
        W / 2,
        H * 0.55,
        H * 0.9
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,8,0.34)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [completed, props.currentTheme]);

  const handleSubscribeClick = () => {
    window.location.href = data.channelLink;
  };

  const handleBootClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowSecondPopup(false);
  };

  const showSecondPopupHandler = () => {
    setShowSecondPopup(true);
  };

  const backToFirstPopup = () => {
    setShowSecondPopup(false);
    setShowThirdPopup(false);
  };

  const handleProfileClick = () => {
    setShowThirdPopup(true);
  };

  useEffect(() => {
    if (
      props.leaderboard &&
      props.leaderboard.length > 0 &&
      props.leaderIndex >= props.leaderboard.length
    ) {
      props.setLeaderIndex(0);
      localStorage.setItem("leaderIndex", 0);
    }
  }, [props.leaderboard]);

  const handleNextLeaderboard = () => {
    const board = props.leaderboard || [];
    if (board.length === 0) return;

    const nextIndex = (props.leaderIndex + 1) % board.length;

    props.setLeaderIndex(nextIndex);
    localStorage.setItem("leaderIndex", nextIndex);

    const nextVideo = board[nextIndex];

    if (nextVideo?.smart_link) {
      history.push(
        `/leader-redirect?url=${encodeURIComponent(nextVideo.smart_link)}`
      );
    }
  };

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const fetchedData = props.ytChannelDetails?.data || {};
        setChannelData({
          bio: fetchedData.channelDescription || DEFAULT_METADATA.bio,
          truncatedBio:
            (fetchedData.channelDescription || DEFAULT_METADATA.bio).slice(
              0,
              65
            ) + "...",
          channelName: fetchedData.channelName || DEFAULT_METADATA.channelName,
          banner: fetchedData.banner || DEFAULT_METADATA.banner,
          avatar: fetchedData.avatar || DEFAULT_METADATA.avatar,
          channelLink: fetchedData.channelLink || DEFAULT_METADATA.channelLink,
          links: fetchedData.links || DEFAULT_METADATA.links,
        });

        setloading(true);
        setTimeout(() => {
          setcompleted(true);
          props.onApiDataLoaded();
        }, 0);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setChannelData(DEFAULT_METADATA);
        setloading(true);
        setTimeout(() => {
          setcompleted(true);
          props.onApiDataLoaded();
        }, 0);
      }
    };

    fetchChannelData();
  }, [videoId, props.onApiDataLoaded]);

  let borderClass = "border-orange-500/50";
  let hoverBgClass = "hover:bg-orange-500/20";
  if (props.currentTheme && props.currentTheme.bg) {
    const bg = props.currentTheme.bg;
    if (bg.includes("slate") || bg.includes("indigo")) {
      borderClass = "border-indigo-500/50";
      hoverBgClass = "hover:bg-indigo-500/20";
    } else if (bg.includes("purple") || bg.includes("pink")) {
      borderClass = "border-pink-500/50";
      hoverBgClass = "hover:bg-pink-500/20";
    } else if (bg.includes("orange")) {
      borderClass = "border-orange-500/50";
      hoverBgClass = "hover:bg-orange-500/20";
    }
  }

  return (
    <>
      {!completed ? (
        <div className="min-h-screen flex flex-col justify-center items-center text-white">
          {!loading ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={logo}
                alt="AppOpener Logo"
                className="w-20 h-20 drop-shadow-[0_0_15px_#00F5FF]"
              />
              <span className="text-lg text-[#00F5FF] drop-shadow-[0_0_10px_#00F5FF]">
                Please Wait...
              </span>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#FF00A0] drop-shadow-[0_0_8px_#FF00A0]"></div>
            </div>
          ) : (
            <div className="text-4xl text-[#42b883] drop-shadow-[0_0_10px_#42b883]">
              &#x2713;
            </div>
          )}
        </div>
      ) : (
        <header
          className="
    relative isolate overflow-hidden
    w-full 
    bg-black/10 
    border-b border-white/10 
    shadow-[0_0_15px_#9D4EDD]/40 
    px-3 py-3 
    flex flex-row gap-3 items-stretch
  "
        >
          <canvas ref={oceanCanvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />

          {/* ---------- COLUMN 1: Favic on (Social Icons in Vertical List) ---------- */}
          <div className="flex flex-col gap-2 justify-center items-center px-1 border-r border-white/10 pr-2 z-10">
            {data.links &&
              (isMobile ? data.links.slice(0, 4) : data.links).map(
                (link, index) => (
                  <a
                    key={index}
                    href={`https://${link.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-125 transition-transform duration-200 flex-shrink-0"
                  >
                    <img
                      src={link.favicon[0]?.url}
                      alt={link.title}
                      className="w-6 h-6"
                    />
                  </a>
                )
              )}
          </div>

          {/* ---------- COLUMN 2: Right Section (Rows 1 & 2) ---------- */}
          <div className="flex flex-col gap-3 flex-grow z-10 justify-between">
            {/* ROW 1: Chanel name + Openers */}
            <div className="flex items-center justify-center gap-3 w-full">
              {/* Chanel name */}
              <div
                className={cn(
                  "w-full text-center font-bold flex-grow pb-2",
                  props.currentTheme.accent,
                  props.currentTheme.shadow,
                  data.channelName.length > 36 ? "line-clamp-3" : "line-clamp-2"
                )}
              >
                {data.channelName}
              </div>

              {/* Openers */}
              <div className="flex flex-col items-center">
                <button
                  className={`flex items-center gap-2 rounded-lg border ${borderClass} px-2 py-1.5 text-xs sm:text-sm ${hoverBgClass} transition-all font-bold ${props.currentTheme.text}`}
                >
                  {/* <Eye className="w-6 h-6 animate-pulse translate-y-2 translate-x-2" /> */}
                  <div className="bg-green-400 w-4 h-4 rounded-full animate-pulse"> 
                  </div>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[16px]">
                      <RollingCounter value={visitorCount} />
                    </span>
                    <span className={`${props.currentTheme.text} text-[16px] -mt-1`}>
                      Live
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* ROW 2: Q (Search) + NEWS + NEXT */}
            <div className="flex items-center justify-between gap-3 w-full">
              {/* Q (Search Icon) */}
              <a
                href="https://www.spawnser.com/collab"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex-shrink-0 flex items-center justify-center"
                style={{ width: "40px", height: "40px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-5.2-5.2M16.8 10.4a6.4 6.4 0 11-12.8 0 6.4 6.4 0 0112.8 0z"
                  />
                </svg>
              </a>

              {/* NEWS Button */}
              <a
                href="/text-to-reel"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline flex-grow"
              >
                <button
                  ref={launchButtonRef}
                  className="chaos-button w-full h-[40px]"
                >
                  <canvas className="chaos-canvas"></canvas>
                  <span className="chaos-label">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    LAUNCH
                  </span>
                </button>
              </a>

              {/* NEXT Button */}
              <button
                onClick={handleNextLeaderboard}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg py-2 px-4 font-bold hover:opacity-90 transition flex-grow h-[40px] text-sm sm:text-md",
                  props.currentTheme.button
                )}
              >
                NEW
              </button>
            </div>
          </div>
        </header>
      )}

      <ContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        Creator1={data.channelName}
        Video={props.video_id}
        LInk={props.url}
      />
      <ShareTray open={props.shareTrayOpen} onOpenChange={props.setShareTrayOpen} setButtonText={props.setButtonText} />
      <Boot
        show={showPopup}
        onClose={closePopup}
        onNextPopup={showSecondPopupHandler}
        onBack={backToFirstPopup}
        showSecondPopup={showSecondPopup}
        showThirdPopup={showThirdPopup}
        onProfileClick={handleProfileClick}
      />

    </>
  );
};

export default UserProfile;