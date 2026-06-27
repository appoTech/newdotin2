import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import "./PaymentPage.css";

const API_URL = process.env.REACT_APP_API_URL;
const POLL_INTERVAL = 3000; // 3 seconds
const MAX_POLLS = 10; // max 30 seconds of polling

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

// Load PayPal SDK
const loadPayPalSDK = (clientId, currency = "USD") => {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.head.appendChild(script);
  });
};

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    amount: "",
    OrderType: "general",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | "success" | "error" | "pending"
  const [statusMessage, setStatusMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [showPaypal, setShowPaypal] = useState(false);

  const pollTimerRef = useRef(null);
  const pollCountRef = useRef(0);
  
  const paypalContainerRef = useRef(null);
  const formDataRef = useRef(formData);
  const localOrderIdRef = useRef("");

  // Sync formDataRef on change
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Toggle showPaypal state based on amount
  useEffect(() => {
    const amt = parseFloat(formData.amount);
    if (amt > 50000) {
      setShowPaypal(true);
    } else {
      setShowPaypal(false);
    }
  }, [formData.amount]);

  // Initialize and Render PayPal buttons when showPaypal is active
  useEffect(() => {
    let active = true;
    if (showPaypal) {
      const initPaypal = async () => {
        try {
          const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID || "sb";
          const paypal = await loadPayPalSDK(clientId, "USD");
          if (!active) return;

          if (paypalContainerRef.current) {
            paypalContainerRef.current.innerHTML = "";
            
            paypal.Buttons({
              createOrder: async (data, actions) => {
                const currentFormData = formDataRef.current;
                if (!currentFormData.customer_name || !currentFormData.customer_phone) {
                  alert("Please enter your name and phone number first.");
                  throw new Error("Validation failed");
                }
                
                setLoading(true);
                setStatus(null);
                setStatusMessage("");

                try {
                  const res = await axios.post(`${API_URL}payment/paypal/create-order`, currentFormData);
                  if (res.data.success) {
                    setOrderId(res.data.local_order_id);
                    localOrderIdRef.current = res.data.local_order_id;
                    return res.data.paypal_order_id;
                  } else {
                    throw new Error("Failed to create PayPal order");
                  }
                } catch (err) {
                  console.error("PayPal Create Order Error:", err);
                  setStatus("error");
                  setStatusMessage(err?.response?.data?.error || err.message || "Failed to initiate payment");
                  setLoading(false);
                  throw err;
                }
              },
              onApprove: async (data, actions) => {
                setLoading(true);
                setStatus("pending");
                setStatusMessage("Verifying your payment...");

                try {
                  const res = await axios.post(`${API_URL}payment/paypal/capture-order`, {
                    paypal_order_id: data.orderID,
                    local_order_id: localOrderIdRef.current
                  });

                  if (res.data.success) {
                    setStatus("success");
                    setStatusMessage("Payment successful! Thank you.");
                    setLoading(false);
                  } else {
                    throw new Error("Failed to capture payment");
                  }
                } catch (err) {
                  console.error("PayPal Capture Error:", err);
                  setStatus("error");
                  setStatusMessage(err?.response?.data?.error || err.message || "Failed to verify/capture payment");
                  setLoading(false);
                }
              },
              onError: (err) => {
                console.error("PayPal Checkout Error:", err);
                setStatus("error");
                setStatusMessage("An error occurred during PayPal checkout. Please try again.");
                setLoading(false);
              }
            }).render(paypalContainerRef.current);
          }
        } catch (err) {
          console.error("PayPal Initialization Error:", err);
          if (active) {
            setStatus("error");
            setStatusMessage("Could not load the PayPal checkout system.");
          }
        }
      };

      initPaypal();
    }

    return () => {
      active = false;
    };
  }, [showPaypal]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const pollPaymentStatus = useCallback((orderIdToPoll) => {
    pollCountRef.current = 0;

    const poll = async () => {
      pollCountRef.current++;

      try {
        const { data } = await axios.get(
          `${API_URL}payment/verify/${orderIdToPoll}`
        );

        if (data.order_status === "PAID") {
          setStatus("success");
          setStatusMessage("Payment successful! Thank you.");
          setLoading(false);
          return;
        }

        if (data.order_status === "EXPIRED" || data.order_status === "TERMINATED") {
          setStatus("error");
          setStatusMessage("Payment failed or expired. Please try again.");
          setLoading(false);
          return;
        }

        // Still ACTIVE/pending — keep polling if under limit
        if (pollCountRef.current < MAX_POLLS) {
          pollTimerRef.current = setTimeout(poll, POLL_INTERVAL);
        } else {
          // Max polls reached — show pending with manual retry
          setStatus("pending");
          setStatusMessage(
            "Payment is still being processed. You'll receive a confirmation once it's complete."
          );
          setLoading(false);
        }
      } catch (error) {
        setStatus("error");
        setStatusMessage("Could not verify payment status.");
        setLoading(false);
      }
    };

    poll();
  }, []);

  const handlePayment = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setStatus(null);
      setStatusMessage("");

      try {
        // 1. Create order on backend
        const { data } = await axios.post(
          `${API_URL}payment/createOrder`,
          formData
        );

        if (!data.success || !data.payment_session_id) {
          throw new Error("Failed to create order");
        }

        setOrderId(data.order_id);

        // 2. Load Cashfree SDK and open checkout
        const Cashfree = await loadCashfreeSDK();
        const cashfree = Cashfree({ mode: "production" }); // change to "production" for live

        cashfree
          .checkout({
            paymentSessionId: data.payment_session_id,
            redirectTarget: "_modal",
          })
          .then(() => {
            // Checkout modal closed — start polling
            setStatus("pending");
            setStatusMessage("Verifying your payment...");
            pollPaymentStatus(data.order_id);
          });
      } catch (error) {
        console.error("Payment Error:", error);
        setStatus("error");
        setStatusMessage(
          error?.response?.data?.error || error.message || "Payment failed"
        );
        setLoading(false);
      }
    },
    [formData, pollPaymentStatus]
  );

  const handleRetryVerify = () => {
    if (!orderId) return;
    setLoading(true);
    setStatus("pending");
    setStatusMessage("Verifying your payment...");
    pollPaymentStatus(orderId);
  };

  const resetForm = () => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    setStatus(null);
    setOrderId("");
    setLoading(false);
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      amount: "",
      OrderType: "general",
    });
  };

  // ── Success Screen ──
  if (status === "success") {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p className="order-id-text">Order ID: {orderId}</p>
            <p className="success-msg">{statusMessage}</p>
            <button className="payment-btn" onClick={resetForm}>
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Pending Screen ──
  if (status === "pending" && !loading) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <div className="pending-container">
            <div className="pending-icon">⏳</div>
            <h2>Payment Pending</h2>
            <p className="order-id-text">Order ID: {orderId}</p>
            <p className="pending-msg">{statusMessage}</p>
            <div className="pending-actions">
              <button className="payment-btn" onClick={handleRetryVerify}>
                Check Status Again
              </button>
              <button className="payment-btn-secondary" onClick={resetForm}>
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
    <div className="payment-page">
      <div className="payment-card">
        <div className="payment-header">
          <div className="payment-icon">💳</div>
          <h1>Secure Payment</h1>
          <p>Complete your payment securely with {showPaypal ? "PayPal" : "Cashfree"}</p>
        </div>

        {/* Polling indicator */}
        {status === "pending" && loading && (
          <div className="polling-banner">
            <span className="spinner"></span>
            <span>Verifying your payment...</span>
          </div>
        )}

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label htmlFor="customer_name">Full Name</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              placeholder="John Doe"
              value={formData.customer_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer_email">Email</label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              placeholder="john@example.com"
              value={formData.customer_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer_phone">Phone Number</label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              placeholder="9876543210"
              value={formData.customer_phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Enter a valid 10-digit phone number"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="100"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="OrderType">Order Type</label>
              <select
                id="OrderType"
                name="OrderType"
                value={formData.OrderType}
                onChange={handleChange}
              >
                <option value="general">General</option>
                <option value="premium">Premium</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
          </div>

          {status === "error" && (
            <div className="error-banner">
              <span>⚠️</span> {statusMessage}
            </div>
          )}

          {showPaypal ? (
            <div className="paypal-checkout-container" style={{ marginTop: "15px" }}>
              <div className="paypal-note" style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginBottom: "15px" }}>
                ℹ️ Payments over ₹50,000 are processed securely via PayPal.
              </div>
              <div ref={paypalContainerRef} id="paypal-button-container"></div>
            </div>
          ) : (
            <button type="submit" className="payment-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Processing...
                </span>
              ) : (
                `Pay ₹${formData.amount || "0"}`
              )}
            </button>
          )}
        </form>

        <div className="payment-footer">
          <span>🔒</span> Secured by {showPaypal ? "PayPal Payments" : "Cashfree Payments"}
        </div>
      </div>
    </div>
  );
};


export default PaymentPage;
