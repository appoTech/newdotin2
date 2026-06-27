import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { addPagerMessage } from "../helper/api";
import logo from "../assets/AppOpener.png";
import axios from "axios";
// NOTE: addPagerMessage is only used for free SOS messages.
// Paid messages (chat/donate) are stored with the order and
// delivered server-side after payment verification.

const API_URL = process.env.REACT_APP_API_URL;
const POLL_INTERVAL = 3000;
const MAX_POLLS = 10;

const modeConfig = {
  chat: {
    label: "Send a Message",
    emoji: "💬",
    accent: "green",
    bg: "from-gray-950 via-green-950 to-gray-950",
    border: "border-green-600",
    buttonBg: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
    shadow: "shadow-green-500/30",
    inputBorder: "focus:border-green-500 focus:ring-green-500",
    resultOk: "bg-green-900/50 text-green-400 border-green-700",
    fixedAmount: 0,
  },
  donate: {
    label: "Send a Don8 Message",
    emoji: "❤️",
    accent: "yellow",
    bg: "from-gray-950 via-yellow-950 to-gray-950",
    border: "border-yellow-600",
    buttonBg: "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
    shadow: "shadow-yellow-500/30",
    inputBorder: "focus:border-yellow-500 focus:ring-yellow-500",
    resultOk: "bg-yellow-900/50 text-yellow-400 border-yellow-700",
    fixedAmount: null, // user picks
  },
  sos: {
    label: "Send an SOS",
    emoji: "🚨",
    accent: "red",
    bg: "from-gray-950 via-red-950 to-gray-950",
    border: "border-red-600",
    buttonBg: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700",
    shadow: "shadow-red-500/30",
    inputBorder: "focus:border-red-500 focus:ring-red-500",
    resultOk: "bg-red-900/50 text-red-400 border-red-700",
    fixedAmount: 1, // ₹1 minimum
  },
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

const ExpressPager = () => {
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "chat";
  const slug = params.get("slug") || "";
  const creator = params.get("creator") || "";
  const config = modeConfig[type] || modeConfig.chat;

  const [form, setForm] = useState({
    text: "",
    name: "",
    email: "",
    phone: "",
    amount: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState("form"); // "form" | "paying" | "success" | "pending"
  const pollTimerRef = useRef(null);
  const pollCountRef = useRef(0);
  const pendingMessageRef = useRef(null); // store message data to send after payment

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPayAmount = () => {
    if (config.fixedAmount !== null) return config.fixedAmount;
    return Number(form.amount) || 0;
  };

  // Poll payment status after checkout
  const pollPaymentStatus = useCallback(
    (orderIdToPoll) => {
      pollCountRef.current = 0;

      const poll = async () => {
        pollCountRef.current++;

        try {
          const { data } = await axios.get(
            `${API_URL}payment/verify/${orderIdToPoll}`
          );

          if (data.order_status === "PAID") {
            // Payment succeeded → message already delivered server-side
            setStep("success");
            setResult({ success: true, message: "Payment successful & message sent! 🎉" });
            setSubmitting(false);
            return;
          }

          if (data.order_status === "EXPIRED" || data.order_status === "TERMINATED") {
            setStep("form");
            setResult({ success: false, message: "Payment failed or expired. Please try again." });
            setSubmitting(false);
            return;
          }

          // Still pending
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, type]
  );

  // Message delivery for paid types is handled entirely server-side
  // after payment confirmation. No frontend addPagerMessage call needed.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const payAmount = getPayAmount();

    // All types go through payment (SOS = ₹1, Chat = ₹40, Donate = custom)

    // For chat & donate: send message data with the order, backend delivers after payment
    pendingMessageRef.current = { ...form };

    try {
      // 1. Create order on backend (message data included)
      const { data } = await axios.post(`${API_URL}payment/createOrder`, {
        customer_name: form.name || "Anonymous",
        customer_email: form.email,
        customer_phone: form.phone,
        amount: payAmount,
        OrderType: type === "donate" ? "donation" : "pager_chat",
        pager_message: {
          text: form.text,
          source: type,
          name: type === "donate" ? form.name : undefined,
          pageSlug: slug,
          creatorName: creator,
        },
      });

      if (!data.success || !data.payment_session_id) {
        throw new Error("Failed to create order");
      }

      if (data.payment_session_id === "free_order") {
        setStep("success");
        setResult({ success: true, message: "Message sent! 🎉" });
        setSubmitting(false);
        return;
      }

      // 2. Open Cashfree checkout
      setStep("paying");
      const Cashfree = await loadCashfreeSDK();
      const cashfree = Cashfree({ mode: "production" }); // change to "production" for live

      cashfree
        .checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal",
        })
        .then(() => {
          // Modal closed — poll for status
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

  const handleRetryVerify = () => {
    if (!pendingMessageRef.current) return;
    setSubmitting(true);
    setStep("paying");
    // Re-trigger the whole flow (user needs to pay again for a new order)
    handleSubmit(new Event("submit"));
  };

  const resetForm = () => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    setStep("form");
    setResult(null);
    setSubmitting(false);
    pendingMessageRef.current = null;
    setForm({ text: "", name: "", email: "", phone: "", amount: "" });
  };

  const needsPayment = true; // all types require payment

  // ── Success Screen ──
  if (step === "success") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${config.bg} flex items-center justify-center px-4 py-8`}>
        <div className="w-full max-w-lg">
          <div className={`bg-gray-800/60 backdrop-blur-md border ${config.border} rounded-2xl p-8 shadow-2xl text-center`}>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {type === "donate" ? "Thank You for Your Don8!" : "Message Sent!"}
            </h2>
            <p className={`text-sm font-semibold mb-6 ${
              result?.success ? "text-green-400" : "text-red-400"
            }`}>
              {result?.message}
            </p>
            <div className="space-y-3">
              <button
                onClick={resetForm}
                className={`w-full py-3.5 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg ${config.buttonBg} ${config.shadow} active:scale-[0.98]`}
              >
                Send Another
              </button>
              <button
                onClick={() => window.location.href = "https://apposlash.com"}
                className="w-full py-3 rounded-xl font-semibold text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 transition"
              >
                Get Your Own QRPA
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
      <div className={`min-h-screen bg-gradient-to-br ${config.bg} flex items-center justify-center px-4 py-8`}>
        <div className="w-full max-w-lg">
          <div className={`bg-gray-800/60 backdrop-blur-md border ${config.border} rounded-2xl p-8 shadow-2xl text-center`}>
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Pending</h2>
            <p className="text-yellow-400 text-sm mb-6">
              Your payment is still being processed. Your message will be sent once the payment is confirmed.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleRetryVerify}
                className={`w-full py-3.5 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg ${config.buttonBg} ${config.shadow} active:scale-[0.98]`}
              >
                Try Again
              </button>
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
    <div className={`min-h-screen bg-gradient-to-br ${config.bg} flex items-center justify-center px-4 py-8`}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={logo} alt="AppOpener" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-white">
            {config.emoji} {config.label}
          </h1>
        </div>

        {/* Paying indicator */}
        {step === "paying" && (
          <div className={`mb-4 text-center py-3 px-4 rounded-xl border ${config.border} bg-gray-800/80 backdrop-blur-md`}>
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
          className={`bg-gray-800/60 backdrop-blur-md border ${config.border} rounded-2xl p-6 shadow-2xl space-y-5`}
        >
          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Your Message <span className="text-red-400">*</span>
            </label>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              required
              rows={4}
              placeholder={
                type === "sos"
                  ? "Describe your emergency..."
                  : type === "donate"
                  ? "Leave a Don8 message..."
                  : "Type your message here..."
              }
              className={`w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none ${config.inputBorder} focus:ring-1 transition resize-none`}
            />
          </div>

          {/* Payment details (chat & donate) */}
          {needsPayment && (
            <>
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
                    className={`w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none ${config.inputBorder} focus:ring-1 transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit phone number"
                    placeholder="9876543210"
                    className={`w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none ${config.inputBorder} focus:ring-1 transition`}
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
                  className={`w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none ${config.inputBorder} focus:ring-1 transition`}
                />
              </div>

              {/* Donate: custom amount | Chat: show fixed price */}
              {type === "donate" ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Amount (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10000"
                    placeholder="100"
                    className={`w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none ${config.inputBorder} focus:ring-1 transition`}
                  />
                </div>
              ) : (
                <div className={`flex items-center justify-between py-3 px-4 rounded-xl border ${config.border} bg-gray-900/50`}>
                  <span className="text-gray-300 text-sm font-semibold">Message Fee</span>
                  <span className="text-white text-lg font-bold">{config.fixedAmount === 0 ? "Free" : `₹${config.fixedAmount}`}</span>
                </div>
              )}
            </>
          )}

          {/* Result message */}
          {result && (
            <div
              className={`text-center text-sm font-semibold py-2 px-4 rounded-lg border ${
                result.success
                  ? config.resultOk
                  : "bg-red-900/50 text-red-400 border-red-700"
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
                : `${config.buttonBg} ${config.shadow} active:scale-[0.98]`
            }`}
          >
            {submitting
              ? "Processing..."
              : type === "sos"
              ? "🚨 Send SOS"
              : type === "donate"
              ? `❤️ Pay ₹${form.amount || "0"} & Send`
              : config.fixedAmount === 0
              ? `💬 Send Free Message`
              : `💬 Pay ₹${config.fixedAmount} & Send`}
          </button>

          <button
            type="button"
            onClick={() => window.location.href = "https://apposlash.com"}
            className={`w-full py-3.5 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg ${config.buttonBg} ${config.shadow} active:scale-[0.98]`}
          >
            Get Your Own QRPA
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

export default ExpressPager;
