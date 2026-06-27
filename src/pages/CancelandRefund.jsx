import React from "react";
import Footer from "../components/Footer";
import styles from "./PrivacyPolicy.module.css";
import classes from "../components/Styles.module.css";
import CancelandRefundSection from "../components/Policies/CancelandRefundSection";
import PatternLogo from "../assets/pattern.avif";
/* import Float from '../components/side_button'; */
import Floattwo from '../components/side_button2';
import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";

const CancelAndRefund = () => {
  return (
    <div className={styles.mainContainer}>
      {/* <G13Ads/> */}
      <AdsterraAd/>
      <CancelandRefundSection />
      <div className={styles.container}>
        <div>
          <p id={styles.subtext}>
            At AppOpener, we strive to offer seamless branded link services. This Cancellation and Refund policy explains the process for canceling branded link orders and requesting refunds.
          </p>

          <div className={styles.policySingleContainer}>
            <h3>Cancellation of Branded Link Orders</h3>
            <p>
              If you wish to cancel your branded link order, you may do so within 12 hours of purchase, provided the link has not been delivered or processed. If the order has already been processed or delivered, cancellations will not be possible. To request a cancellation, please email us at <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Refund Eligibility</h3>
            <p>
              Refunds are available for branded link orders only under the following conditions:
              <ul>
                <li>The branded links have not been delivered yet.</li>
                <li>The customer requests a refund within 12 hours of placing the order.</li>
                <li>The branded link does not match the specifications agreed upon at the time of purchase (e.g., incorrect domain, wrong customization).</li>
              </ul>
              Once the branded links have been delivered, refunds will not be issued unless there is an error on our end.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>How to Request a Refund</h3>
            <p>
              To request a refund, please contact our support team at <a href="mailto:contactus@appopener.com">contactus@appopener.com</a> with your order number and the reason for the refund. Our team will review your request and get back to you within 24 hours.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Processing Refunds</h3>
            <p>
              Once your refund request is approved, we will process the refund within 5-7 business days. The refund will be credited to your original payment method. Please note that certain payment methods may take additional time to reflect the refund in your account.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Non-Refundable Items</h3>
            <p>
              Custom branded links and services that have been delivered or fulfilled are generally not eligible for refunds. This includes domain registrations, bulk link purchases, and custom-designed links unless there is a fault from our side.
            </p>
          </div>

          <p id={styles.subtext}>
            If you have any further questions or concerns regarding cancellations or refunds, feel free to contact our team at <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>.
          </p>
        </div>

        <div className={classes.patternImg}>
          <img src={PatternLogo} alt="pattern" />
        </div>
      </div>
      <Footer />
    {/*  {/*   <Float /> */}
      <Floattwo />
    </div>
  );
};

export default CancelAndRefund;
