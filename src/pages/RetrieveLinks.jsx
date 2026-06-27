import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { getPaidLinksByPhone } from "../helper/api";
import SpaceBackground from "../components/spaceComponent";
import TopNav from "../components/TopNav";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Star, 
  Smartphone, 
  ArrowLeft,
  Calendar,
  MousePointerClick,
  AlertCircle
} from "lucide-react";

const cleanPhone = (val) => {
  if (!val) return "";
  let clean = String(val).trim().replace(/\D/g, "");
  if (clean.length === 12 && clean.startsWith("91")) {
    clean = clean.slice(2);
  } else if (clean.length === 11 && clean.startsWith("0")) {
    clean = clean.slice(1);
  }
  return clean;
};

const RetrieveLinks = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanedPhone = cleanPhone(phone);
    if (!cleanedPhone) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);
    try {
      const response = await getPaidLinksByPhone(cleanedPhone);
      if (response && response.success) {
        const processed = (response.links || [])
          .map((link) => {
            if (link.promotedLinks && link.promotedLinks.length > 0) {
              return { ...link, linkType: "app" };
            }
            return link;
          })
          .filter((link) => {
            return link.linkType !== "promoted" && link.linkType !== null && link.linkType !== undefined && link.linkType !== "";
          });
        setLinks(processed);
      } else {
        setLinks([]);
        setError("Failed to retrieve links. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching your links.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getPlatformIcon = (tag) => {
    switch (tag?.toLowerCase()) {
      case "yt":
      case "youtube":
        return "🎥";
      case "ig":
      case "instagram":
        return "📸";
      case "sp":
      case "spotify":
        return "🎵";
      case "tg":
      case "telegram":
        return "💬";
      case "tw":
      case "twitter":
        return "🐦";
      case "lk":
      case "linkedin":
        return "💼";
      case "fb":
      case "facebook":
        return "👥";
      default:
        return "🔗";
    }
  };

  const getFullShortUrl = (link) => {
    const { tag, id, linkType } = link;
    const cleanTag = tag ? (tag.toLowerCase() === "youtube" ? "yt" : tag.toLowerCase()) : "web";
    if (linkType === "ad-free") {
      return `https://appopener.net/free/${cleanTag}/${id}`;
    } else if (linkType === "app") {
      if (link.promotedLinks.length > 0){
        return `https://appopener.com/${cleanTag}/a4/${id}`;
      }
      return `https://appopener.com/${cleanTag}/${id}`;
    }
    return `https://appopener.in/${cleanTag}/${id}`;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen text-white bg-black font-sans overflow-x-hidden pb-12">
      {/* Dynamic Starry Space Background */}
      <SpaceBackground />

      {/* Top Navbar */}
      <div className="relative z-30 pt-6 px-4">
        <TopNav />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 mt-12">
        {/* Back Button */}
        <motion.button 
          whileHover={{ x: -4 }}
          onClick={() => history.push("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-8 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm backdrop-blur-md"
        >
          <ArrowLeft size={16} /> Back to Home
        </motion.button>

        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-4 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <Sparkles size={14} className="animate-pulse" />
            <span>Premium Link Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            Retrieve Your Paid Links
          </h1>
          <p className="text-gray-400 mt-3 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Enter your mobile number below to retrieve and manage all your purchased App and Ad-Free links.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative max-w-lg mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-12"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide uppercase">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  placeholder="e.g. +919876543210"
                  value={phone}
                  onChange={(e) => setPhone(cleanPhone(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 focus:border-indigo-500/80 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all duration-300 font-medium text-base shadow-inner focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.4)] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search size={18} />
                  <span>Retrieve Links</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {searched && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {links.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                      <span>Found Links</span>
                      <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                        {links.length}
                      </span>
                    </h2>
                  </div>

                  <motion.div 
                    variants={gridVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {links.map((link) => {
                      const fullShortUrl = getFullShortUrl(link);
                      const isAdFree = link.linkType === "ad-free";
                      
                      return (
                        <motion.div
                          key={link._id || link.id}
                          variants={cardVariants}
                          whileHover={{ y: -6, boxShadow: "0 20px 30px rgba(0,0,0,0.4)" }}
                          className="relative bg-white/[0.02] border border-white/5 hover:border-white/15 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
                        >
                          {/* Badge for link type */}
                          <div className="absolute top-6 right-6">
                            {isAdFree ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-2.5 py-1 uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                                <Star size={11} fill="currentColor" /> Ad-Free Link
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-1 uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                                <Smartphone size={11} /> A4 App Link
                              </span>
                            )}
                          </div>

                          <div>
                            {/* Platform Icon & Tag */}
                            <div className="flex items-center gap-3 mb-6">
                              <span className="text-3xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                                {getPlatformIcon(link.tag)}
                              </span>
                              <div>
                                <h3 className="font-bold text-gray-200 text-lg uppercase tracking-wide">
                                  {link.tag || "Web"}
                                </h3>
                                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                  <Calendar size={12} />
                                  <span>{link.created_at ? new Date(link.created_at).toLocaleDateString() : "N/A"}</span>
                                </p>
                              </div>
                            </div>

                            {/* Link display */}
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block mb-1">
                                  Original Link
                                </label>
                                <p className="text-gray-300 text-sm truncate font-medium bg-black/20 rounded-lg p-2.5 border border-white/5 select-all">
                                  {link.originalURL}
                                </p>
                              </div>

                              <div>
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block mb-1">
                                  Smart Short Link
                                </label>
                                <p className="text-indigo-400 text-sm truncate font-semibold bg-black/20 rounded-lg p-2.5 border border-white/5 select-all">
                                  {fullShortUrl}
                                </p>
                              </div>
                            </div>
                          </div>

                          {link.promotedLinks?.length > 0 && (
                            <div>
                              <h3 className="text-sm font-bold mb-2">Promoted Links</h3>

                              {link.promotedLinks.map((item, index) => (
                                <div key={index} className="mb-3">
                                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block mb-1">
                                    Promoted Link {index+1}
                                  </label>

                                  <p className="text-gray-300 text-sm truncate font-medium bg-black/20 rounded-lg p-2.5 border border-white/5 select-all">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Footer Info & Actions */}
                          <div className="border-t border-white/5 mt-6 pt-4 flex items-center justify-between">
                            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                              <MousePointerClick size={14} className="text-indigo-400" />
                              <span>Clicks:</span>
                              <strong className="text-white font-bold">{link.click_count || 0}</strong>
                            </span>

                            <div className="flex gap-2">
                              {/* Copy Button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCopy(fullShortUrl, link._id || link.id)}
                                className={`flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl transition-all duration-300 border ${
                                  copiedId === (link._id || link.id)
                                    ? "bg-green-600/20 border-green-500/40 text-green-400"
                                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {copiedId === (link._id || link.id) ? (
                                  <>
                                    <Check size={13} />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={13} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </motion.button>

                              {/* Visit Link */}
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={fullShortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-white py-2 px-4 rounded-xl transition-all duration-300"
                              >
                                <ExternalLink size={13} />
                                <span>Visit</span>
                              </motion.a>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center bg-white/[0.02] border border-white/5 rounded-3xl p-12 max-w-md mx-auto"
                >
                  <div className="text-4xl mb-4">🛸</div>
                  <h3 className="font-bold text-gray-200 text-lg">No Paid Links Found</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    We couldn't find any premium links associated with this mobile number. Make sure the number matches the one entered during checkout.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RetrieveLinks;
