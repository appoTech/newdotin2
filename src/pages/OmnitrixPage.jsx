import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "react-router-dom";
import {
  AtSign, Star, Wrench, ShoppingBag, CalendarClock,
  BookOpen, Video, Image, Camera, Play, FileText, Palette, Repeat,
  Film, Music, Package, LayoutTemplate, MessageSquare, Zap, Plug, Users, Clapperboard,
  Megaphone, Scissors, Paintbrush, PenTool,
  Shirt, Watch, Gem, Glasses, ShoppingCart,
  MapPin, Clock, ChevronLeft, ChevronUp, ChevronDown, ArrowLeft,
} from "lucide-react";
import "../css/OmnitrixPage.css";
import belt1 from "../assets/omnitrix/belt1.png";
import wallet1 from "../assets/omnitrix/wallet1.png";
import wallet2 from "../assets/omnitrix/wallet2.png";
import wallet3 from "../assets/omnitrix/wallet3.png";
import wallet4 from "../assets/omnitrix/wallet4.png";
import wallet5 from "../assets/omnitrix/wallet5.png";
import wallet6 from "../assets/omnitrix/wallet6.png";
import wallet7 from "../assets/omnitrix/wallet7.png";

/* ═══════════════ DATA ═══════════════ */
const categories = [
  {
    icon: AtSign, label: "TAG", color: "hsl(42, 100%, 55%)", alien: "◈",
    subItems: [
      { icon: BookOpen, label: "Stories", color: "hsl(42, 90%, 60%)", description: "Share your narrative" },
      { icon: Video, label: "Video Title", color: "hsl(36, 85%, 55%)", description: "Cinematic titles" },
      { icon: Image, label: "Logo", color: "hsl(45, 90%, 50%)", description: "Brand identity" },
      { icon: Camera, label: "Insta Story", color: "hsl(38, 80%, 60%)", description: "Vertical moments" },
      { icon: Play, label: "YT Shorts", color: "hsl(40, 80%, 55%)", description: "Short-form content" },
      { icon: FileText, label: "Article", color: "hsl(44, 70%, 50%)", description: "Written pieces" },
      { icon: Palette, label: "Graphical", color: "hsl(35, 70%, 60%)", description: "Visual designs" },
      { icon: Repeat, label: "Repost", color: "hsl(48, 80%, 50%)", description: "Amplify reach" },
    ],
  },
  {
    icon: Star, label: "BRANDED", color: "hsl(36, 100%, 60%)", alien: "◇",
    subItems: [
      { icon: Film, label: "Movies", color: "hsl(30, 90%, 55%)", description: "Feature placements" },
      { icon: Music, label: "Music", color: "hsl(38, 80%, 60%)", description: "Audio branding" },
      { icon: Package, label: "Products", color: "hsl(45, 100%, 55%)", description: "Product showcases" },
      { icon: LayoutTemplate, label: "Banner", color: "hsl(42, 90%, 50%)", description: "Display creatives" },
      { icon: MessageSquare, label: "Review", color: "hsl(40, 80%, 50%)", description: "Honest opinions" },
      { icon: Zap, label: "Reaction", color: "hsl(50, 100%, 60%)", description: "Live responses" },
      { icon: Repeat, label: "Repost", color: "hsl(44, 60%, 50%)", description: "Share & spread" },
      { icon: Plug, label: "Integration", color: "hsl(36, 70%, 55%)", description: "Seamless connect" },
      { icon: Users, label: "IRL Meet", color: "hsl(34, 75%, 55%)", description: "In person events" },
      { icon: Clapperboard, label: "Short Film", color: "hsl(32, 85%, 55%)", description: "Dedicated films" },
    ],
  },
  {
    icon: Wrench, label: "SERVICES", color: "hsl(45, 100%, 55%)", alien: "⬡",
    subItems: [
      { icon: Megaphone, label: "Marketing", color: "hsl(40, 80%, 55%)", description: "Growth strategy" },
      { icon: Scissors, label: "Editing", color: "hsl(36, 80%, 55%)", description: "Post production" },
      { icon: Paintbrush, label: "Design", color: "hsl(42, 70%, 60%)", description: "Visual crafting" },
      { icon: PenTool, label: "Drafting", color: "hsl(45, 90%, 55%)", description: "Content drafts" },
    ],
  },
  {
    icon: ShoppingBag, label: "MERCH", color: "hsl(38, 80%, 60%)", alien: "◬",
    subItems: [
      // { icon: Watch, label: "Belt", color: "hsl(45, 90%, 55%)", description: "Premium Reversible Belt" },
      // { icon: ShoppingBag, label: "Purse", color: "hsl(42, 80%, 55%)", description: "Antique Leather Wallet" },
      { icon: Shirt, label: "Tops", color: "hsl(42, 80%, 55%)", description: "Premium apparel" },
      { icon: Scissors, label: "Bottoms", color: "hsl(36, 80%, 55%)", description: "Styled comfort" },
      { icon: Watch, label: "Accessories", color: "hsl(45, 90%, 55%)", description: "Finishing touches" },
      { icon: Gem, label: "Underwear", color: "hsl(40, 75%, 55%)", description: "Essential luxury" },
      { icon: Glasses, label: "Eyewear", color: "hsl(44, 80%, 50%)", description: "Vision & style" },
      { icon: ShoppingCart, label: "All Items", color: "hsl(38, 70%, 55%)", description: "Full collection" },
    ],
  },
  {
    icon: CalendarClock, label: "BOOK", color: "hsl(44, 80%, 55%)", alien: "⏣",
    subItems: [
      { icon: MapPin, label: "Trip Together", color: "hsl(40, 85%, 55%)", description: "Travel experiences" },
      { icon: Clock, label: "Online Hours", color: "hsl(42, 80%, 55%)", description: "Schedule time" },
    ],
  },
];

/* ═══════════════ HELPER COMPONENTS ═══════════════ */

const GearSVG = ({ size = 500, className = "", style = {} }) => (
  <svg className={className} style={style} width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M50 15 L54 5 L58 15 L65 8 L63 18 L72 14 L67 23 L76 22 L69 29 L78 31 L70 35 L78 40 L69 41 L75 48 L66 46 L70 54 L62 50 L63 58 L56 53 L55 61 L50 55 L45 61 L44 53 L37 58 L38 50 L30 54 L34 46 L25 48 L31 41 L22 40 L30 35 L22 31 L31 29 L24 22 L33 23 L28 14 L37 18 L35 8 L42 15 L46 5 L50 15Z"
      stroke="hsla(42,80%,50%,.3)" strokeWidth="0.5" fill="hsla(42,80%,50%,.03)"
    />
    <circle cx="50" cy="50" r="18" stroke="hsla(42,80%,50%,.2)" strokeWidth="0.5" fill="none" />
    <circle cx="50" cy="50" r="10" stroke="hsla(42,80%,50%,.15)" strokeWidth="0.3" fill="hsla(42,80%,50%,.02)" />
  </svg>
);

const Particles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, left: `${Math.random() * 100}%`,
      duration: 8 + Math.random() * 12, delay: Math.random() * 10,
      size: 2 + Math.random() * 3,
    })), []);
  return <>{particles.map(p => <div key={p.id} className="omni-particle" style={{ left: p.left, width: p.size, height: p.size, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }} />)}</>;
};

/* ═══════════════ CIRCULAR WHEEL COMPONENT ═══════════════ */
const OmnitrixWheel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState("categories");
  const [subIndex, setSubIndex] = useState(0);

  // Interest Modal States
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestProduct, setInterestProduct] = useState("");
  const [interestForm, setInterestForm] = useState({
    name: "", email: "", phone: "",
    businessType: "Retail Store", estimatedQuantity: "", targetPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carousel state for multi-image products
  const [carouselIndex, setCarouselIndex] = useState(0);
  const walletImages = useMemo(() => [wallet1, wallet2, wallet3, wallet4, wallet5, wallet6, wallet7], []);

  // Fullscreen image viewer
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const [imgZoom, setImgZoom] = useState(1);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const openFullscreen = (src) => {
    setFullscreenImg(src);
    setImgZoom(1);
    setImgPos({ x: 0, y: 0 });
  };

  const closeFullscreen = () => {
    setFullscreenImg(null);
    setImgZoom(1);
    setImgPos({ x: 0, y: 0 });
  };

  // Auto-rotate carousel
  useEffect(() => {
    if (!showInterestModal || interestProduct !== "Purse") return;
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % walletImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [showInterestModal, interestProduct, walletImages.length]);

  // Reset carousel when modal opens
  useEffect(() => {
    if (showInterestModal) setCarouselIndex(0);
  }, [showInterestModal]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgZoom(prev => {
      const next = prev + (e.deltaY < 0 ? 0.3 : -0.3);
      const clamped = Math.min(5, Math.max(1, next));
      if (clamped === 1) setImgPos({ x: 0, y: 0 });
      return clamped;
    });
  }, []);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    setImgZoom(prev => {
      if (prev > 1) {
        setImgPos({ x: 0, y: 0 });
        return 1;
      }
      return 2.5;
    });
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (imgZoom <= 1) return;
    e.stopPropagation();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...imgPos };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [imgZoom, imgPos]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setImgPos({ x: posStart.current.x + dx, y: posStart.current.y + dy });
  }, []);

  const handlePointerUp = useCallback((e) => {
    isDragging.current = false;
  }, []);

  const handleInterestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5001/";
      const res = await fetch(`${baseUrl}merch/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...interestForm, product: interestProduct })
      });
      if (res.ok) {
        alert("Interest recorded! We will contact you soon.");
        setShowInterestModal(false);
        setInterestForm({ name: "", email: "", phone: "", businessType: "Retail Store", estimatedQuantity: "", targetPrice: "" });
      } else {
        alert("Failed to submit. Try again.");
      }
    } catch (err) {
       console.error(err);
       alert("Error submitting interest.");
    }
    setIsSubmitting(false);
  };


  const RADIUS = 120; // circle radius for category icons
  const COUNT = categories.length;
  const ANGLE_STEP = 360 / COUNT; // degrees between each item

  const navigate = useCallback((direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (mode === "categories") {
      setActiveIndex(prev => {
        let next = prev + direction;
        if (next < 0) next = COUNT - 1;
        if (next >= COUNT) next = 0;
        return next;
      });
    } else {
      const active = categories[activeIndex];
      if (direction === -1) {
        if (subIndex === 0) { setMode("categories"); setIsAnimating(false); return; }
        setSubIndex(p => p - 1);
      } else {
        if (subIndex < active.subItems.length - 1) setSubIndex(p => p + 1);
      }
    }
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, mode, activeIndex, subIndex, COUNT]);

  const handleDragEnd = useCallback((_, info) => {
    // Accept both vertical and horizontal swipes for circular feel
    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);
    const threshold = 30;

    if (absX > absY && absX > threshold) {
      // Horizontal swipe: right = next, left = prev
      navigate(info.offset.x < 0 ? 1 : -1);
    } else if (absY > threshold) {
      // Vertical swipe: up = next, down = prev
      navigate(info.offset.y < 0 ? 1 : -1);
    }
  }, [navigate]);

  const enterCategory = () => { setSubIndex(0); setMode("subItems"); };
  const goBack = () => setMode("categories");

  const active = categories[activeIndex];

  // Compute rotation offset — active item should be at the top (270°)
  const rotationOffset = -activeIndex * ANGLE_STEP;

  return (
    <div className="relative flex flex-col items-center select-none" style={{ touchAction: "none" }}>
      <AnimatePresence mode="wait">
        {mode === "categories" ? (
          /* ═══ CIRCULAR CATEGORY WHEEL ═══ */
          <motion.div
            key="cat-mode"
            className="flex flex-col items-center w-full"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
          >
            {/* Active label */}
            <motion.div
              key={activeIndex}
              className="font-orbitron text-lg font-bold tracking-[0.25em] shimmer-text mb-6"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {active.label}
            </motion.div>

            {/* Circular ring */}
            <div className="relative" style={{ width: RADIUS * 2 + 60, height: RADIUS * 2 + 60 }}>
              {/* Outer decorative ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "1px solid hsla(42,100%,55%,.1)",
                  boxShadow: "inset 0 0 40px hsla(42,100%,55%,.03)",
                }}
              />
              {/* Middle decorative ring */}
              <div
                className="absolute rounded-full"
                style={{
                  top: 10, left: 10, right: 10, bottom: 10,
                  border: "1px solid hsla(42,100%,55%,.06)",
                }}
              />

              {/* Rotating container for icons */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: rotationOffset }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              >
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  // Place each item around the circle, starting from top (270°)
                  const angle = (i * ANGLE_STEP - 90) * (Math.PI / 180);
                  const cx = RADIUS + 30; // center offset
                  const cy = RADIUS + 30;
                  const x = cx + RADIUS * Math.cos(angle);
                  const y = cy + RADIUS * Math.sin(angle);

                  return (
                    <motion.div
                      key={i}
                      className="absolute flex items-center justify-center cursor-pointer"
                      style={{
                        left: x - 24,
                        top: y - 24,
                        width: 48,
                        height: 48,
                      }}
                      onClick={() => {
                        if (i === activeIndex) enterCategory();
                        else { setActiveIndex(i); }
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {/* Counter-rotate to keep icons upright */}
                      <motion.div
                        animate={{ rotate: -rotationOffset }}
                        transition={{ type: "spring", stiffness: 180, damping: 22 }}
                        className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${i === activeIndex ? "neon-glow-gold" : ""}`}
                        style={{
                          background: i === activeIndex
                            ? "radial-gradient(circle at 35% 35%, hsl(0,0%,15%), hsl(0,0%,5%))"
                            : "hsl(0,0%,6%)",
                          border: i === activeIndex
                            ? "2px solid hsla(42,100%,55%,.7)"
                            : "1px solid hsl(0,0%,14%)",
                        }}
                      >
                        <Icon
                          size={i === activeIndex ? 22 : 18}
                          style={{ color: i === activeIndex ? "hsl(42,100%,55%)" : "hsl(0,0%,30%)" }}
                          strokeWidth={i === activeIndex ? 2 : 1.5}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Center dial — Omnitrix hourglass */}
              <div
                className="absolute rounded-full flex items-center justify-center alien-pulse"
                style={{
                  width: 72, height: 72,
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(circle at 40% 40%, hsl(0,0%,10%), hsl(0,0%,3%))",
                  border: "2px solid hsla(42,100%,55%,.4)",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <path d="M13 8 L20 20 L13 32 L27 32 L20 20 L27 8 Z"
                    fill="hsla(42,100%,55%,.15)" stroke="hsla(42,100%,55%,.6)" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="20" cy="20" r="3" fill="hsl(42,100%,55%)" />
                </svg>
              </div>
            </div>

            {/* Dot indicators — circular arrangement below */}
            <div className="flex gap-2 mt-6">
              {categories.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full cursor-pointer"
                  onClick={() => { if (i !== activeIndex) setActiveIndex(i); }}
                  animate={{
                    width: i === activeIndex ? 20 : 6,
                    height: 6,
                    background: i === activeIndex ? "hsl(42,100%,55%)" : "hsl(0,0%,18%)",
                    boxShadow: i === activeIndex ? "0 0 8px hsla(42,100%,55%,.5)" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              ))}
            </div>

            <p className="font-royal text-xs tracking-[0.2em] opacity-20 mt-3" style={{ color: "hsl(0,0%,55%)" }}>
              SWIPE TO ROTATE • TAP TO ENTER
            </p>
          </motion.div>
        ) : (
          /* ═══ SUB-ITEMS MODE ═══ */
          <motion.div
            key="sub-mode"
            className="flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Back button */}
            <motion.button
              onClick={goBack}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl font-orbitron text-xs tracking-wider mb-3 self-start"
              style={{
                background: "hsl(0,0%,6%)",
                border: "1px solid hsla(42,100%,55%,.3)",
                color: "hsl(42,100%,55%)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={16} /> BACK
            </motion.button>

            {/* Category label */}
            <div className="font-orbitron text-sm tracking-[0.2em] gold-gradient-text font-bold mb-1">
              {active.label} • {active.alien}
            </div>
            <div className="font-royal text-xs tracking-widest opacity-30 mb-3" style={{ color: "hsl(0,0%,55%)" }}>
              {subIndex + 1} / {active.subItems.length}
            </div>

            {/* Swipeable sub-item card */}
            <motion.div
              className="w-full relative"
              drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.12}
              onDragEnd={handleDragEnd}
              style={{ touchAction: "none", minHeight: 180 }}
            >
              <AnimatePresence mode="wait">
                {active.subItems.map((sub, i) => {
                  if (i !== subIndex) return null;
                  const SubIcon = sub.icon;
                  return (
                    <motion.div
                      key={sub.label}
                      className="w-full rounded-2xl relative overflow-hidden"
                      style={{ background: "hsl(0,0%,4%)", border: "1px solid hsla(42,100%,55%,.2)" }}
                      initial={{ opacity: 0, y: 30, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.97 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {/* Diagonal pattern */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{ backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 14px, hsl(42,100%,55%) 14px, hsl(42,100%,55%) 15px)` }}
                      />
                      {/* Corner accents */}
                      <div className="absolute top-2 left-2 w-5 h-5 border-t border-l rounded-tl" style={{ borderColor: "hsla(42,100%,55%,.35)" }} />
                      <div className="absolute top-2 right-2 w-5 h-5 border-t border-r rounded-tr" style={{ borderColor: "hsla(42,100%,55%,.35)" }} />
                      <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l rounded-bl" style={{ borderColor: "hsla(42,100%,55%,.25)" }} />
                      <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r rounded-br" style={{ borderColor: "hsla(42,100%,55%,.25)" }} />

                      {/* Content */}
                      <div className="relative z-10 p-6 flex items-center gap-5">
                        <motion.div
                          className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center float-soft"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, hsla(42,100%,55%,.2), hsl(0,0%,6%))`,
                            border: "1.5px solid hsla(42,100%,55%,.4)",
                            boxShadow: "0 0 20px hsla(42,100%,55%,.1)",
                          }}
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.05 }}
                        >
                          <SubIcon size={28} style={{ color: "hsl(42,100%,55%)" }} strokeWidth={1.5} />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <motion.h3
                            className="font-orbitron text-base font-bold tracking-[0.15em] gold-gradient-text"
                            initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.08 }}
                          >
                            {sub.label.toUpperCase()}
                          </motion.h3>
                          <motion.p
                            className="font-royal text-sm tracking-wider opacity-40 mt-1"
                            style={{ color: "hsl(0,0%,65%)" }}
                            initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 0.4 }}
                            transition={{ delay: 0.12 }}
                          >
                            {sub.description}
                          </motion.p>
                          <motion.button
                            onClick={() => {
                              if (sub.label === "Belt" || sub.label === "Purse") {
                                setInterestProduct(sub.label);
                                setShowInterestModal(true);
                              } else {
                                // Default select action
                              }
                            }}
                            className="mt-3 px-6 py-2 rounded-lg font-orbitron text-xs tracking-[0.15em] font-bold"
                            style={{
                              background: "linear-gradient(135deg, hsl(36,100%,40%), hsl(42,100%,55%), hsl(45,100%,70%))",
                              color: "hsl(0,0%,5%)",
                              boxShadow: "0 2px 12px hsla(42,100%,55%,.25)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                          >
                            SELECT
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Nav arrows + dots */}
            <div className="flex items-center gap-3 mt-4">
              <motion.button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "hsl(0,0%,6%)", border: "1px solid hsla(42,100%,55%,.25)", color: "hsl(42,100%,55%)" }}
                whileTap={{ scale: 0.85 }}
              >
                <ChevronUp size={16} />
              </motion.button>
              <div className="flex gap-1.5">
                {active.subItems.map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full cursor-pointer"
                    onClick={() => setSubIndex(i)}
                    animate={{
                      width: i === subIndex ? 18 : 5, height: 5,
                      background: i === subIndex ? "hsl(42,100%,55%)" : "hsl(0,0%,18%)",
                      boxShadow: i === subIndex ? "0 0 6px hsla(42,100%,55%,.5)" : "none",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                ))}
              </div>
              <motion.button
                onClick={() => navigate(1)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "hsl(0,0%,6%)", border: "1px solid hsla(42,100%,55%,.25)", color: "hsl(42,100%,55%)" }}
                whileTap={{ scale: 0.85 }}
              >
                <ChevronDown size={16} />
              </motion.button>
            </div>

            <p className="font-royal text-xs mt-2 tracking-[0.2em] opacity-20" style={{ color: "hsl(0,0%,55%)" }}>
              ↑ BACK • SWIPE ↕ • NEXT ↓
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interest Form Modal */}
      <AnimatePresence>
        {showInterestModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#111] border border-[hsl(42,100%,55%,.4)] rounded-2xl w-full max-w-sm relative overflow-hidden"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ maxHeight: "90vh" }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowInterestModal(false)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                style={{ background: "hsla(0,0%,0%,.6)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Scrollable content */}
              <div className="overflow-y-auto" style={{ maxHeight: "90vh" }}>

                {/* Image section */}
                <div className="w-full">
                  {interestProduct === "Belt" && (
                    <img src={belt1} alt="Belt" className="w-full h-48 object-cover cursor-pointer" onClick={() => openFullscreen(belt1)} />
                  )}
                  {interestProduct === "Purse" && (
                    <div className="relative">
                      <div className="w-full h-48 relative overflow-hidden bg-black">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={carouselIndex}
                            src={walletImages[carouselIndex]}
                            alt={`Wallet ${carouselIndex + 1}`}
                            className="w-full h-48 object-cover cursor-pointer absolute inset-0"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => openFullscreen(walletImages[carouselIndex])}
                          />
                        </AnimatePresence>
                      </div>
                      <div className="flex gap-1.5 justify-center py-2 bg-[#111]">
                        {walletImages.map((_, i) => (
                          <motion.div
                            key={i}
                            className="rounded-full cursor-pointer"
                            onClick={() => setCarouselIndex(i)}
                            animate={{
                              width: i === carouselIndex ? 18 : 6, height: 6,
                              background: i === carouselIndex ? "hsl(42,100%,55%)" : "hsl(0,0%,25%)",
                              boxShadow: i === carouselIndex ? "0 0 6px hsla(42,100%,55%,.5)" : "none",
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product details */}
                <div className="px-5 pt-3 pb-2 border-b border-[#222]">
                  <h2 className="font-orbitron text-lg text-[hsl(42,100%,55%)] font-bold tracking-wider uppercase">
                    {interestProduct === "Belt" ? "GRIT Reversible Belt" : "GRIT Antique Wallet"}
                  </h2>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    {interestProduct === "Belt"
                      ? "Premium PU Leather • Reversible Black & Brown • Elegant Metal Buckle • Durable & Lightweight"
                      : "100% Original Leather • 6 Card Slots • 2 Currency Compartments • 2 Secret Compartments • Slim Design"
                    }
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleInterestSubmit} className="px-5 py-4 flex flex-col gap-4 text-left">

                  {/* Business Type */}
                  <div>
                    <label className="block text-xs font-orbitron text-gray-400 mb-2 tracking-widest">BUSINESS TYPE</label>
                    <div className="flex flex-col gap-2">
                      {["Retail Store", "Distributor", "Online Seller", "Others"].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                          <input
                            type="radio" name="businessType"
                            checked={interestForm.businessType === type}
                            onChange={() => setInterestForm({ ...interestForm, businessType: type })}
                            className="accent-[hsl(42,100%,55%)]" style={{ accentColor: "hsl(42,100%,55%)" }}
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Quantity */}
                  <div>
                    <label className="block text-xs font-orbitron text-gray-400 mb-1 tracking-widest">ESTIMATED MONTHLY QTY</label>
                    <input
                      type="text"
                      placeholder="e.g. 50, 100, 500+"
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[hsl(42,100%,55%)] transition-colors"
                      value={interestForm.estimatedQuantity}
                      onChange={(e) => setInterestForm({ ...interestForm, estimatedQuantity: e.target.value })}
                    />
                  </div>

                  {/* Target Price */}
                  <div>
                    <label className="block text-xs font-orbitron text-gray-400 mb-1 tracking-widest">TARGET PRICE PER UNIT</label>
                    <select
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[hsl(42,100%,55%)] transition-colors appearance-none"
                      value={interestForm.targetPrice}
                      onChange={(e) => setInterestForm({ ...interestForm, targetPrice: e.target.value })}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                    >
                      <option value="">Select price range</option>
                      <option value="Under ₹200">Under ₹200</option>
                      <option value="₹200 - ₹500">₹200 - ₹500</option>
                      <option value="₹500 - ₹1000">₹500 - ₹1000</option>
                      <option value="₹1000+">₹1000+</option>
                    </select>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#222] pt-3">
                    <label className="block text-xs font-orbitron text-gray-400 mb-3 tracking-widest">CONTACT DETAILS</label>

                    <div className="flex flex-col gap-3">
                      <input
                        type="text" required placeholder="Name"
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[hsl(42,100%,55%)] transition-colors"
                        value={interestForm.name}
                        onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                      />
                      <input
                        type="tel" required placeholder="Phone"
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[hsl(42,100%,55%)] transition-colors"
                        value={interestForm.phone}
                        onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                      />
                      <input
                        type="email" required placeholder="Email"
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[hsl(42,100%,55%)] transition-colors"
                        value={interestForm.email}
                        onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest text-black transition-all mt-1"
                    style={{
                      background: isSubmitting ? "#555" : "linear-gradient(135deg, hsl(36,100%,40%), hsl(42,100%,55%))",
                      boxShadow: isSubmitting ? "none" : "0 2px 16px hsla(42,100%,55%,.3)",
                    }}
                  >
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                  </button>
                </form>

                {/* See More */}
                <div className="px-5 pb-5 pt-2 text-center">
                  <button
                    type="button"
                    className="text-sm font-orbitron tracking-wider text-[hsl(42,100%,55%)] opacity-70 hover:opacity-100 transition-opacity"
                  >
                    See More
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {fullscreenImg && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeFullscreen}
            onWheel={handleWheel}
            style={{ touchAction: "none" }}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-[hsl(42,100%,55%)] transition-colors"
              style={{
                background: "hsla(0,0%,10%,.8)",
                border: "1px solid hsla(42,100%,55%,.4)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Zoom level indicator */}
            {imgZoom > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full font-orbitron text-xs tracking-widest"
                style={{ background: "hsla(0,0%,10%,.8)", border: "1px solid hsla(42,100%,55%,.3)", color: "hsl(42,100%,55%)" }}
              >
                {Math.round(imgZoom * 100)}%
              </div>
            )}

            {/* Zoomable Image */}
            <motion.img
              src={fullscreenImg}
              alt="Fullscreen view"
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg select-none"
              style={{
                transform: `scale(${imgZoom}) translate(${imgPos.x / imgZoom}px, ${imgPos.y / imgZoom}px)`,
                cursor: imgZoom > 1 ? "grab" : "zoom-in",
                transition: isDragging.current ? "none" : "transform 0.15s ease-out",
              }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleDoubleClick}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════ MAIN PAGE ═══════════════ */
const OmnitrixPage = () => {
  const history = useHistory();

  return (
    <div className="omni-bg">
      <GearSVG size={600} className="omni-gear" style={{ top: "-10%", right: "-12%", position: "fixed" }} />
      <GearSVG size={450} className="omni-gear omni-gear-reverse" style={{ bottom: "-8%", left: "-10%", position: "fixed" }} />
      <Particles />

      <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 py-8 min-h-screen flex flex-col">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <button className="omni-back" onClick={() => history.goBack()}>
            <ArrowLeft size={18} /> <span>Back</span>
          </button>
        </motion.div>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-4"
        >
          <h1
            className="font-orbitron text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{
              color: "hsl(42,100%,55%)",
              textShadow: "0 0 15px hsla(42,100%,55%,.5), 0 0 40px hsla(42,100%,55%,.2)",
            }}
          >
            OMNITRICKS
          </h1>
          <p className="text-gray-500 mt-1 text-sm font-royal tracking-wide">
            Rotate to explore. <span style={{ color: "hsl(42,100%,55%)" }} className="font-semibold">Tap to enter.</span>
          </p>
          <hr className="omni-heading-line mt-2" />
        </motion.section>

        {/* Wheel container */}
        <div className="flex-1 flex items-start justify-center">
          <motion.div
            className="w-full max-w-md rounded-3xl p-6 sm:p-8 watch-bezel"
            style={{ background: "hsl(0,0%,3%)" }}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <OmnitrixWheel />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 mb-4 text-center"
        >
          <hr className="omni-heading-line mb-3" />
          <p className="text-gray-700 text-xs tracking-widest uppercase font-orbitron">
            ⚡ Omnitrix Systems™ ⚡
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default OmnitrixPage;
