import React from "react";
import Footer from "../components/Footer";
import styles from "./PrivacyPolicy.module.css";
import classes from "../components/Styles.module.css";
import ContactSection from "../components/Policies/ContactSection";
import PatternLogo from "../assets/pattern.avif";
import Float from '../components/side_button';
import Floattwo from '../components/side_button2';
import BottomNav from "../components/bottom";
// import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";
const ContactUs = () => {
  return (
    <div className={styles.mainContainer}>

      {/* <G13Ads/> */}
      <AdsterraAd/>
      <ContactSection />
      <div className={styles.container}>
        <div>
          <p id={styles.subtext}>
            Have any questions, issues, or feedback? We’re here to help. Use the following methods to get in touch with us for all matters related to your branded link services.
          </p>

          <div className={styles.policySingleContainer}>
            <h3>Contact Information</h3>
            <p>
              You can reach us using the following methods:
              <ul>
                <li>
                  <b>Email:</b> For general inquiries and support, send us an email at <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>. We typically respond within 24 hours.
                </li>
              </ul>
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Support for Branded Links</h3>
            <p>
              For support regarding your branded link orders, including delivery status, customization requests, or any technical issues, please send us an email at <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>.
              <br />
              Be sure to include your order number or account details to help us resolve your issue as quickly as possible.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Collaborations and Business Inquiries</h3>
            <p>
              If you are interested in collaborating with us or have business-related inquiries, please email us at <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>. We welcome partnership opportunities and are always looking for ways to work with like-minded businesses.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Feedback</h3>
            <p>
              Your feedback is valuable to us! If you have any suggestions or ideas on how we can improve our services, we would love to hear from you. Feel free to reach out via <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>.
            </p>
          </div>


          <p id={styles.subtext}>
            Thank you for choosing AppOpener! We’re here to assist you with any queries you might have.
          </p>
        </div>

        <div className={classes.patternImg}>
          <img src={PatternLogo} alt="pattern" />
        </div>
      </div>
      <BottomNav />
      <Footer />
     {/*   <Float /> */}
      <Floattwo />
    </div>
  );
};

export default ContactUs;
