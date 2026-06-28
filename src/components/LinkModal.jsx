import React from "react";
import { useState, useEffect } from "react";
import { FaEdit, FaLink } from "react-icons/fa";
import { Pencil, X, Download } from "lucide-react";
import InApp from "detect-inapp";
import ShareButton from "react-web-share-button";
import ShareButtons from "./share";
import StoryModal from "./StoryModal";
import { ToastContainer, toast } from "react-toastify";
import LoadingScreen from "./Loader";
import SpaceBackground from "./spaceComponent";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../assets/logo.avif";

const LinkModal = ({ isOpen, onClose, link, originalUrl, type, onClickAway }) => {
  const [editable, setEditable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [updatedShortId, setUpdatedShortId] = useState("");
  const [updatedLink, setUpdatedLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [newThumbnanil, setNewThumbnail] = useState("");
  const [error, setError] = useState("");
  const [shortId, setShortId] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setloading] = useState(true);
  const [Success, setSuccess] = useState(false);
  const [Story, setStory] = useState(false);

  // Promoted Links States
  const [showPromoteForm, setShowPromoteForm] = useState(false);
  const [pLinks, setPLinks] = useState(["", "", "", ""]);
  const [promoName, setPromoName] = useState("");
  const [promoEmail, setPromoEmail] = useState("");
  const [promoPhone, setPromoPhone] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);

  // FINAL LINK (handles edited shortId)
  function addA4(str) {
  const lastSlashIndex = str.lastIndexOf("/");

  if (lastSlashIndex === -1) {
    return str; // no "/" found
  }

  return (
    str.slice(0, lastSlashIndex + 1) +
    "a4/" +
    str.slice(lastSlashIndex + 1)
  );
}

  const finalLink = updatedShortId
    ? `${link.replace(/(.*yt\/).*/, "$1")}${updatedShortId}`
    : link;

  const [paidLink, setPaidLink] = useState(finalLink);
  const [currentType, setCurrentType] = useState(type);

  useEffect(() => {
    setCurrentType(type);
  }, [type]);

  useEffect(() => {
    if (link) {
      const finalL = updatedShortId
        ? `${link.replace(/(.*yt\/).*/, "$1")}${updatedShortId}`
        : link;
      setPaidLink(finalL);
    }
  }, [link, updatedShortId]);

  const downloadQR = () => {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `appopener-${shortId || "link"}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePromoteSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const activeLinks = pLinks.filter((l) => l.trim() !== "");
    if (activeLinks.length === 0) {
      toast.error("Please enter at least one link to promote");
      return;
    }

    // URL validation using browser native URL constructor
    for (let linkStr of activeLinks) {
      try {
        const parsedUrl = new URL(linkStr.startsWith("http") ? linkStr : `https://${linkStr}`);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          throw new Error();
        }
      } catch (err) {
        toast.error(`Invalid URL: ${linkStr}`);
        return;
      }
    }

    if (!promoName || !promoEmail || !promoPhone) {
      toast.error("Please fill in all payment details");
      return;
    }

    setPromoLoading(true);

    try {
      // 1. Create Cashfree payment order on backend
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}payment/createOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: promoName,
            customer_email: promoEmail,
            customer_phone: promoPhone,
            amount: 99,
            OrderType: "promote_links",
            promoted_links_data: {
              shortId: shortId,
              links: activeLinks,
            },
          }),
        }
      );

      const orderData = await response.json();
      if (!response.ok || !orderData.success || !orderData.payment_session_id) {
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      // 2. Load Cashfree SDK
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

      const CashfreeInstance = await loadCashfreeSDK();
      const cashfree = CashfreeInstance({ mode: "sandbox" });

      console.log(orderData.payment_session_id);

      // 3. Open checkout modal
      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      }).then(() => {
        // Poll status on payment modal close or completion
        pollPromoPaymentStatus(orderData.order_id);
      });

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to initiate payment");
      setPromoLoading(false);
    }
  };

  const pollPromoPaymentStatus = (orderIdToPoll) => {
    let pollCount = 0;
    const POLL_INTERVAL = 3000;
    const MAX_POLLS = 10;

    const poll = async () => {
      pollCount++;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}payment/verify/${orderIdToPoll}`
        );
        const verifyData = await response.json();

       if (verifyData.order_status === "PAID") {
        const updatedLink = addA4(finalLink);
        setPaidLink(updatedLink);
        toast.success("Payment successful! Promoted links added.");
        setPromoSuccess(true);
        setShowPromoteForm(false);
        setPromoLoading(false);

  return;
}

        if (verifyData.order_status === "EXPIRED" || verifyData.order_status === "TERMINATED") {
          toast.error("Payment failed or expired.");
          setPromoLoading(false);
          return;
        }

        if (pollCount < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          toast.error("Payment verification timed out. If you paid, it will update automatically soon.");
          setPromoLoading(false);
        }
      } catch (error) {
        console.error("Verification error:", error);
        if (pollCount < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          toast.error("Could not verify payment status.");
          setPromoLoading(false);
        }
      }
    };

    poll();
  };

  useEffect(() => {
    const fetchPreview = async () => {
      setloading(true);
      try {
        const url = new URL(link);
        const extractedShortId = url.pathname.split("/").pop();
        setShortId(extractedShortId);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}yt/preview/${extractedShortId}`
        );
        if (!response.ok) {
          toast.error("Link Generated!, Failed to fetch preview");
          throw new Error("Failed to fetch preview");
        }

        const { title, description, thumbnail } = await response.json();
        setTitle(title);
        setThumbnail(thumbnail);
        setloading(false);
      } catch (error) {
        console.error("Error fetching preview:", error);
        setThumbnail("https://placehold.co/600x400/1a1a2e/ffffff?text=Link+Preview");
        setTitle("Your AppOpener Link");
        setloading(false);
        setTimeout(() => toast.info("Link Generated!"), 100);
      }
    };

    if (link) {
      fetchPreview();
    }
  }, [link]);

  const validateDomainSafeShortId = (id) => {
    if (!id) return { isValid: false, message: "Short ID is required" };
    if (id.length > 63) return { isValid: false, message: "Short ID too long" };
    if (!/^[a-zA-Z0-9-]+$/.test(id))
      return {
        isValid: false,
        message: "Only letters, numbers and hyphens allowed",
      };
    return { isValid: true };
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const validation = validateDomainSafeShortId(updatedShortId);
  //   if (!validation.isValid) {
  //     toast.error(validation.message);
  //     return;
  //   }

  //   setloading(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("link", originalUrl);
  //     if (updatedShortId) formData.append("customShortId", updatedShortId);
  //     if (selectedFile) formData.append("image", selectedFile);

  //     const response = await fetch(
  //       process.env.REACT_APP_API_URL + "createOpenURL",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const updatedData = await response.json();
  //     if (!response.ok) throw new Error(updatedData.message);

  //     toast.success("Link updated successfully!");
  //     setUpdatedLink(finalLink);
  //     setEditable(false);
  //   } catch (err) {
  //     toast.error("Something went wrong");
  //   } finally {
  //     setloading(false);
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="relative z-[99999]">
      <ToastContainer style={{ zIndex: 100000 }} />
      {loading && <LoadingScreen isLoading={loading} />}

      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]"
        onClick={() => {
          if (!Story) (onClickAway || onClose)();
        }}
      >
        <div
          className="shadow-lg p-2 m-2 w-[95vw] md:w-[400px] max-h-[95vh] relative rounded-xl text-white border-white border-2 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <SpaceBackground />
          <div className="relative z-10">
            {/* HEADER */}
            <div className="flex justify-between items-center pt-1">
              <h2 className="text-lg font-semibold">BRAND YOUR LINKS</h2>
              <button
                onClick={onClose}
                className="border border-white rounded px-2"
              >
                <X size={20} />
              </button>
            </div>

              <>
                {/* THUMBNAIL */}
                <div className="w-full bg-gray-100 rounded-md mt-1">
                  <img
                    src={newThumbnanil || thumbnail || logo}
                    alt="Preview"
                    className="w-full h-[18vh] md:h-[20vh] object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = logo;
                    }}
                  />
                </div>

                {/* {!editable ? ( */}
                  <div className="flex flex-col items-center mt-1">
                    {/* LINK */}
                    <div className="flex items-center w-full mb-2 border border-white rounded">
                      <span className="p-2 bg-secondary">
                        <FaLink size={14} />
                      </span>
                      <div className="flex-1 text-center px-2 truncate">
                        {paidLink}
                      </div>
                      {/* <button
                        className="p-2 bg-secondary"
                        onClick={() => setEditable(true)}
                      >
                        <Pencil size={14} />
                      </button> */}
                    </div>

                    {/* COPY / SHARE */}
                    <div className="flex gap-2 w-full mb-1">
                      <button
                        className="flex-1 border rounded py-1.5 px-2 text-white text-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(paidLink);
                          toast.success("Link copied 📋");
                        }}
                      >
                        Copy Link
                      </button>

                      <ShareButton
                        title="AppOpener Smartlink"
                        url={paidLink}
                        buttonStyle={{
                          backgroundColor: "white",
                          color: "black",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "1px solid #EDE5E3",
                          width: "50%",
                          fontSize: "14px",
                        }}
                      />
                    </div>

                    {/* QR */}
                    <div className="relative bg-white p-1 rounded-lg shadow-md mt-1">
                      <QRCodeCanvas
                        id="qr-canvas"
                        value={paidLink}
                        size={120}
                        level="H"
                        includeMargin={false}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white p-0.5 rounded-md shadow">
                          <img
                            src={logo}
                            alt="Logo"
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={downloadQR}
                      className="mt-1 flex items-center gap-1 border px-2 py-1 rounded hover:bg-gray-100 text-white text-sm"
                    >
                      <Download size={14} />
                      Download QR
                    </button>

                    {/* STORY */}
                    <button
                      className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-bold text-base rounded py-1.5"
                      onClick={() => setStory(true)}
                    >
                      SUPER STORY
                    </button>


                  </div>
                {/* ) : (
                  <>
                    <div className="flex items-center mt-3 border rounded">
                      <span className="bg-gray-200 px-2 text-sm text-black">
                        https://appopener.com/yt/
                      </span>
                      <input
                        type="text"
                        value={updatedShortId}
                        onChange={(e) =>
                          setUpdatedShortId(e.target.value.toLowerCase())
                        }
                        className="flex-1 px-2 py-2 text-black outline-none"
                        placeholder="custom-short-id"
                      />
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex-1 bg-green-500 text-white py-2 rounded"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                      <button
                        className="flex-1 border rounded py-2"
                        onClick={() => setEditable(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )} */}
              </>
          </div>

          <StoryModal
            isOpen={Story}
            onClose={() => setStory(false)}
            link={paidLink}
            shortId={shortId}
            title={title}
            thumbnail={thumbnail}
          />
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
