import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Import proofs
import ss01 from "../../assets/ss01.jpg";
import ss02 from "../../assets/ss02.jpg";
import ss03 from "../../assets/ss03.jpg";
import ss04 from "../../assets/ss04.jpg";
import ss05 from "../../assets/ss05.jpg";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/";

const loadCashfreeSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.head.appendChild(script);
  });
};

const resolveVideoEmbed = (url) => {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([-\w]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Instagram
  if (url.includes('instagram.com')) return { type: 'link', url };
  // Twitter/X
  if (url.includes('twitter.com') || url.includes('x.com')) return { type: 'link', url };
  // Direct video file
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { type: 'video', url };
  // Fallback
  return { type: 'link', url };
};

const Spotlight = ({ onVideosFetched, onIndexChange }) => {
  const [spotlightVideos, setSpotlightVideos] = useState([]);
  const [currentSpotlightIndex, setCurrentSpotlightIndex] = useState(0);

  // VIP modal states
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipForm, setVipForm] = useState({
    name: "",
    email: "",
    mobile: "",
    ytLink: ""
  });
  const [vipSubmitting, setVipSubmitting] = useState(false);
  const [vipStep, setVipStep] = useState("form"); // form, paying, success, pending
  const [vipOrderId, setVipOrderId] = useState("");
  const [vipResult, setVipResult] = useState(null);

  // Audition modal states
  const [showAuditionModal, setShowAuditionModal] = useState(false);
  const [auditionForm, setAuditionForm] = useState({ name: "", creatorId: "", email: "", videoLink: "" });
  const [auditionVideoEmbed, setAuditionVideoEmbed] = useState(null);
  const [auditionSubmitting, setAuditionSubmitting] = useState(false);
  const [auditionDone, setAuditionDone] = useState(false);

  // How it works modal
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  const pollTimerRef = useRef(null);

  // Fetch active spotlight videos
  const fetchVideos = () => {
    axios.get(`${API_URL}payment/spotlight/active`)
      .then(res => {
        const videos = res.data.videos || [];
        setSpotlightVideos(videos);
        setCurrentSpotlightIndex(0);
        if (onVideosFetched) {
          onVideosFetched(videos);
        }
      })
      .catch(err => {
        console.error("Failed to fetch spotlight videos", err);
      });
  };

  useEffect(() => {
    fetchVideos();
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  // Handle video rotation
  useEffect(() => {
    if (spotlightVideos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSpotlightIndex(prev => {
        const nextIndex = (prev + 1) % spotlightVideos.length;
        if (onIndexChange) {
          onIndexChange(nextIndex);
        }
        return nextIndex;
      });
    }, 7000);
    return () => clearInterval(interval);
  }, [spotlightVideos, onIndexChange]);

  const openVipModal = () => {
    setVipForm({ name: "", email: "", mobile: "", ytLink: "" });
    setVipResult(null);
    setVipSubmitting(false);
    setVipStep("form");
    setShowVipModal(true);
  };

  const closeVipModal = () => {
    setShowVipModal(false);
  };

  const openAuditionModal = () => {
    setAuditionForm({ name: "", creatorId: "", email: "", videoLink: "" });
    setAuditionVideoEmbed(null);
    setAuditionSubmitting(false);
    setAuditionDone(false);
    setShowAuditionModal(true);
  };

  const closeAuditionModal = () => {
    setShowAuditionModal(false);
  };

  const openHowItWorksModal = () => {
    setShowHowItWorksModal(true);
  };

  const closeHowItWorksModal = () => {
    setShowHowItWorksModal(false);
  };

  const handleVipChange = (e) => {
    const { name, value } = e.target;
    setVipForm(prev => ({ ...prev, [name]: value }));
  };

  const handleVipSubmit = async (e) => {
    e.preventDefault();
    setVipSubmitting(true);
    setVipResult(null);

    const { name, email, mobile, ytLink } = vipForm;

    try {
      const { data } = await axios.post(`${API_URL}payment/createOrder`, {
        customer_name: name,
        customer_email: email,
        customer_phone: mobile,
        amount: 20000,
        OrderType: "vip_spotlight",
        promotion_data: {
          title: "VIP Spotlight",
          linkUrl: ytLink,
          imageUrl: null,
        },
      });

      if (!data.success || !data.payment_session_id) {
        throw new Error("Failed to create VIP order");
      }

      setVipOrderId(data.order_id);
      setVipStep("paying");

      const Cashfree = await loadCashfreeSDK();
      const cashfree = Cashfree({ mode: "sandbox" });

      cashfree
        .checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal",
        })
        .then(() => {
          pollVipPaymentStatus(data.order_id);
        });
    } catch (error) {
      console.error("VIP Payment Error:", error);
      setVipStep("form");
      setVipSubmitting(false);
      setVipResult({
        success: false,
        message: error?.response?.data?.error || error.message || "Payment failed",
      });
    }
  };

  const pollVipPaymentStatus = (orderIdToPoll) => {
    let pollCount = 0;
    const MAX_POLLS = 15;
    const POLL_INTERVAL = 3000;

    const poll = async () => {
      pollCount++;

      try {
        const { data } = await axios.get(
          `${API_URL}payment/verify/${orderIdToPoll}`
        );

        if (data.order_status === "PAID") {
          setVipStep("success");
          setVipSubmitting(false);
          setVipResult({ success: true, message: "VIP Payment successful & Spotlight Video is live! 🎉" });
          fetchVideos();
          return;
        }

        if (data.order_status === "EXPIRED" || data.order_status === "TERMINATED") {
          setVipStep("form");
          setVipSubmitting(false);
          setVipResult({ success: false, message: "Payment failed or expired. Please try again." });
          return;
        }

        if (pollCount < MAX_POLLS) {
          pollTimerRef.current = setTimeout(poll, POLL_INTERVAL);
        } else {
          setVipStep("pending");
          setVipSubmitting(false);
        }
      } catch (error) {
        console.error("Verification poll error:", error);
      }
    };

    poll();
  };

  const handleAuditionField = (field, value) => {
    setAuditionForm(prev => ({ ...prev, [field]: value }));
    if (field === 'videoLink') {
      setAuditionVideoEmbed(resolveVideoEmbed(value));
    }
  };

  const handleAuditionSubmit = async (e) => {
    e.preventDefault();
    setAuditionSubmitting(true);
    try {
      await axios.post(`${API_URL}api/audition`, auditionForm);
    } catch (_) { /* best-effort */ }
    setAuditionSubmitting(false);
    setAuditionDone(true);
  };

  return (
    <>
      {/* SPOTLIGHT SECTION */}
      <div className="relative overflow-hidden w-full max-w-[1200px] mx-auto my-[20px] md:my-[30px] p-6 bg-gradient-to-br from-[#090d22] to-[#15103a] border-2 border-violet-500 rounded-[24px] shadow-[0_0_25px_rgba(139,92,246,0.25)] text-center">
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_rgba(139,92,246,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <button 
          className="absolute top-4 right-4 bg-white/10 border border-white/15 text-violet-400 rounded-full w-[38px] h-[38px] flex items-center justify-center cursor-pointer transition-all duration-300 z-10 p-0 outline-none hover:bg-violet-500/25 hover:border-violet-500 hover:text-white hover:rotate-12 hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] active:scale-95" 
          onClick={openHowItWorksModal}
          title="How it Works"
          aria-label="How it Works"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
        <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-extrabold text-[16px] px-4 py-1.5 rounded-full uppercase tracking-[1.5px] shadow-[0_0_15px_rgba(250,204,21,0.4)] mb-3 font-sans">
          SPOTLIGHT ZONE ⚡
        </div>
        <p className="text-slate-400 text-[16px] max-w-[600px] mx-auto mb-3 leading-normal font-sans">
          Get your YouTube Video featured in the spotlight! Millions of views & impressions guaranteed.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button 
            className="flex items-center gap-2 bg-gradient-to-br from-amber-500 to-amber-700 text-white border border-amber-400 font-bold text-[18px] px-7 py-3.5 rounded-[14px] shadow-[0_4px_15px_rgba(217,119,6,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(217,119,6,0.5)] hover:from-amber-400 hover:to-amber-500" 
            onClick={openVipModal}
          >
            👑 VIP Spotlight (₹20,000)
          </button>
          <button 
            className="flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border border-indigo-400 font-bold text-[18px] px-7 py-3.5 rounded-[14px] shadow-[0_4px_15px_rgba(79,70,229,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)] hover:from-indigo-400 hover:to-indigo-500" 
            onClick={openAuditionModal}
          >
            🚀 Audition (Promote it)
          </button>
        </div>
      </div>

      {/* VIP MODAL */}
      {showVipModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="relative overflow-hidden w-full max-w-[520px] bg-slate-900 border-2 border-amber-500 rounded-[24px] shadow-[0_0_35px_rgba(245,158,11,0.25)] p-8">
            <button 
              className="absolute top-4 right-4 bg-slate-800 border-none text-slate-400 text-[20px] cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-slate-700 hover:text-white" 
              onClick={closeVipModal}
            >
              ✕
            </button>
            
            {vipStep === "form" && (
              <form onSubmit={handleVipSubmit} className="flex flex-col">
                <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1.5 font-sans">👑 VIP Spotlight Feature</h2>
                <p className="text-slate-400 text-sm mb-6 font-sans">Feature your video on our splash page for 25 hours.</p>
                
                <div className="flex flex-col mb-[18px]">
                  <label className="text-slate-300 text-sm font-semibold mb-1.5 text-left font-sans">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="bg-slate-800 border border-slate-600 text-white text-[15px] px-4 py-3 rounded-lg outline-none transition-colors duration-200 focus:border-amber-500 w-full"
                    type="text"
                    name="name"
                    value={vipForm.name}
                    onChange={handleVipChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="flex flex-col mb-[18px]">
                  <label className="text-slate-300 text-sm font-semibold mb-1.5 text-left font-sans">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="bg-slate-800 border border-slate-600 text-white text-[15px] px-4 py-3 rounded-lg outline-none transition-colors duration-200 focus:border-amber-500 w-full"
                    type="tel"
                    name="mobile"
                    value={vipForm.mobile}
                    onChange={handleVipChange}
                    required
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit phone number"
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div className="flex flex-col mb-[18px]">
                  <label className="text-slate-300 text-sm font-semibold mb-1.5 text-left font-sans">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="bg-slate-800 border border-slate-600 text-white text-[15px] px-4 py-3 rounded-lg outline-none transition-colors duration-200 focus:border-amber-500 w-full"
                    type="email"
                    name="email"
                    value={vipForm.email}
                    onChange={handleVipChange}
                    required
                    placeholder="e.g. name@example.com"
                  />
                </div>

                <div className="flex flex-col mb-[18px]">
                  <label className="text-slate-300 text-sm font-semibold mb-1.5 text-left font-sans">
                    YouTube Video URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="bg-slate-800 border border-slate-600 text-white text-[15px] px-4 py-3 rounded-lg outline-none transition-colors duration-200 focus:border-amber-500 w-full"
                    type="url"
                    name="ytLink"
                    value={vipForm.ytLink}
                    onChange={handleVipChange}
                    required
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="bg-indigo-950/80 border border-indigo-905 p-4 rounded-xl flex justify-between items-center mb-6">
                  <span className="text-indigo-400 font-semibold font-sans">VIP Spotlight Fee</span>
                  <strong className="text-amber-400 text-xl font-bold font-sans">₹20,000</strong>
                </div>

                {vipResult && !vipResult.success && (
                  <div className="p-4 rounded-lg bg-red-500/15 border border-red-500 text-red-300 text-sm mb-4 text-left font-sans">
                    {vipResult.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={vipSubmitting} 
                  className="w-full bg-gradient-to-br from-amber-500 to-amber-700 text-white border-none font-bold text-base py-3.5 rounded-xl cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {vipSubmitting ? "Processing..." : "Pay ₹20,000 & Feature Video"}
                </button>
              </form>
            )}

            {vipStep === "paying" && (
              <div className="flex flex-col items-center py-10 text-white font-sans">
                <div className="border-4 border-white/10 w-[50px] h-[50px] rounded-full border-l-amber-500 animate-spin" />
                <h3 className="text-2xl font-bold mt-4 mb-2">Processing VIP Payment...</h3>
                <p className="text-slate-400 text-sm text-center">Please complete checkout in the payment window.</p>
              </div>
            )}

            {vipStep === "success" && (
              <div className="flex flex-col items-center py-10 text-white font-sans">
                <div className="text-[64px] mb-4">🎉</div>
                <h3 className="text-2xl font-bold mt-4 mb-2">VIP Spotlight Active!</h3>
                <p className="text-slate-400 text-sm text-center mb-6">{vipResult?.message || "Your video is now featured in the spotlight zone."}</p>
                <button 
                  type="button" 
                  onClick={closeVipModal} 
                  className="w-full bg-gradient-to-br from-amber-500 to-amber-700 text-white border-none font-bold text-base py-3.5 rounded-xl cursor-pointer transition-opacity duration-200 hover:opacity-90"
                >
                  Done
                </button>
              </div>
            )}

            {vipStep === "pending" && (
              <div className="flex flex-col items-center py-10 text-white font-sans">
                <div className="text-[64px] mb-4 animate-pulse">⏳</div>
                <h3 className="text-2xl font-bold mt-4 mb-2">Payment Verification Pending</h3>
                <p className="text-slate-400 text-sm text-center mb-6">Your payment is still being processed. It will be verified shortly.</p>
                <button 
                  type="button" 
                  onClick={closeVipModal} 
                  className="w-full bg-gradient-to-br from-amber-500 to-amber-700 text-white border-none font-bold text-base py-3.5 rounded-xl cursor-pointer transition-opacity duration-200 hover:opacity-90"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUDITION MODAL */}
      {showAuditionModal && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-[fadeIn_0.25s_ease_both]" 
          onClick={(e) => { if (e.target.classList.contains('fixed')) closeAuditionModal(); }}
        >
          <div className="relative bg-gradient-to-b from-[#0f0f1a] to-[#12121f] border border-white/10 rounded-2xl p-6 w-full max-w-[440px] max-h-[92vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.7),_0_0_0_1px_rgba(139,92,246,0.15)] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <button 
              className="absolute top-4 right-4 bg-slate-800 border-none text-slate-400 text-[20px] cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-slate-700 hover:text-white" 
              onClick={closeAuditionModal}
            >
              ✕
            </button>

            {auditionDone ? (
              <div className="flex flex-col items-center text-center py-5 gap-3">
                <div className="text-[64px] mb-4 animate-[star-out_0.5s_ease_both]">🎬</div>
                <h2 className="text-white text-xl font-bold">You're in the Queue!</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-2">We've received your audition. We'll review your video and reach out soon. Stay tuned 🚀</p>
                <button 
                  className="w-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-none font-bold text-base py-3.5 rounded-xl cursor-pointer transition-opacity duration-200 hover:opacity-90" 
                  onClick={closeAuditionModal}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-[22px]">
                  <span className="inline-block bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-[10px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full mb-3">
                    🎬 AUDITION
                  </span>
                  <h2 className="text-white text-2xl font-bold mb-1.5 font-sans">Apply for Spotlight</h2>
                  <p className="text-slate-400 text-sm mb-6 font-sans">Submit your video link to get featured in front of millions</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleAuditionSubmit}>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">Full Name</label>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg text-white text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/10 w-full"
                      type="text"
                      placeholder="Your name"
                      value={auditionForm.name}
                      onChange={e => handleAuditionField('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">Creator ID / Handle</label>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg text-white text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/10 w-full"
                      type="text"
                      placeholder="@yourchannel or creator ID"
                      value={auditionForm.creatorId}
                      onChange={e => handleAuditionField('creatorId', e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">Email</label>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg text-white text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/10 w-full"
                      type="email"
                      placeholder="you@email.com"
                      value={auditionForm.email}
                      onChange={e => handleAuditionField('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">Video Link</label>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg text-white text-sm px-4 py-3 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-violet-500/10 w-full"
                      type="url"
                      placeholder="Paste YouTube / Instagram / video URL"
                      value={auditionForm.videoLink}
                      onChange={e => handleAuditionField('videoLink', e.target.value)}
                      required
                    />

                    {/* VIDEO PREVIEW */}
                    {auditionVideoEmbed && (
                      <div className="mt-2.5 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a14]">
                        {typeof auditionVideoEmbed === 'string' ? (
                          <iframe
                            src={auditionVideoEmbed}
                            title="Video Preview"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                            className="block w-full aspect-video border-none"
                          />
                        ) : auditionVideoEmbed.type === 'video' ? (
                          <video
                            src={auditionVideoEmbed.url}
                            controls
                            className="block w-full aspect-video border-none"
                          />
                        ) : (
                          <a
                            href={auditionVideoEmbed.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2.5 p-3 text-violet-300 no-underline text-[13px] transition-colors duration-200 hover:bg-violet-600/10"
                          >
                            <span>🔗</span>
                            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-white/55">{auditionVideoEmbed.url}</span>
                            <span className="text-violet-600 text-base shrink-0">↗</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-none font-bold text-base py-3.5 rounded-xl cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                    disabled={auditionSubmitting}
                  >
                    {auditionSubmitting ? 'Submitting…' : '🚀 Submit Audition'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* HOW IT WORKS MODAL */}
      {showHowItWorksModal && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-[9999] p-4" 
          onClick={(e) => { if (e.target.classList.contains('fixed')) closeHowItWorksModal(); }}
        >
          <div className="relative w-full max-w-[600px] max-h-[85vh] overflow-y-auto bg-slate-900 border-2 border-violet-500 rounded-[24px] shadow-[0_0_35px_rgba(139,92,246,0.3)] p-8 scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-[#090d22]">
            <button 
              className="absolute top-4 right-4 bg-slate-800 border-none text-slate-400 text-[20px] cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-slate-700 hover:text-white" 
              onClick={closeHowItWorksModal}
            >
              ✕
            </button>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1.5 font-sans">⚡ How Spotlight Works</h2>
            <p className="text-slate-400 text-sm mb-6 font-sans">Feature your video on our high-traffic splash page.</p>
            
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex gap-4 text-left bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] hover:border-violet-500/25 hover:translate-x-1">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center font-bold text-[15px] shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.4)]">
                  1
                </span>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1 font-sans">Choose Your Spotlight Option</h3>
                  <p className="text-slate-400 text-[13.5px] leading-relaxed">Select <strong>👑 VIP Spotlight</strong> for guaranteed instant featuring for 25 hours, or apply via <strong>🚀 Audition</strong> to enter the review queue.</p>
                </div>
              </div>
              <div className="flex gap-4 text-left bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] hover:border-violet-500/25 hover:translate-x-1">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center font-bold text-[15px] shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.4)]">
                  2
                </span>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1 font-sans">Provide Your Details</h3>
                  <p className="text-slate-400 text-[13.5px] leading-relaxed">Enter your name, mobile number, email address, and your YouTube video URL link.</p>
                </div>
              </div>
              <div className="flex gap-4 text-left bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] hover:border-violet-500/25 hover:translate-x-1">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center font-bold text-[15px] shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.4)]">
                  3
                </span>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1 font-sans">Feature Goes Live</h3>
                  <p className="text-slate-400 text-[13.5px] leading-relaxed">For VIP, complete the checkout. For Audition, wait for review. Once verified, your video goes live instantly at the top of our page!</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-7 text-left">
              <h3 className="text-white text-[22px] font-bold mb-2 font-sans">📈 Proof of Results</h3>
              <p className="text-slate-400 text-sm mb-5 leading-normal font-sans">Here are some performance screenshots showing views and impressions generated via Spotlight:</p>
              <div className="flex flex-col gap-4">
                <div className="bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-500">
                  <img src={ss01} alt="Campaign Stats 1" className="w-full h-auto block object-contain" loading="lazy" />
                </div>
                <div className="bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-500">
                  <img src={ss02} alt="Campaign Stats 2" className="w-full h-auto block object-contain" loading="lazy" />
                </div>
                <div className="bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-500">
                  <img src={ss03} alt="Campaign Stats 3" className="w-full h-auto block object-contain" loading="lazy" />
                </div>
                <div className="bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-500">
                  <img src={ss04} alt="Campaign Stats 4" className="w-full h-auto block object-contain" loading="lazy" />
                </div>
                <div className="bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-500">
                  <img src={ss05} alt="Campaign Stats 5" className="w-full h-auto block object-contain" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Spotlight;
