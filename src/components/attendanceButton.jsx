import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Pen, QrCode, Check, ChevronLeft, RefreshCcw } from "lucide-react";

// --- Selfie Component ---
const SelfieView = ({ onBack, onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied or failed", err);
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL("image/png"));
    }
  };

  const retakePhoto = () => setPhoto(null);

  return (
    <motion.div
        key="selfie"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full rounded-[32px] p-6 lg:p-8 flex flex-col border border-white/10"
        style={{
          background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
          backdropFilter: "blur(20px)",
          color: "white"
        }}
    >
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-semibold text-lg flex-1">Take a Selfie</h3>
      </div>
      
      <div className="w-full aspect-[3/4] bg-slate-800 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden border border-white/5">
        {!photo ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover bg-black" />
        ) : (
            <img src={photo} alt="Selfie" className="w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {!photo ? (
          <button onClick={takePhoto} className="w-full py-4 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors font-semibold shadow-[0_0_20px_rgba(168,85,247,0.3)] flex justify-center items-center gap-2">
            <Camera size={20} /> Capture
          </button>
      ) : (
          <div className="flex gap-4">
              <button onClick={retakePhoto} className="flex-1 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors font-semibold flex justify-center items-center gap-2">
                <RefreshCcw size={18} /> Retake
              </button>
              <button onClick={onSuccess} className="flex-1 py-4 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors font-semibold shadow-[0_0_20px_rgba(168,85,247,0.3)] flex justify-center items-center gap-2">
                 Submit
              </button>
          </div>
      )}
    </motion.div>
  );
};

// --- Signature Component ---
const SignatureView = ({ onBack, onSuccess }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#ffffff";
    }
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    // Determine scale based on internal vs styling dimension
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (e.cancelable) e.preventDefault(); // prevent scroll on touch
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false); // reset state
    ctx.beginPath(); // Reset paths cleanly
  };

  return (
    <motion.div
        key="signature"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full rounded-[32px] p-6 lg:p-8 flex flex-col border border-white/10"
        style={{
          background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
          backdropFilter: "blur(20px)",
          color: "white"
        }}
    >
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-semibold text-lg flex-1">Your Signature</h3>
        {hasDrawn && (
            <button onClick={clearSignature} className="text-sm text-slate-300 hover:text-white transition-colors">
              Clear
            </button>
        )}
      </div>
      
      <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center mb-6 border border-white/10 relative overflow-hidden">
         {!hasDrawn && <span className="text-slate-500 font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none">Sign Here</span>}
         <canvas
            ref={canvasRef}
            width={600} // high res internal canvas
            height={300}
            className="w-full h-full cursor-crosshair touch-none"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
         />
      </div>
      
      <button 
        onClick={() => { if(hasDrawn) onSuccess() }}
        disabled={!hasDrawn}
        className={`w-full py-4 rounded-xl transition-colors font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white ${hasDrawn ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-700 opacity-50 cursor-not-allowed'}`}>
        Submit Signature
      </button>
    </motion.div>
  );
};


const AttendanceButton = ({setShowAttendanceButton}) => {
  const [activeView, setActiveView] = useState("main"); // 'main', 'selfie', 'signature', 'success'
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const HOLD_DURATION = 2000; // 2 seconds
  const UPDATE_INTERVAL = 20; // 50 times per second

  const handlePointerDown = () => {
    // Prevent default touch behavior if needed, though mostly handled by touch-action
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
      
      if (progress >= 100) {
        clearInterval(holdTimerRef.current);
        setIsHolding(false);
        setActiveView("success");
      }
    }, UPDATE_INTERVAL);
  };

  const handlePointerUpOrLeave = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    if (isHolding && holdProgress < 100) {
      setIsHolding(false);
      setHoldProgress(0);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  // Screenshot detector (Desktop approximations)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Windows PrintScreen
      if (e.key === "PrintScreen") {
        setActiveView("success");
      }
      // Windows Snipping Tool (Win + Shift + S)
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "s") {
        setActiveView("success");
      }
      // Mac Screenshot (Cmd + Shift + 3, 4, 5)
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key)) {
        setActiveView("success");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleReset = () => {
    setActiveView("main");
    setHoldProgress(0);
  };

  const handleTheatreClick = () => {
    setActiveView("theatre_loading");
    setTimeout(() => {
      window.location.href = "https://www.creatorcosmos.com/explorer";
    }, 2000);
  };

  // SVG parameters for progress ring
  const circleRadius = 100;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (holdProgress / 100) * circleCircumference;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center mx-auto w-full max-w-sm mt-4 mb-8 font-sans">
      <AnimatePresence mode="wait">
        {activeView === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex flex-col items-center rounded-[32px] p-6 lg:p-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
              color: "white"
            }}
          >
            {/* Header Content */}
            <div className="text-center w-full mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Mark Your Attendance
              </h2>
        <button className="fixed right-10 top-4 z-50 text-white" onClick={() => setShowAttendanceButton()}>X</button>

              <p className="text-slate-400 text-sm">Choose a method below</p>
            </div>

            {/* Top Cards for Selfie & Signature */}
            <div className="flex gap-4 w-full mb-6">
              {/* Selfie */}
              <button
                onClick={() => setActiveView("selfie")}
                className="flex-1 rounded-2xl flex flex-col items-center justify-center p-4 gap-2 transition-all duration-300 relative overflow-hidden group border border-white/5 bg-white/5 hover:bg-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="bg-purple-500/20 p-3 rounded-full text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-all">
                  <Camera size={24} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-slate-300">Selfie</span>
              </button>

              {/* Signature */}
              <button
                onClick={() => setActiveView("signature")}
                className="flex-1 rounded-2xl flex flex-col items-center justify-center p-4 gap-2 transition-all duration-300 relative overflow-hidden group border border-white/5 bg-white/5 hover:bg-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400 group-hover:scale-110 group-hover:text-emerald-300 transition-all">
                  <Pen size={24} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-slate-300">Signature</span>
              </button>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4 w-full mb-6 opacity-60 text-xs text-slate-500 tracking-wider">
              <div className="flex-1 h-px bg-slate-700/50"></div>
              <span>OR</span>
              <div className="flex-1 h-px bg-slate-700/50"></div>
            </div>

            {/* QR Scanner Block */}
            <div
              className={`w-full relative rounded-[28px] overflow-hidden transition-all duration-500 user-select-none touch-action-none cursor-pointer border ${isHolding ? 'border-teal-500/50 shadow-[0_0_30px_rgba(20,184,166,0.3)]' : 'border-white/10 hover:border-white/20'}`}
              style={{
                background: "radial-gradient(circle at center, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.95) 100%)",
                touchAction: 'none'
              }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUpOrLeave}
              onPointerLeave={handlePointerUpOrLeave}
              onPointerCancel={handlePointerUpOrLeave}
            >
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
                  <circle
                    cx="120"
                    cy="120"
                    r={circleRadius}
                    className="stroke-teal-500/20 drop-shadow-[0_0_10px_rgba(20,184,166,0.4)]"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r={circleRadius}
                    className="stroke-teal-400 transition-all drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: isHolding ? 'stroke-dashoffset 0.05s linear' : 'stroke-dashoffset 0.3s ease-out' }}
                  />
                </svg>
              </div>
              
              <div className="flex flex-col items-center justify-center py-4 relative z-10 gap-6">
                <div className={`p-4 bg-white rounded-[24px] shadow-xl transition-all duration-500 ${isHolding ? 'scale-[0.95]' : 'scale-100 hover:scale-[1.02]'}`}>
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MarkAttendance&color=0f172a&bgcolor=ffffff" 
                    alt="Realistic QR Code" 
                    className="w-24 h-24 opacity-90 pointer-events-none"
                    draggable={false}
                  />
                </div>
                <div className="text-center px-6">
                  <p className="text-sm font-medium text-slate-300">
                    Press & Hold QR for 2 sec
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    to mark your attendance
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Selfie View */}
        {activeView === "selfie" && (
            <SelfieView 
              onBack={() => setActiveView("main")} 
              onSuccess={() => setActiveView("success")} 
            />
        )}

        {/* Signature View */}
        {activeView === "signature" && (
            <SignatureView 
              onBack={() => setActiveView("main")} 
              onSuccess={() => setActiveView("success")} 
            />
        )}

        {/* Success View */}
        {activeView === "success" && (
          <motion.div
            key="success"
            className="w-full flex flex-col items-center justify-center rounded-[32px] p-10 border border-teal-500/30"
            style={{
              background: "linear-gradient(145deg, rgba(13, 40, 40, 0.9), rgba(15, 23, 42, 0.9))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 50px -10px rgba(20,184,166,0.3)",
              color: "white"
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.5)] mb-6"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Attendance Marked!
            </motion.h2>
        <button className="fixed right-10 top-4 z-50 text-white" onClick={() => setShowAttendanceButton()}>X</button>

            <motion.p
              className="text-teal-200/80 mb-8 font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric"
              })}
            </motion.p>

            <motion.button
              onClick={handleReset}
              className="px-6 py-2 text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Mark again
            </motion.button>

            <div onClick={handleTheatreClick} className="no-underline font-bold rounded-lg text-lg bg-gradient-to-r from-teal-500 to-cyan-700 px-3 py-1 text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all">ENTER CREATOR THEATER</div>

            {/* Subtle Confetti Particles background */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? "#2dd4bf" : "#38bdf8",
                  zIndex: -1
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0.8 }}
                animate={{
                  x: Math.cos((i * 30 * Math.PI) / 180) * (90 + Math.random() * 40),
                  y: Math.sin((i * 30 * Math.PI) / 180) * (90 + Math.random() * 40),
                  scale: [0, 1.5, 0],
                  opacity: [0.8, 0]
                }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}

        {activeView === "theatre_loading" && (
          <motion.div
            key="theatre_loading"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full flex flex-col items-center justify-center rounded-[32px] p-10 border border-cyan-500/30 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 50px -10px rgba(6, 182, 212, 0.3)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-6"
            />
            
            <h2 className="text-xl font-bold tracking-tight mb-2 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
              Spawnsered by CJP
            </h2>
            <p className="text-slate-400 text-xs text-center leading-relaxed">
              Preparing your premium explorer experience. Please wait.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceButton;