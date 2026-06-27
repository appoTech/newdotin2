import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ContactDialog from "../components/ContactDialog.jsx";
import { useParams } from "react-router-dom";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import GenerateLinkButton from "../components/SmartLink.jsx";
import VideoCard from "../components/TopVideo.jsx";
import Float from "../components/side_button";
import Floattwo from "../components/side_button2";
import { getURLandredirect, recordClick } from "../helper/api";
import PageHead from "../components/Splash/PageHead";
import { getSuggestions, GetLatestBlogs } from "../helper/api";
import ytLogo from "../assets/yt-logos.avif";
import { Maximize, Sun, Sunset, Moon, VolumeOff, Rss, ChevronDown, ChevronUp } from "lucide-react";
import homeImage from "../assets/footer-space-man.avif";
import UserProfile from "../components/UserProfile";
import Footer from "../components/Footer";
import AdsterraAd from "../components/Adsterads";
import G13Ads from "../components/g13ads";
import StoryCarousel from "../components/Corousel.jsx";
import LoadingScreen from "../components/Loader.jsx";
import logo from "../assets/AppOpener.png";
import FeaturedSection from "../components/FeaturedSection.jsx";
import PagerElement from "../components/pager.jsx";
import book1 from "../assets/affiliation/book1.webp";
import book2 from "../assets/affiliation/book2.webp";
import book3 from "../assets/affiliation/book3.webp";
import book4 from "../assets/affiliation/book4.webp";
import featured1 from "../assets/featured/niviraa_compressed.png";
import ai1 from "../assets/featured/ai1.jpg";
import rezy from "../assets/claim.png";
import SplashNavbar from "../components/splashNavbar.jsx";
import VideoFrame from "../components/VideoFrame.jsx";
// import PromoteModal from "../components/PromoteModal.jsx";
import PipIframe from "../components/PipFrame1.jsx";
import AdsterBanner from "../components/AdsterBanner.jsx";
import CreateOptionsModal from "../components/CreateOptionsModal.jsx";
import CaptureRankModal from "../components/CaptureRankModal.jsx";
import PromotionsModal from "../components/PromotionsModal.jsx";
import AttendanceButton from "../components/attendanceButton.jsx";
import Spotlight from "../components/Splash/Spotlight.jsx";

import axios from "axios";

// Theme configurations
const getUserAgent = () => {
  let agent = navigator.userAgent.toLowerCase();
  let result = "";
  if (agent.includes("android")) {
    result = "android";
  } else if (agent.includes("iphone")) {
    result = "ios";
  } else {
    result = "desktop";
  }
  return result;
};

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/";

const normalizePreviewUrl = (url) => {
  if (!url) return "";
  try {
    return new URL(url).href;
  } catch (error) {
    try {
      return new URL(`https://${url}`).href;
    } catch (_) {
      return "";
    }
  }
};

const WebsitePreviewFrame = ({ url, title }) => {
  const previewUrl = normalizePreviewUrl(url);

  if (!previewUrl) {
    return (
      <div className="w-full aspect-video flex items-center justify-center rounded-xl border border-[#9D4EDD] bg-black text-white">
        Preview unavailable
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black rounded-xl border border-[#9D4EDD]">
      <iframe
        src={previewUrl}
        title={title || "Website preview"}
        className="w-full aspect-video rounded-xl bg-white"
        frameBorder="0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="clipboard-read; clipboard-write; fullscreen"
      />
      <a
        href={previewUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute right-3 top-3 z-20 rounded-lg bg-black/70 px-3 py-1 text-xs font-semibold text-white no-underline backdrop-blur hover:bg-black/90"
      >
        Open site
      </a>
    </div>
  );
};

// Load Cashfree SDK
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

const themes = {
  morning: {
    bg: "bg-orange-50",
    text: "text-orange-950",
    navbar: "bg-orange-100/80 border-orange-200 shadow-sm",
    button:
      "bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white shadow-orange-300",
    card: "bg-white/90 border-orange-200 rounded-3xl shadow-lg shadow-orange-100",
    accent: "text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold theme-accent-morning bg-clip-text text-transparent",
    shadow: "shadow-orange-200",
    topNav: "backdrop-blur-lg bg-orange-50/80 border-b border-orange-200 shadow-sm",
    videoGlow: "shadow-xl shadow-orange-300/50",
    iconBorder: "border-orange-300",
    promoteBtn: "bg-orange-100 border-orange-300/50 text-orange-900 hover:bg-orange-200",
  },
  evening: {
    bg: "bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700",
    text: "text-white",
    navbar: "bg-purple-900/60 border-pink-500",
    button: "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-400",
    card: "bg-purple-800/60 border-pink-500",
    accent: "text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold theme-accent-evening bg-clip-text text-transparent",
    shadow: "shadow-pink-500",
    topNav: "backdrop-blur-lg border-b border-[#9D4EDD] shadow-[0_0_15px_#9D4EDD]/50",
    videoGlow: "shadow-[0_0_25px_#FF00A0]/60",
    iconBorder: "border-white/20",
    promoteBtn: "bg-purple-950/40 border-pink-500/50 text-pink-200 hover:bg-purple-900/50 hover:text-white hover:border-pink-400 shadow-sm shadow-pink-950/50",
  },
  night: {
    bg: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    text: "text-white",
    navbar: "bg-indigo-950/60 border-indigo-500",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-400",
    card: "bg-slate-900/60 border-indigo-600",
    accent: "text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold theme-accent-night bg-clip-text text-transparent",
    shadow: "shadow-indigo-500",
    topNav: "backdrop-blur-lg border-b border-[#9D4EDD] shadow-[0_0_15px_#9D4EDD]/50",
    videoGlow: "shadow-[0_0_25px_#00F5FF]/60",
    iconBorder: "border-white/20",
    promoteBtn: "bg-indigo-950/40 border-indigo-500/50 text-indigo-200 hover:bg-indigo-900/50 hover:text-white hover:border-indigo-400 shadow-sm shadow-indigo-950/50",
  },
};

const Splash = () => {
  const { apptype, shorturl } = useParams();
  const isYoutubeTag = (apptype || "").toLowerCase() === "yt";
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Skip Ap");
  const [top10, settop10] = useState([]);
  const [showTop, setshowTop] = useState(false);
  const [TopVideo, setTopVideo] = useState([]);
  const [Dom, setDom] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ChannelName, setChannelName] = useState("");
  const [Feature, setFeatured] = useState([]);
  const [VideoId, setVideoId] = useState("");
  const [link, setLink] = useState("");
  const [boardTab, setBoardTab] = useState(0); // 0=Leaderboard, 1=LaunchPad, 2=ShowCase
  const [autoRotate, setAutoRotate] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const boardTouchRef = React.useRef({ startX: 0, startY: 0 });
  const [captureRankOpen, setCaptureRankOpen] = useState(false);
  const [openInApp, setOpenInApp] = useState(true);
  const [amount, setAmount] = useState(10000);
  const [spotlightVideos, setSpotlightVideos] = useState([]);
  const [currentSpotlightIndex, setCurrentSpotlightIndex] = useState(0);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
      const shortsMatch = url.match(shortsReg);
      if (shortsMatch) {
        videoId = shortsMatch[1];
      }
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&playlist=${videoId}`;
    }
    return url;
  };

  useEffect(() => {
    let isMounted = true;
    axios.get(`${API_URL}payment/spotlight/active`)
      .then(res => {
        if (!isMounted) return;
        setSpotlightVideos(res.data.videos || []);
      })
      .catch(err => {
        console.error("Failed to fetch spotlight videos in Splash2:", err);
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (spotlightVideos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSpotlightIndex(prev => (prev + 1) % spotlightVideos.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [spotlightVideos]);

  const handleOverlayClick = () => {
    if (apptype && shorturl) {
      recordClick(apptype, shorturl, 'iframe_overlay');
    }
    if (spotlightVideos && spotlightVideos.length > 0) {
      window.open(spotlightVideos[currentSpotlightIndex].ytvideoLink, "_blank");
    } else {
      window.open(`https://www.youtube.com/watch?v=${state.linkMetadata.videoId || state.video_id}`, "_blank");
    }
  };

  const handleCaptureRank = (amount) => {
    setAmount(amount);
    setCaptureRankOpen(true);
  };

  const handlePaidScreeningClick = (e) => {
    e.preventDefault();
    window.location.href = `/syncwatch/${state.video_id}`;
  };
  const BOARD_TABS = ["🏆 Trending", "🎬 Movie Trailer", "🚀 Work to Earn", "🛍️ Buy Cart"];

  // Dummy data for new boards
  const Movietrailer = [
    { title: "Dhamaal 4", crText: "Cr.", hot: true, link: "https://appopener.in/yt/rak3q91j5" },
    { title: "Welcome to the Jungle", crText: "Cr.", hot: true, link: "https://appopener.in/yt/zbhzs2kwm" },
    { title: "Alpha", crText: "Cr.", hot: false, link: "https://appopener.in/yt/sfdj4gqxg" },
    { title: "Cocktail 2", crText: "Cr.", hot: true, link:"https://appopener.in/yt/euactgig7" },
    { title: "Moana", crText: "Cr.", hot: false, link: "https://appopener.in/yt/dt6ky66gc" },
    { title: "Enola Holmes 3", crText: "Cr.", hot: false, link: "https://appopener.in/yt/8ga27alca" },
    { title: "Son of Thanjai", crText: "Cr.", hot: false, link: "https://appopener.in/yt/oa533chex" },
    { title: "Fable", crText: "Cr.", hot: false, link: "https://appopener.in/yt/0jid1yqzm" },
    { title: "Assassin's Creed", crText: "Cr.", hot: false, link: "https://appopener.in/yt/heitgumju" },
    { title: "ORI JEEVUDA", crText: "Cr.", hot: false, link: "https://appopener.in/yt/jptt56elr" },
  ];

  const jobPostings = [
    { title: "Create better thumbnail of top trending Video", salary: "₹50", hot: true },
    { title: "Review and Rate videos", salary: "₹300", hot: true },
    { title: "Fan Reel edit ", salary: "₹100", hot: false },
    { title: "Invite Collaborator", salary: "₹200", hot: true },
    { title: "Repost Reel", salary: "₹15", hot: false },
    { title: "Shoutout Story", salary: "₹25", hot: false },
    { title: "Story Reshare", salary: "₹20", hot: false },
    { title: "Comment on Video", salary: "₹10", hot: false },
    { title: "Share Video", salary: "₹15", hot: false },
    { title: "Mention Link in Bio", salary: "₹10", hot: false },
  ];

  const productShowcase = [
    { name: "Kindness", price: "₹50", badge: "", rating: 4.8 },
    { name: "Happiness", price: "₹50", badge: "🏆Top", rating: 4.6 },
    { name: "Empathy", price: "₹50", badge: "", rating: 4.9 },
    { name: "Gratitude", price: "₹50", badge: "", rating: 4.3 },
    { name: "Love", price: "₹50", badge: "⭐ Pick", rating: 4.7 },
    { name: "Joy", price: "₹50", badge: "", rating: 4.3 },
    { name: "Excitement", price: "₹50", badge: "", rating: 4.5 },
    { name: "Creativity", price: "₹50", badge: "🔥New", rating: 4.7 },
    { name: "Curiosity", price: "₹50", badge: "", rating: 4.9 },
    { name: "Respect", price: "₹50", badge: "", rating: 4.6 },
    { name: "Honesty", price: "₹50", badge: "", rating: 4.4 },
  ];
  const [showCancelButton, setShowCancelButton] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [Profile, setProfile] = useState("");
  const [ytChannelDetails, setytChannelDetails] = useState({});
  const [pagermsg, setpagermsg] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGenerateLink, setShowGenerateLink] = useState(false);
  const [shareTrayOpen, setShareTrayOpen] = useState(false);
  const [theme, setTheme] = useState("morning");
  const [Mute, setMute] = useState(0);
  const [showAttendanceButton, setShowAttendanceButton] = useState(false);
  const [createOptionsModalOpen, setcreateOptionsModalOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      localStorage.getItem("pwaInstalled") === "true"
    );
  });
  const [leaderIndex, setLeaderIndex] = useState(() => {
    return Number(localStorage.getItem("leaderIndex") || 0);
  });

  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [promotedLinks, setPromotedLinks] = useState([]);
  const [promotedLinksWithMeta, setPromotedLinksWithMeta] = useState([]);

  const [promotes, setpromotes] = useState([
    {
      title: "IndianAI",
      linkUrl: "https://www.indian-ai.com/",
      image: featured1,
    },
    {
      title: "Edit with Dandy (3:33pm IST)",
      linkUrl: "https://meet.google.com/vrz-xedr-thf",
      image: ai1,
    },
    {
      title: "Spawnser",
      linkUrl: "https://www.instagram.com/ispawnser/",
      image: logo,
    },
  ]);
  const [state, setState] = useState({
    intentvalue: "",
    resolved_app_intend: "",
    original_url: "",
    linkMetadata: {},
    seconds: 5,
    redirectText: "LOGIN SKIP ",
    video_id: "",
    showImage: false,
    visitorCount: 0,
  });
  const [videos, setvideos] = useState({
    suggestions: { links: [] },
    loading: true,
  });

  const currentTheme = themes[theme];

  const timerIntervalRef = useRef(null);
  const continueButtonRef = useRef(null);
  const iframeRef = useRef(null);
  const showTopref = useRef(null);
  const [activeItem, setActiveItem] = useState("Home");
  const history = useHistory();
  const location = useLocation();

  // Theme cycling has been removed to keep single morning theme
  // useEffect(() => {
  //   const themeCycle = ["morning", "evening", "night"];
  // 
  //   const timers = themeCycle.map((themeName, index) =>
  //     setTimeout(() => {
  //       setTheme(themeName);
  //     }, (index + 1) * 2000)
  //   );
  // 
  //   return () => {
  //     timers.forEach(clearTimeout);
  //   };
  // }, []);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % promotes.length);
  }, 5000);

  return () => clearInterval(interval);
}, [promotes.length]);

  useEffect(() => {
    if (!autoRotate || !isOn) return;
    const interval = setInterval(() => {
      setBoardTab((prev) => (prev + 1) % BOARD_TABS.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRotate, isOn]);

  useEffect(() => {
    if (showTop && showTopref.current) {
      setTimeout(() => {
        showTopref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showTop]);

  useEffect(() => {
    // Check if PWA is already installed using the getInstalledRelatedApps API (if supported)
    if (navigator.getInstalledRelatedApps) {
      navigator.getInstalledRelatedApps().then((relatedApps) => {
        if (relatedApps && relatedApps.length > 0) {
          setIsInstalled(true);
          localStorage.setItem("pwaInstalled", "true");
        }
      }).catch((err) => {
        console.error("Error checking installed related apps:", err);
      });
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setCanInstall(false);
      setIsInstalled(true);
      localStorage.setItem("pwaInstalled", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) {
      alert("Install is available from your browser menu. On iPhone, tap Share → Add to Home Screen.");
      return;
    }

    installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      setInstallPrompt(null);
      setCanInstall(false);
      setIsInstalled(true);
      localStorage.setItem("pwaInstalled", "true");
    }
  };

  const handleBuyAction = () => {
    history.push("/omnitricks");
  };

  const navItems = [
    {
      name: "Appo",
      route: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      ),
    },
    {
      name: "Top 10",
      route: `https://appopener.com/yt/${shorturl}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      name: "Club",
      route: null,
      icon: (
        <img
          src={Profile}
          alt="Profile"
          className="w-14 h-14 border-2 border-current rounded-full"
        />
      ),
    },
    {
      name: "Boost",
      route: "https://tick.it.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },
    {
      name: "AppØ",
      route: "/unblock",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];
  const updateScreenSize = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isSmallScreen: window.innerWidth <= 655,
    }));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const debouncedResize = setTimeout(() => {
        updateScreenSize();
      }, 200);

      return () => clearTimeout(debouncedResize);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateScreenSize]);

  // const startTimer = useCallback(() => {
  //   if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

  //   timerIntervalRef.current = setInterval(() => {
  //     setState((prevState) => {
  //       if (prevState.seconds <= 1) {
  //         clearInterval(timerIntervalRef.current);
  //         setShowCancelButton(false);
  //         setButtonText("Theatre Mode");
  //         setShowControls(false);
  //         return {
  //           ...prevState,
  //           seconds: 0,
  //           redirectText: "Redirecting in ",
  //           showImage: false,
  //         };
  //       }

  //       return { ...prevState, seconds: prevState.seconds - 1 };
  //     });
  //   }, 1000);
  // }, []);
  
  const startTimer = useCallback((app_intend, click_link) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setState((prevState) => {
        if (prevState.seconds <= 1) {
          clearInterval(timerIntervalRef.current);
          setShowCancelButton(true);
          setButtonText("Share Mode");
          click_link.setAttribute("href", app_intend);
          const agent = getUserAgent();
          if (agent === "desktop") {
            const newTab = window.open("", "_blank");
            if (newTab) {
              newTab.document.write(
                `
                <html>
                <head>
                <title>Redirecting...</title>
                <body>
                <a id="redirectLink" href="${app_intend}">Click here if not redirected</a>
                <script>
                document.getElementById('redirectLink').click();
                </script>
                <script data-cfasync="false" type="text/javascript" id="clever-core">
 /* <![CDATA[ */
     (function (document, window) {
         var a, c = document.createElement("script"), f = window.frameElement;
 
         c.id = "CleverCoreLoader89618";
         c.src = "https://scripts.cleverwebserver.com/b808f0a1150069f8ab4947f2d536ab0a.js";
 
         c.async = !0;
         c.type = "text/javascript";
         c.setAttribute("data-target", window.name || (f && f.getAttribute("id")));
         c.setAttribute("data-callback", "put-your-callback-function-here");
         c.setAttribute("data-callback-url-click", "put-your-click-macro-here");
         c.setAttribute("data-callback-url-view", "put-your-view-macro-here");
         
 
         try {
             a = parent.document.getElementsByTagName("script")[0] || document.getElementsByTagName("script")[0];
         } catch (e) {
             a = !1;
         }
 
         a || (a = document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]);
         a.parentNode.insertBefore(c, a);
     })(document, window);
 /* ]]> */
 </script>
                </body>
                </html>
              `
              );
              newTab.document.close();
            }
          } else {
            click_link.click();
          }
          console.log(prevState);
          return {
            ...prevState,
            seconds: 0,
            redirectText: "Redirecting...",
            showImage: false,
          };
        }

        return { ...prevState, seconds: prevState.seconds - 1 };
      });
    }, 1000);

    // Trigger manual click in case automatic click fails
    setTimeout(() => {
      click_link.onclick = (e) => {
        e.preventDefault();
        window.open(app_intend, "_self");
      };
    }, 5000);
  }, []);

  const handleApiDataLoaded = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("leaderIndex", leaderIndex);
  }, [leaderIndex]);

  useEffect(() => {
    setLoading(true);
    let app_intend = "";
    const click_link = document.getElementById("abcd");
    getURLandredirect(apptype, shorturl)
      .then(async (res) => {
        if (!res) return;
        const linkMeta = res.data.smartUrl.data.metadata || {};
        const originalUrl = res.data.smartUrl.data.originalURL || res.data.originalURL || "";
        const videoId = isYoutubeTag ? extractVideoId(originalUrl) : "";

        if (linkMeta) {
          const metadata = {
            title: linkMeta.title || "Get Smart Links with AppOpener",
            image: linkMeta.image || linkMeta.thumbnail || homeImage,
            description:
              linkMeta.description || "Generate Smart Links with AppOpener",
            videoId: linkMeta.videoId,
            tag: linkMeta.tag || apptype,
          };

          setState((prevState) => ({
            ...prevState,
            linkMetadata: metadata,
            intentvalue: res.data.app_intend,
            original_url: originalUrl,
            video_id: videoId,
            visitorCount: res.data.visitorCount,
          }));

          if (res.data.sugLinks.data?.links?.length) {
            res.data.sugLinks.data.links.sort((a, b) => b.clicks - a.clicks);
          }

          setvideos({
            suggestions: res.data.sugLinks.data || { links: [] },
            loading: false,
          });

          setytChannelDetails(res.data.ytChannelDetails);
          setProfile(res.data.ytChannelDetails?.data.avatar);
          const messages = res?.data?.messages?.data?.data;
          setpagermsg(Array.isArray(messages) ? [...messages].reverse() : []);
          const newPromotes = Array.isArray(
            res?.data?.weeklyPromotes?.data.data
          )
            ? res.data.weeklyPromotes.data.data.reverse()
            : [];
          console.log("New Promotes from API: ", newPromotes);
          console.log(res?.data?.weeklyPromotes.data.data);
          setpromotes((prev) => [...prev, ...newPromotes]);
        }

        app_intend = res.data.smartUrl.data.app_intend;
        if (app_intend === "Desktop" || app_intend === "Mobile") {
          app_intend = res.data.smartUrl.data.originalURL;
        }
        if (res.data.smartUrl && res.data.smartUrl.data && res.data.smartUrl.data.promotedLinks) {
          setPromotedLinks(res.data.smartUrl.data.promotedLinks);
          let promotedlinksdata = [];
          for (const element of res.data.smartUrl.data.promotedLinks) {
            const tag = element.split('/')[3];
            const slug = element.split('/')[4];
            try {
              const fetchRes = await fetch(`${process.env.REACT_APP_API_URL}${tag}/preview/${slug}`);
              if (fetchRes.ok) {
                const data = await fetchRes.json();
                promotedlinksdata.push({
                  url: element,
                  thumbnail: data.thumbnail || data.image || "",
                  title: data.title || "Smart Link",
                });
              } else {
                promotedlinksdata.push({
                  url: element,
                  thumbnail: "",
                  title: "Smart Link",
                });
              }
            } catch (err) {
              console.error(err);
              promotedlinksdata.push({
                url: element,
                thumbnail: "",
                title: "Smart Link",
              });
            }
          }
          setPromotedLinksWithMeta(promotedlinksdata);
        }
        setState((prevState) => ({ ...prevState, resolved_app_intend: app_intend }));

        setButtonVisible(true);
      })
      .finally(() => {
        setLoading(false);
        if (app_intend && click_link) {
          startTimer(app_intend, click_link);
        }
      });
  }, [apptype, shorturl, isYoutubeTag, startTimer]);

  const extractVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (url.includes("youtu.be")) {
        return urlObj.pathname.substr(1);
      }
      if (url.includes("live") || url.includes("shorts")) {
        return urlObj.pathname.split("/")[2] || "";
      }
      return urlObj.searchParams.get("v") || "";
    } catch (error) {
      return "";
    }
  };
  const handleLeaderboardRedirect = (url) => {
    history.push(`/leader-redirect?url=${encodeURIComponent(url)}`);
  };

  const handleCancel = () => {
    clearInterval(timerIntervalRef.current);
    // setButtonText("Press to Continue");
    setShowCancelButton(false);
    setShowControls(false);
  };

  const handleButtonClick = () => {
    console.log("Button is clicked!!!");
    console.log("Button text is : ", buttonText);
    if (buttonText === "Theatre Mode") {
      // Trigger YouTube iframe fullscreen
      // if (iframeRef.current) {
      //   if (iframeRef.current.requestFullscreen) {
      //     iframeRef.current.requestFullscreen();
      //   } else if (iframeRef.current.webkitRequestFullscreen) {
      //     iframeRef.current.webkitRequestFullscreen();
      //   } else if (iframeRef.current.mozRequestFullScreen) {
      //     iframeRef.current.mozRequestFullScreen();
      //   } else if (iframeRef.current.msRequestFullscreen) {
      //     iframeRef.current.msRequestFullscreen();
      //   }
      // }
    } else if (buttonText === "Press to Continue") {
      window.open(
        isYoutubeTag
          ? `https://www.youtube.com/watch?v=${
              state.linkMetadata.videoId || state.video_id
            }`
          : state.original_url
      );
    } else if (buttonText.toLowerCase() === "main screen") {
      console.log("heyyyy");
      if(openInApp) {
      console.log("I am here!!");
        setOpenInApp(false);
        // window.open(
        // `https://www.youtube.com/watch?v=${
        //   state.linkMetadata.videoId || state.video_id
        // }`
      // );
    }
      setButtonText("Theatre Mode");
    } else if (buttonText.toLowerCase() === "skip ap") {
      console.log("I am here!!!!!");
      window.open(
        isYoutubeTag
          ? `https://www.youtube.com/watch?v=${
              state.linkMetadata.videoId || state.video_id
            }`
          : state.original_url
      );
    }
  };

  const handleOpenInApp = (e) => {
    e.preventDefault();
    const targetLink = state.resolved_app_intend || state.intentvalue || state.original_url;
    if (!targetLink) return;

    const agent = getUserAgent();
    if (agent === "desktop") {
      const newTab = window.open("", "_blank");
      if (newTab) {
        newTab.document.write(
          `
          <html>
          <head>
          <title>Redirecting...</title>
          <body>
          <a id="redirectLink" href="${targetLink}">Click here if not redirected</a>
          <script>
          document.getElementById('redirectLink').click();
          </script>
          <script data-cfasync="false" type="text/javascript" id="clever-core">
 /* <![CDATA[ */
     (function (document, window) {
         var a, c = document.createElement("script"), f = window.frameElement;
 
         c.id = "CleverCoreLoader89618";
         c.src = "https://scripts.cleverwebserver.com/b808f0a1150069f8ab4947f2d536ab0a.js";
 
         c.async = !0;
         c.type = "text/javascript";
         c.setAttribute("data-target", window.name || (f && f.getAttribute("id")));
         c.setAttribute("data-callback", "put-your-callback-function-here");
         c.setAttribute("data-callback-url-click", "put-your-click-macro-here");
         c.setAttribute("data-callback-url-view", "put-your-view-macro-here");
         
 
         try {
             a = parent.document.getElementsByTagName("script")[0] || document.getElementsByTagName("script")[0];
         } catch (e) {
             a = !1;
         }
 
         a || (a = document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]);
         a.parentNode.insertBefore(c, a);
     })(document, window);
 /* ]]> */
 </script>
          </body>
          </html>
        `
        );
        newTab.document.close();
      }
    } else {
      window.location.href = targetLink;
    }
  };


  useEffect(() => {
    if (videos?.suggestions?.links?.length > 0) {
      const TopVideos = videos.suggestions.links.slice(0, 10);
      const top10 = videos.suggestions.links.slice(0, 10);
      setFeatured(top10.slice(0, 4));
      setTopVideo(TopVideos);
      settop10(top10);
    }
  }, [videos]);

  const openPopup = (state, type) => {
    console.log("Type is : ", type);
    const link = encodeURIComponent(window.location.href);
    if (type === "promote") {
      history.push(`/express/promote?link=${link}`);
    } else {
      history.push(`/express/pager?link=${link}&type=${type}`);
    }
  };

  const redirectContent = useMemo(() => {
    // console.log("Button text is : ", buttonText);
    if (buttonText === "Press to Continue") {
      return (
        <>
          <img
            src={logo}
            alt="App Logo"
            className="w-10 h-10 rotate-90 drop-shadow-[0_0_10px_#3b82f6]"
          />
          Press to Continue
        </>
      );
    }

    if (buttonText === "Theatre Mode") {
      return (
        <>
          <Maximize size={20} className="text-white" />
          <p className="text-white text-center font-semibold text-base">
            Theatre Mode
          </p>
        </>
      );
    }

    return state.showImage ? (
      <>
        <img src={ytLogo} alt="App Logo" className="w-8 h-8" />
        <p className="text-blue-700 text-center font-semibold text-base pt-3">
          Press to Continue
        </p>
      </>
    ) : state.seconds !== 0 ? (
      <>
        <p className="text-white text-center font-semibold text-base mt-3">
          {state.redirectText}
        </p>
        <img src={logo} className="rotate-90 w-8 h-8" alt="" />
      </>
    ) : (
      <p className="text-white text-center font-semibold text-base mt-3">
        {buttonText}{" "}
      </p>
    );
  }, [buttonText, state.showImage, state.redirectText, state.seconds]);

  useEffect(() => {
    if (buttonText === "Theatre Mode") handleButtonClick();
  }, [buttonText]);

  return (
    <div className={`${currentTheme.bg} ${currentTheme.text} min-h-screen`}>
      <AdsterraAd />
      {loading && <LoadingScreen />}
      {state.linkMetadata && <PageHead metadata={state.linkMetadata} />}

      <nav className={currentTheme.topNav}>
        {ytChannelDetails?.data && (
          <UserProfile
            url={state.original_url}
            video_id={state.video_id}
            onApiDataLoaded={handleApiDataLoaded}
            onSetShowGenerateLink={setShowGenerateLink}
            onCancelRedirect={handleCancel}
            ytChannelDetails={ytChannelDetails}
            currentTheme={currentTheme}
            visitorCount={state.visitorCount}
            leaderboard={TopVideo}
            leaderIndex={leaderIndex}
            setLeaderIndex={setLeaderIndex}
            onOpenClubDialog={() => setDialogOpen(true)}
            shareTrayOpen={shareTrayOpen}
            setShareTrayOpen={setShareTrayOpen}
            setAttendanceModal={setShowAttendanceButton}
            setButtonText={setButtonText}
          />
        )}
      </nav>
      {/* THEME ICON BAR (FIXED) */}
      {/* <div
        className="
    fixed top-1/2 left-4 
    -translate-y-1/2 
    flex flex-col gap-3
    z-50
  "
      >
        <button
          onClick={() => setTheme(prev => prev === "morning" ? "evening" : prev === "evening" ? "night" : "morning")}
          className={`
      w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl 
      border ${currentTheme.iconBorder} shadow-lg 
      transition-all duration-300 hover:scale-110
      ${
        theme === "morning"
          ? "bg-orange-500 text-white shadow-orange-400/60"
          : theme === "evening"
          ? "bg-pink-600 text-white shadow-pink-400/60"
          : "bg-indigo-600 text-white shadow-indigo-400/60"
      }
    `}
        >
          {theme === "morning" && <Sun size={22} />}
          {theme === "evening" && <Sunset size={22} />}
          {theme === "night" && <Moon size={22} />}
        </button>
      </div> */}

      <div className="items-center justify-center w-full">
        <div className="flex flex-col items-center px-2">
          
          {/* <AdsterBanner size="320x100" /> */}
          
          <div className="w-full max-w-4xl mx-auto mt-2 mb-2">
            {(isYoutubeTag ? state.video_id : state.original_url) && (
              <div className={`relative group rounded-xl ${currentTheme.videoGlow}`}>
                {isYoutubeTag ? (
                  // <VideoFrame
                  //   iframeRef={iframeRef}
                  //   videoId={state.linkMetadata.videoId || state.video_id}
                  //   showControls={showControls}
                  //   buttonText={buttonText}
                  //   setButtonText={setButtonText}
                  //   setState={setState}
                  //   setShowControls={setShowControls}
                  //   Mute={Mute}
                  //   onSetMute={setMute}
                  //   onOpenShareTray={setShareTrayOpen}
                  // />
                  // <iframe
                  //   ref={iframeRef}
                  //   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  //   src={`https://www.youtube.com/embed/${
                  //     state.linkMetadata.videoId || state.video_id
                  //   }?autoplay=1&mute=1&controls=${
                  //     showControls ? 1 : 0
                  //   }&rel=0&loop=1&playlist=${
                  //     state.linkMetadata.videoId || state.video_id
                  //   }&wmode=transparent`}
                  //   frameBorder="0"
                  //   allow="autoplay; encrypted-media; fullscreen"
                  //   allowFullScreen
                  // ></iframe>
                  <div className="w-full aspect-video relative flex items-center justify-center rounded-xl overflow-hidden bg-black border border-[#9D4EDD]">
                    <iframe
                      ref={iframeRef}
                      className="w-full h-full object-cover"
                      src={
                        spotlightVideos && spotlightVideos.length > 0
                          ? getYoutubeEmbedUrl(spotlightVideos[currentSpotlightIndex].ytvideoLink)
                          : `https://www.youtube.com/embed/${
                              state.linkMetadata.videoId || state.video_id
                            }?autoplay=1&mute=1&controls=${
                              showControls ? 1 : 0
                            }&rel=0&loop=1&playlist=${
                              state.linkMetadata.videoId || state.video_id
                            }&wmode=transparent`
                      }
                      title={
                        spotlightVideos && spotlightVideos.length > 0
                          ? `Spotlight: ${spotlightVideos[currentSpotlightIndex].name}'s Video`
                          : "AppOpener Video"
                      }
                      frameBorder="0"
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                    ></iframe>
                    {spotlightVideos && spotlightVideos.length > 0 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-extrabold text-[11px] px-2.5 py-1 rounded shadow-[0_0_10px_rgba(250,204,21,0.6)] tracking-[1px] select-none pointer-events-none z-[150]">
                        SPOTLIGHT ⚡
                      </div>
                    )}
                    <div 
                      className="absolute inset-0 cursor-pointer z-10" 
                      onClick={handleOverlayClick}
                    />
                  </div>
                ) : (
                  <WebsitePreviewFrame
                    url={state.original_url}
                    title={state.linkMetadata.title}
                  />
                )}

                {/* <div className="absolute bottom-4 -left-2 flex flex-col items-center z-20">
                  <a className="no-underline">
                    <button
                      onClick={handleButtonClick}
                      className="flex items-center justify-center gap-2 rounded-r-lg whitespace-nowrap text-lg font-bold h-10 px-4 py-2 mt-2 w-full
                         bg-white/20 backdrop-blur-2xl current shadow-lg transition"
                    >
                      {redirectContent}
                    </button>
                  </a>
                </div> */}
                {/* {isYoutubeTag && (
                <div className="absolute bottom-4 -right-2 flex flex-col items-center z-20">
                  <a className="no-underline text-white cursor-pointer" onClick={handlePaidScreeningClick}>
                    <button
                      // onClick={handleButtonClick}
                      className="flex items-center justify-center gap-2 rounded-l-lg whitespace-nowrap text-lg font-semibold h-10 px-3 py-2 mt-2 w-full
                         bg-white/20 backdrop-blur-2xl current shadow-lg transition hover:bg-white/30"
                    >
                      PAID SCREENING
                    </button>
                  </a>
                </div>
                )} */}
              </div>
            )}

            <SplashNavbar
              setDialogOpen={setDialogOpen}
              setShowTop={setshowTop}
              navItems={navItems}
              currentTheme={currentTheme}
              onOpenShareTray={() => setShareTrayOpen(true)}
              // setShowTop={setShowTop}
              showTop={showTop}
            />

            {promotedLinksWithMeta && promotedLinksWithMeta.length > 0 && (
  <div
    className={`relative flex flex-col items-center w-full gap-4 p-2 sm:p-5 rounded-[26px] border ${currentTheme.card} ${currentTheme.shadow} mt-2 mb-1 backdrop-blur-xl overflow-hidden`}
  >
    {/* Header */}
    {/* <div className="flex flex-col items-center">
      <h2 className="text-sm sm:text-lg font-black uppercase tracking-[0.25em] bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 text-transparent bg-clip-text">
        🔥 Promoted
      </h2>

      <div className="w-16 h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mt-2" />
    </div> */}

    {/* Thumbnail Row */}
    <div className="relative flex items-center justify-center flex-wrap gap-1 sm:gap-4 w-full">
      {promotedLinksWithMeta.map((pLink, idx) => (
        <div key={idx} className="relative flex items-center">
          {/* Connector Line */}
          {idx !== promotedLinksWithMeta.length - 1 && (
            <div className="hidden sm:block absolute left-full top-1/2 -translate-y-1/2 w-4 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-70" />
          )}

          <a
            href={
              pLink.url.startsWith("http")
                ? pLink.url
                : `https://${pLink.url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            {/* Glow Ring */}
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-70 blur-[2px] group-hover:opacity-100 transition duration-300" />

            {/* Thumbnail */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
              {pLink.thumbnail ? (
                <img
                  src={pLink.thumbnail}
                  alt="thumbnail"
                  className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center text-2xl bg-gradient-to-br from-purple-700/40 to-pink-700/30 text-white">
                  🔗
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
            </div>
          </a>
        </div>
      ))}
    </div>
  </div>
)}
                <a
                  id="abcd" ref={continueButtonRef}
                  href={state.resolved_app_intend || state.intentvalue || state.original_url || "#"}
                  onClick={handleOpenInApp}
                  className={`bg-gradient-to-r from-rose-700 to-purple-950 hover:from-orange-500 hover:to-yellow-600 text-white shadow-orange-300 no-underline flex items-center justify-center gap-2 rounded-lg whitespace-nowrap text-lg font-bold h-12 px-6 mt-8 w-full shadow-lg transition-opacity opacity-100 cursor-pointer`}
                >
                  <button>
                    Watch Now
                  </button>
              </a>

            {/* Adster Banner - Below video/buttons */}
            {/* <AdsterBanner size="320x50" /> */}
            {state.seconds !== 0 && (
      <div className="w-full flex justify-center mt-1">
        <a
          className="w-full max-w-2xl no-underline"
          id="abcd"
          ref={continueButtonRef}
        >
          <button
            onClick={handleButtonClick}
            disabled={true}
            className={`${currentTheme.button} relative flex items-center justify-center gap-2 rounded-2xl text-sm sm:text-lg font-bold h-12 sm:h-14 px-6 w-full shadow-2xl transition-all duration-300 opacity-85 cursor-not-allowed overflow-hidden border border-white/10`}
          >
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

            <span className="relative z-10 flex items-center gap-2">
              🎬 Watch in
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-cyan-300">
                {state.seconds}
              </span>
            </span>
          </button>
        </a>
      </div>
    )}

        <Spotlight />
              {/* <div className="w-full flex flex-row items-center gap-4 -top-4">
                <a
                  href={`/barter`}
                  // onClick={()=> setPromoteModalOpen(true)}
                  className={`${currentTheme.button} no-underline flex items-center justify-center gap-2 rounded-lg whitespace-nowrap text-lg font-bold h-12 px-6 mt-4 w-full shadow-lg transition-opacity opacity-80 cursor-not-allowed`}
                >
                  <button
                  // onClick={handleButtonClick}
                  // className={`${currentTheme.button} flex items-center justify-center gap-2 rounded-lg whitespace-nowrap text-lg font-bold h-12 px-6 mt-4 w-full shadow-lg transition-opacity opacity-80 cursor-not-allowed`}
                  >
                    BARTER
                  </button>
                </a>
                 <a
                  // href="https://spawnser.com"
                  href="/omnitricks"
                  className={`${currentTheme.button} no-underline flex items-center justify-center gap-2 rounded-lg whitespace-nowrap text-lg font-bold h-12 px-6 mt-4 w-full shadow-lg transition-opacity opacity-80 cursor-not-allowed`}
                > 
                  <button
                    type="button"
                    onClick={isInstalled ? handleBuyAction : handleInstallApp}
                    className={`${currentTheme.button} no-underline flex items-center justify-center gap-2 rounded-lg whitespace-nowrap text-lg font-bold h-12 px-6 mt-4 w-full shadow-lg transition-opacity ${
                      (isInstalled || canInstall) ? "opacity-100 cursor-pointer" : "opacity-80 cursor-pointer"
                    }`}
                  >
                    {isInstalled ? "BUY" : "INSTALL"}
                  </button>
                 </a> 
                <button
                  onClick={() => setcreateOptionsModalOpen(true)}
                  className={`${currentTheme.button} no-underline flex items-center justify-center gap-2 rounded-lg whitespace-nowrap text-lg font-bold h-12 px-6 mt-4 w-full shadow-lg transition-opacity opacity-80 cursor-pointer`}
                >
                  <button>Write</button>
                </button>
              </div> */}

            {/* <div className="flex items-center justify-center space-x-4 overflow-x-auto px-2 mt-4">
              <PagerElement pagermsg={pagermsg} pageSlug={shorturl} creatorName={ytChannelDetails?.data?.channelName || ytChannelDetails?.data?.title || ChannelName || "AppOpener Creator"} />
            </div> */}

            

            {/* <AdsterBanner size="300x250" /> */}
            {/* <nav className="bg-black/40 text-white w-full mb-2 mt-2 rounded-lg shadow-[0_0_20px_#00F5FF]/50">
              <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                  const isActive = activeItem === item.name;
                  return (
                    <div
                      key={item.name}
                      className={`flex flex-col justify-center items-center px-2 ${
                        isActive
                          ? "text-[#00F5FF] font-semibold drop-shadow-[0_0_10px_#00F5FF]"
                          : "text-[#9D4EDD] hover:text-[#FF00A0] cursor-pointer"
                      }`}
                      onClick={() => handleNavigation(item.route, item.name)}
                    >
                      <button className="flex items-center justify-center p-1 rounded-full">
                        {item.icon}
                      </button>
                      <span className="text-xs font-bold sm:text-sm">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </nav> */}

            {showGenerateLink && (
              <GenerateLinkButton onSetShowGenerateLink={setShowGenerateLink} />
            )}
          </div>

          <div id="board-section" className="w-full max-w-4xl flex flex-col items-center mb-4">
            {/* Header with toggle */}
            <div className="flex w-full items-center justify-between mb-2">
              <div>

                {isOn && <h2 className={`text-xl sm:text-3xl font-bold text-yellow-300`}>
                {BOARD_TABS[boardTab]} 
                <span className="text-sm ml-2 ">{BOARD_TABS[boardTab] !== "🏆 Trending" && " This is Not Actual Postings "}</span>
              </h2>}
              {!isOn && 
                <button onClick={() => openPopup(state, "promote")} 
                className="text-xl sm:text-2xl mt-3 font-semibold bg-transparent text-yellow-600/90 p-2 shadow-lg rounded-lg border-2 border-yellow-600 hover:border-yellow-300 hover:text-yellow-300"> 
                Spawnser the fleet 🌟 - 
                  <span className="ml-1 px-2 py-1 rounded-lg">$1000</span> 
                </button>
              }
              </div>
              {/* <div className="flex flex-col items-center justify-center text-md font-bold">
                <span className="text-sm mb-1"> ÅShow</span>
                <button
                  onClick={() => setIsOn(!isOn)}
                  className={`relative w-16 h-6 rounded-full flex items-center px-2 transition-colors duration-300 ${
                    isOn ? currentTheme.button.split(" ")[0] : "bg-yellow-400"
                  }`}
                >
                  <div
                    className={`absolute left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      isOn ? "translate-x-9" : "translate-x-0"
                    }`}
                  />
                  <span className="w-full text-center text-xs font-semibold transition-colors duration-300 text-black">
                    {isOn ? "On" : "Off"}
                  </span>
                </button>
              </div> */}
            </div>

            {/* {isOn ? (
              <>

                <div className="flex w-full gap-1 mb-3 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {BOARD_TABS.map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setBoardTab(i);
                        setAutoRotate(false);
                      }}
                      className={`flex-1 py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 rounded-lg ${
                        boardTab === i
                          ? `${currentTheme.button} shadow-lg scale-[1.02]`
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div
                  className="w-full overflow-hidden"
                  onTouchStart={(e) => {
                    boardTouchRef.current.startX = e.touches[0].clientX;
                    boardTouchRef.current.startY = e.touches[0].clientY;
                  }}
                  onTouchEnd={(e) => {
                    const dx = e.changedTouches[0].clientX - boardTouchRef.current.startX;
                    const dy = e.changedTouches[0].clientY - boardTouchRef.current.startY;
                    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                      if (dx < 0 && boardTab < 2) {
                        setBoardTab(boardTab + 1);
                        setAutoRotate(false);
                      }
                      if (dx > 0 && boardTab > 0) {
                        setBoardTab(boardTab - 1);
                        setAutoRotate(false);
                      }
                    }
                  }}
                >
                  <div
                    className="flex transition-transform duration-400 ease-out"
                    style={{ transform: `translateX(-${boardTab * 100}%)` }}
                  >
                    <div className="w-full flex-shrink-0">
                      
                      <div 
                        onClick={() => handleCaptureRank(20000)}
                        className="w-full max-w-[90vw] mx-auto mb-3 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 p-[2px] shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-transform hover:scale-[1.02]"
                      >
                        <div className="flex h-full w-full items-center justify-center bg-gray-900 px-4 py-3 rounded-[10px]">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 font-bold text-md sm:text-lg tracking-wider animate-pulse uppercase">
                            👑 Capture top rank at ₹20k
                          </span>
                        </div>
                      </div>

                      <div className={`w-full ${currentTheme.card} rounded-xl ${currentTheme.shadow} shadow-xl overflow-hidden`}>
  <div className={`grid grid-cols-12 items-center px-4 py-3 border-b ${currentTheme.navbar}`}>
    <div className="col-span-2 font-semibold">Rank</div>
    <div className="col-span-7 font-semibold">Video</div>
    <div className="col-span-3 font-semibold text-right">Points</div>
  </div>

  {TopVideo.map((item, index) => (
    <React.Fragment key={index}>
      
      <a
        href={item["smart_link"]}
        className="no-underline block transition hover:opacity-80"
      >
        <div className="grid grid-cols-12 items-center px-4 py-3 border-b border-gray-300/20">
          <div className="col-span-2 flex items-center justify-start">
            <div
              className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full shadow-lg ${
                index === 0
                  ? "bg-yellow-400 text-black"
                  : index === 1
                  ? "bg-gray-400 text-white"
                  : index === 2
                  ? "bg-orange-400 text-white"
                  : currentTheme.button
              }`}
            >
              {index + 1}
            </div>
          </div>

          <div className={`col-span-7 truncate text-sm sm:text-base font-bold ${currentTheme.text}`}>
            {item.metadata.title}
          </div>

          <div className={`col-span-3 text-right font-semibold ${currentTheme.accent} font-mono`}>
            {item.clicks * 3}
          </div>
        </div>
      </a>

      {index === 2 && (
        <div 
          onClick={() => handleCaptureRank(5000)}
          className="w-full my-1 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 p-[2px] shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-transform hover:scale-[1.02]"
        >
          <div className="grid grid-cols-12 h-full w-full items-center justify-center bg-gray-900 px-4 py-3 rounded-[10px] gap-3">
            <div
              className={`col-span-2 w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full shadow-lg bg-orange-400 text-white`}
            >
              {3.5}
            </div>
            <span className="text-transparent col-span-10 bg-clip-text bg-gradient-to-r from-sky-300 to-yellow-400 font-bold text-md sm:text-lg tracking-wider animate-pulse uppercase">
              👑 Capture This rank at ₹5000
            </span>
          </div>
        </div>
      )}
      {index === 9 && (
        <div 
          onClick={() => handleCaptureRank(1111)}
          className="w-full my-1 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 p-[2px] shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-transform hover:scale-[1.02]"
        >
          <div className="grid grid-cols-12 h-full w-full items-center justify-center bg-gray-900 px-4 py-3 rounded-[10px] gap-3">
            <div
              className={`col-span-2 w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full shadow-lg bg-orange-400 text-white`}
            >
              {11}
            </div>
            <span className="text-transparent col-span-10 bg-clip-text bg-gradient-to-r from-sky-300 to-yellow-400 font-bold text-md sm:text-lg tracking-wider animate-pulse uppercase">
              👑 Capture This rank at ₹1111
            </span>
          </div>
        </div>
      )}

    </React.Fragment>
  ))}
</div>
</div>
          <div className="w-full flex-shrink-0">
      <div className={`w-full ${currentTheme.card} rounded-xl ${currentTheme.shadow} shadow-xl overflow-hidden`}>
        <div className={`flex items-center justify-between px-4 py-3 border-b ${currentTheme.navbar}`}>
          <span className="font-bold text-sm sm:text-base">Movie Trailer 🎬</span>
          <span className="text-xs opacity-60">{Movietrailer.length} videos</span>
        </div>

        {Movietrailer.map((job, idx) => (
          <a
            key={idx}
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline px-4 py-3 border-b border-gray-300/20 hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm sm:text-base font-bold ${currentTheme.text} truncate`}>
                    {job.title}
                  </span>

                  {job.hot && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-full font-bold flex-shrink-0">
                      🔥 HOT
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">

                <button
                  type="button"
                  className={`text-[10px] px-3 py-1 rounded-full font-bold ${currentTheme.button}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(job.link, "_blank", "noopener,noreferrer");
                  }}
                >
                  Predict
                </button>
                <span className={`text-sm font-bold ${currentTheme.accent} whitespace-nowrap`}>
                  Cr.
                </span>
              </div>
            </div>
          </a>
        ))}

        <div className="px-4 py-3 text-center">
          <button className={`text-xs font-bold ${currentTheme.accent} hover:underline`}>
            View All Trailers →
          </button>
        </div>
      </div>
    </div>

    <div className="w-full flex-shrink-0">
      <div className={`w-full ${currentTheme.card} rounded-xl ${currentTheme.shadow} shadow-xl overflow-hidden`}>
        <div className={`flex items-center justify-between px-4 py-3 border-b ${currentTheme.navbar}`}>
          <span className="font-bold text-sm sm:text-base">Tasks 🚀</span>
          <span className="text-xs opacity-60">{jobPostings.length} roles</span>
        </div>
        {jobPostings.map((job, idx) => (
          <div key={idx} className="px-4 py-3 border-b border-gray-300/20 hover:bg-white/5 transition cursor-pointer">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm sm:text-base font-bold ${currentTheme.text} truncate`}>{job.title}</span>
                  {job.hot && <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-full font-bold flex-shrink-0">🔥 HOT</span>}
                </div>
                <p className="text-xs opacity-60 mt-0.5">{job.company} · {job.type}</p>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {job.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-medium">{t}</span>)}
                </div> 
              </div>
              <span className={`text-sm font-bold ${currentTheme.accent} whitespace-nowrap`}>{job.salary}</span>
            </div>
          </div>
        ))}
        <div className="px-4 py-3 text-center">
          <button className={`text-xs font-bold ${currentTheme.accent} hover:underline`}>View All Openings →</button>
        </div>
      </div>
    </div>


    <div className="w-full flex-shrink-0">
      <div className={`w-full ${currentTheme.card} rounded-xl ${currentTheme.shadow} shadow-xl overflow-hidden`}>
        <div className={`flex items-center justify-between px-4 py-3 border-b ${currentTheme.navbar}`}>
          <span className="font-bold text-sm sm:text-base">Feelings 🥰</span>
          <span className="text-xs opacity-60">{productShowcase.length} products</span>
        </div>
        {productShowcase.map((prod, idx) => (
          <div key={idx} className="px-4 py-3 border-b border-gray-300/20 hover:bg-white/5 transition cursor-pointer">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm sm:text-base font-bold ${currentTheme.text} truncate`}>{prod.name}</span>
                  {prod.badge && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full font-bold flex-shrink-0">{prod.badge}</span>}
                </div>
                <p className="text-xs opacity-60 mt-0.5">{prod.desc}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(prod.rating))}{'☆'.repeat(5 - Math.floor(prod.rating))}</span>
                  <span className="text-[10px] opacity-50">{prod.rating}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-sm font-bold ${currentTheme.accent}`}>{prod.price}</span>
                <button className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${currentTheme.button}`}>Buy</button>
              </div>
            </div>
          </div>
        ))}
        <div className="px-4 py-3 text-center">
          <button className={`text-xs font-bold ${currentTheme.accent} hover:underline`}>Browse All Products →</button>
        </div>
      </div>
    </div>
  </div>
</div>

                <div className="flex gap-2 mt-3">
                  {BOARD_TABS.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setBoardTab(i);
                        setAutoRotate(false);
                      }}
                      className={`rounded-full cursor-pointer transition-all duration-300 ${
                        boardTab === i ? 'w-5 h-2 ' + (currentTheme.button.split(' ')[0] || 'bg-yellow-400') : 'w-2 h-2 bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </> */}
            {/* ) : ( */}
              <div
                className={`flex flex-col w-full items-center gap-6 p-4 sm:p-6 rounded-xl border-2 ${currentTheme.card} ${currentTheme.shadow}`}
              >
                {/* 🏆 Main Promotion */}
                {promotes.length > 0 && (
                  <a
                    href={promotes[currentIndex]?.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group w-full max-w-[600px] rounded-2xl overflow-hidden shadow-lg no-underline"
                  >
                    <img
                      src={promotes[currentIndex]?.image}
                      alt={promotes[currentIndex]?.title}
                      className="w-full aspect-[16/9] sm:aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <h3
                      className={`absolute bottom-3 left-3 text-lg sm:text-xl md:text-2xl font-semibold drop-shadow-lg text-white bg-black/50 px-3 py-1 rounded`}
                    >
                      {promotes[currentIndex]?.title}
                    </h3>
                  </a>
                )}

                {/* ➕ Promote Button */}
                <button
                  onClick={() => openPopup(state, "promote")}
                  className={`flex items-center justify-center gap-2 w-full max-w-sm px-4 py-3 rounded-xl transition font-semibold text-base sm:text-lg border-2 ${currentTheme.promoteBtn}`}
                >
                  <style>{`@keyframes promoteBounce { 0%,100%{transform:translateY(0) scale(1)} 30%{transform:translateY(-6px) scale(1.15)} 50%{transform:translateY(0) scale(1)} 70%{transform:translateY(-3px) scale(1.08)} }`}</style>
                  <span className="text-md sm:text-xl font-bold">
                    Promote it 🚀
                  </span>
                </button>

                {/* 🌀 Rotating Deck */}
                <div className="flex gap-4 overflow-x-auto px-1 sm:px-4 py-3 w-full justify-start sm:justify-center perspective-[1000px] scrollbar-hide">
                  {Array.isArray(promotes) && promotes.length > 1 ? (
                    promotes.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`flex-shrink-0 cursor-pointer w-28 sm:w-36 md:w-44 transform transition-transform duration-500 ease-in-out ${
                          idx === currentIndex
                            ? "scale-105 rotate-x-0 border-2 border-yellow-400"
                            : "opacity-70 hover:opacity-100 rotate-x-6"
                        } rounded-lg overflow-hidden bg-gray-700/60 hover:bg-gray-600/60`}
                      >
                        <span className="absolute top-2 right-2 text-white bg-black/50 px-2 py-1 rounded">₹10</span>
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.title || "Promotion"}
                          className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-t-lg"
                        />
                        <div className="p-2 text-center text-xs sm:text-sm md:text-base font-semibold truncate text-white">
                          {item.title || "Untitled"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center w-full">
                      No promotions available
                    </p>
                  )}
                </div>
              </div>
            {/* )} */}
          </div>

          {/* Adster Banner - Below Leaderboard/Featured */}
          {/* <AdsterBanner /> */}

          <button
            className="flex flex-col max-w-[90vw] font-bold text-lg items-center justify-center mt-4 px-4"
            onClick={() => setShowGenerateLink(true)}
          >
            {/* <h1 className="text-3xl sm:text-4xl text-gray-600 bg-gray-300 rounded-full px-2 font-semibold -mb-2">+</h1> */}
            <div className="flex items-center justify-center">
              <img src={logo} className="w-16 h-16" />{" "}
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-[#00F5FF] via-[#9D4EDD] to-[#FF00A0] text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,0,160,0.5)]">Join Us</span>
            </div>
            
          </button>

          {/* {!showTop && (
             <div className="flex flex-col items-center justify-center mt-6 mb-2 animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => { setshowTop(true); }}>
                <span className="text-sm mb-1 uppercase tracking-widest font-semibold text-gray-500">Open Tabs</span>
                <ChevronDown size={32} className="text-gray-500" />
             </div>
          )}

          <div ref={showTopref} className="w-full px-2" tabIndex={0}>
            {showTop && (
              <div 
                onClick={() => handleCaptureRank(20000)}
                className="w-full max-w-[90vw] mx-auto mb-3 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 p-[2px] shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-transform hover:scale-[1.02]"
              >
                <div className="flex h-full w-full items-center justify-center bg-gray-900 px-4 py-3 rounded-[10px]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 font-bold text-md sm:text-lg tracking-wider animate-pulse uppercase">
                    👑 Capture top rank at ₹20000
                    </span>
                  </div>
                </div>
            )}
            {showTop &&
              top10.map((item, index) => (
                <>
                <a href={item.smart_link} key={index} className="no-underline">
                  <VideoCard
                    rank={index + 1}
                    title={item.metadata.title}
                    thumbnail={item.metadata.image}
                    description={item.metadata.description}
                  />
                </a>
                {index === 2 && (
        <div 
          onClick={() => handleCaptureRank(5000)}
          className="w-full my-1 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 p-[2px] shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-full w-full items-center justify-center bg-gray-900 px-4 py-3 rounded-[10px] gap-3">
            <span className="text-transparent text-center bg-clip-text bg-gradient-to-r from-sky-300 to-yellow-400 font-bold text-md sm:text-lg tracking-wider animate-pulse uppercase">
              👑 Capture This rank at ₹5000
            </span>
          </div>
        </div>
      )}
      {index === 9 && (
        <div 
          onClick={() => handleCaptureRank(1111)}
          className="w-full my-1 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 p-[2px] shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-full w-full items-center justify-center bg-gray-900 px-4 py-3 rounded-[10px] gap-3">
            <span className="text-transparent text-center bg-clip-text bg-gradient-to-r from-sky-300 to-yellow-400 font-bold text-md sm:text-lg tracking-wider animate-pulse uppercase">
              👑 Capture This rank at ₹1111
            </span>
          </div>
        </div>
      )}
              </>
              ))}
            {showTop && top10.length > 0 && (
              <div 
                className="flex flex-col items-center justify-center mt-6 mb-4 animate-bounce opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                // onClick={() => window.scrollBy({ top: 300, behavior: 'smooth' })}
                onClick={() => setshowTop(false)}
              >
                <span className="text-sm mb-1 uppercase tracking-widest font-semibold text-gray-500">Close Tabs</span>
                <ChevronUp size={32} className="text-gray-500" />
              </div>
            )}
          </div> */}

          <ContactDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            Creator1={ChannelName}
            Video={state.video_id}
            LInk={state.original_url}
          />
        </div>

        <CreateOptionsModal
          open={createOptionsModalOpen}
          onOpenChange={setcreateOptionsModalOpen}
        />

        <CaptureRankModal
          isOpen={captureRankOpen}
          onClose={() => setCaptureRankOpen(false)}
          API_URL={API_URL}
          loadCashfreeSDK={loadCashfreeSDK}
          amount = {amount}
        />
        <PromotionsModal 
          open={promoteModalOpen}
          onOpenChange={setPromoteModalOpen}
                  
        />

        {/* Adster Banner - Above footer */}
        {/* <AdsterBanner /> */}

        {showAttendanceButton && <AttendanceButton setShowAttendanceButton={setShowAttendanceButton}/>}

        <Float />
        <Floattwo />
        <PipIframe src={"https://www.instagram.com/reel/DYrsaGER61u/?igsh=dGw4cGJoYXl4cWhm"} />
      </div>
    </div>
  );
};

export default Splash;
