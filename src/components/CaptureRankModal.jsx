import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const CaptureRankModal = ({ isOpen, onClose, API_URL, loadCashfreeSDK, amount }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const pollPaymentStatus = (orderId) => {
    setVerifying(true);
    let pollCount = 0;
    const POLL_INTERVAL = 3000;
    const MAX_POLLS = 15;

    const poll = async () => {
      pollCount++;
      try {
        const { data } = await axios.get(`${API_URL}payment/verify/${orderId}`);

        if (data.order_status === "PAID") {
          toast.success("payment success");
          setTimeout(() => {
            setVerifying(false);
            onClose();
          }, 1500);
          return;
        }

        if (data.order_status === "EXPIRED" || data.order_status === "TERMINATED") {
          toast.error("Payment failed or expired.");
          setVerifying(false);
          return;
        }

        if (pollCount < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          toast.warn("Payment verification timed out. If money was debited, please wait.");
          setVerifying(false);
        }
      } catch (err) {
        console.error("Verification error:", err);
        if (pollCount < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          toast.error("Could not verify payment status.");
          setVerifying(false);
        }
      }
    };

    poll();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create order with real customer data
      const { data } = await axios.post(`${API_URL}payment/createOrder`, {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        amount: amount,
        OrderType: "capture_rank",
      });

      if (!data.success || !data.payment_session_id) {
        throw new Error("Failed to create order");
      }

      // Open Cashfree checkout
      const Cashfree = await loadCashfreeSDK();
      const cashfree = Cashfree({ mode: "sandbox" }); // sandbox or production based on active env

      cashfree
        .checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal",
        })
        .then(() => {
          console.log("Capture Rank checkout closed");
          pollPaymentStatus(data.order_id);
        });
    } catch (err) {
      console.error("Capture Rank Payment Error:", err);
      setError(err?.response?.data?.error || err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <ToastContainer style={{ zIndex: 99999 }} />
      <div className="bg-gray-900 border border-yellow-500/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          {verifying ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
              <div className="relative">
                {/* Outer spinning ring */}
                <div className="w-16 h-16 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 animate-spin"></div>
                {/* Inner pulsating crown icon */}
                <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                  👑
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Verifying Your Payment
                </h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                  Please do not close this window or refresh the page. We are confirming your transaction with Cashfree...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                  Capture Top Rank
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-6 bg-yellow-900/20 p-3 rounded-lg border border-yellow-700/30">
                You are about to capture the rank on the Leaderboard for ₹{amount}. Please enter your details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
                    placeholder="+91 9876543210"
                  />
                </div>

                {error && (
                  <div className="bg-red-900/50 border border-red-700 text-red-400 text-sm py-2 px-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 mt-2 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                    loading
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 hover:scale-[1.02] text-gray-900 shadow-yellow-600/30"
                  }`}
                >
                  {loading ? "Processing..." : `Pay ₹${amount}`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureRankModal;
