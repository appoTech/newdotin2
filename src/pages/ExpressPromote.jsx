import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import logo from "../assets/AppOpener.png";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const POLL_INTERVAL = 3000;
const MAX_POLLS = 10;
const PROMOTE_PRICE = 10;

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

const ExpressPromote = () => {
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const contextLink = params.get("link") || "";
  const fileInputRef = useRef(null);
  const pollTimerRef = useRef(null);
  const pollCountRef = useRef(0);

  const [form, setForm] = useState({
    title: "",
    linkUrl: contextLink,
    name: "",
    email: "",
    mobile: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState("form"); // "form" | "paying" | "success" | "pending"
  const [orderId, setOrderId] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setResult({ success: false, message: "Image must be under 5MB" });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Poll payment status
  const pollPaymentStatus = useCallback((orderIdToPoll) => {
    pollCountRef.current = 0;

    const poll = async () => {
      pollCountRef.current++;

      try {
        const { data } = await axios.get(
          `${API_URL}payment/verify/${orderIdToPoll}`
        );

        if (data.order_status === "PAID") {
          // Promotion delivered server-side
          setStep("success");
          setResult({ success: true, message: "Payment successful & promotion submitted! 🎉" });
          setSubmitting(false);
          return;
        }

        if (data.order_status === "EXPIRED" || data.order_status === "TERMINATED") {
          setStep("form");
          setResult({ success: false, message: "Payment failed or expired. Please try again." });
          setSubmitting(false);
          return;
        }

        if (pollCountRef.current < MAX_POLLS) {
          pollTimerRef.current = setTimeout(poll, POLL_INTERVAL);
        } else {
          setStep("pending");
          setSubmitting(false);
        }
      } catch (error) {
        setStep("form");
        setResult({ success: false, message: "Could not verify payment status." });
        setSubmitting(false);
      }
    };

    poll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      // 1. Create order (without image — image uploaded after payment)
      const { data } = await axios.post(`${API_URL}payment/createOrder`, {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.mobile,
        amount: PROMOTE_PRICE,
        OrderType: "promotion",
        promotion_data: {
          title: form.title,
          linkUrl: form.linkUrl,
          imageUrl: null,
        },
      });

      if (!data.success || !data.payment_session_id) {
        throw new Error("Failed to create order");
      }

      setOrderId(data.order_id);

      // 2. Open Cashfree checkout
      setStep("paying");
      const Cashfree = await loadCashfreeSDK();
      const cashfree = Cashfree({ mode: "sandbox" }); // change to "production" for live

      cashfree
        .checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal",
        })
        .then(() => {
          pollPaymentStatus(data.order_id);
        });
    } catch (error) {
      console.error("Payment Error:", error);
      setStep("form");
      setResult({
        success: false,
        message: error?.response?.data?.error || error.message || "Payment failed",
      });
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    setStep("form");
    setResult(null);
    setSubmitting(false);
    setOrderId("");
    setImageUploaded(false);
    setUploadingImage(false);
    setForm({ title: "", linkUrl: "", name: "", email: "", mobile: "" });
    removeImage();
  };

  // Upload image after payment (on success screen)
  const handlePostPaymentUpload = async () => {
    if (!imageFile || !orderId) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("order_id", orderId);
      await axios.post(`${API_URL}payment/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUploaded(true);
    } catch (err) {
      setResult({
        success: false,
        message: err?.response?.data?.error || "Image upload failed. You can try again.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // ── Success Screen ──
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-gray-800/60 backdrop-blur-md border border-purple-600 rounded-2xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Promotion Submitted!</h2>
            <p className="text-green-400 text-sm font-semibold mb-6">
              {result?.message}
            </p>

            {/* Image upload section — only shown after payment */}
            {!imageUploaded && (
              <div className="mb-6 text-left">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  📷 Add an image to your promotion <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-xl border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg transition"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-6 bg-gray-900 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-purple-500 hover:text-purple-400 transition text-center cursor-pointer mb-3"
                  >
                    Click to select image
                  </button>
                )}
                {imageFile && (
                  <button
                    onClick={handlePostPaymentUpload}
                    disabled={uploadingImage}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
                      uploadingImage
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    }`}
                  >
                    {uploadingImage ? "Uploading..." : "⬆️ Upload Image"}
                  </button>
                )}
              </div>
            )}

            {imageUploaded && (
              <div className="mb-6 py-3 px-4 rounded-xl bg-green-900/50 border border-green-700 text-green-400 text-sm font-semibold">
                ✅ Image uploaded successfully!
              </div>
            )}

            {result && !result.success && (
              <div className="mb-4 py-2 px-4 rounded-lg bg-red-900/50 text-red-400 border border-red-700 text-sm font-semibold">
                {result.message}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={resetForm}
                className="w-full py-3.5 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30 active:scale-[0.98]"
              >
                Submit Another
              </button>
              <button
                onClick={() => window.location.href = "https://apposlash.com"}
                className="w-full py-3 rounded-xl font-semibold text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 transition"
              >
                Create Your Own QRPA
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Pending Screen ──
  if (step === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-gray-800/60 backdrop-blur-md border border-yellow-600 rounded-2xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Pending</h2>
            <p className="text-yellow-400 text-sm mb-6">
              Your payment is still being processed. Your promotion will be submitted once the payment is confirmed.
            </p>
            <div className="space-y-3">
              <button
                onClick={resetForm}
                className="w-full py-3 rounded-xl font-semibold text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 transition"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={logo} alt="AppOpener" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-white">Promote Your Link</h1>
        </div>

        {/* Paying indicator */}
        {step === "paying" && (
          <div className="mb-4 text-center py-3 px-4 rounded-xl border border-purple-600 bg-gray-800/80 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-white">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span className="font-semibold">Processing payment...</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="My awesome link"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Link URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              name="linkUrl"
              value={form.linkUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* Name, Email & Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Mobile <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit phone number"
                placeholder="9876543210"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* Image note */}
          <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-gray-900/30 border border-gray-700 text-gray-400 text-sm">
            <span>📷</span>
            <span>You can add an image to your promotion after payment</span>
          </div>

          {/* Price display */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-purple-600 bg-gray-900/50">
            <span className="text-gray-300 text-sm font-semibold">Promotion Fee</span>
            <span className="text-white text-lg font-bold">₹{PROMOTE_PRICE}</span>
          </div>

          {/* Result message */}
          {result && (
            <div
              className={`text-center text-sm font-semibold py-2 px-4 rounded-lg ${
                result.success
                  ? "bg-green-900/50 text-green-400 border border-green-700"
                  : "bg-red-900/50 text-red-400 border border-red-700"
              }`}
            >
              {result.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg ${
              submitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30 active:scale-[0.98]"
            }`}
          >
            {submitting ? "Processing..." : `🚀 Pay ₹${PROMOTE_PRICE} & Submit`}
          </button>
        </form>

        {/* Back link */}
        <button
          onClick={() => history.goBack()}
          className="mt-6 w-full text-center text-gray-400 hover:text-white text-sm font-medium transition"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default ExpressPromote;
