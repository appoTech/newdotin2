import React from "react";
import Footer from "../components/Footer";
import styles from "./PrivacyPolicy.module.css";
import classes from "../components/Styles.module.css";
import HeroTermsSection from "../components/Policies/HeroTermsSection";
import PatternLogo from "../assets/pattern.avif";
import Float from '../components/side_button';
import Floattwo from '../components/side_button2';
// import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";

const TermsAndConditions = () => {
  return (
    <div className={styles.mainContainer}>
      {/* <G13Ads/> */}
      <AdsterraAd/>
      <HeroTermsSection />
      <div className={styles.container}>
        {/* <h1 id={styles.head}>Privacy Policy</h1> */}
        <div>
          <p id={styles.subtext}>
            Welcome to AppOpener! These Terms and Conditions <b>("Terms")</b> govern your use of 
            the AppOpener website and services available at: 
            <a href="https://www.appopener.com"> www.appopener.com</a> 
            <br/>Please read these Terms carefully before using our services.
            <br/>By accessing or using the AppOpener website, you agree to be bound 
            by these Terms. If you do not agree with any part of these Terms, please 
            do not use our services.
          </p>

          <div className={styles.policySingleContainer}>
            <h3>Acceptance of Terms</h3>
            <p>
            By using AppOpener, you agree to comply with and be bound by these Terms. 
            If you do not agree to these Terms, please refrain from using our services.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Description of Services</h3>
            <p>
            AppOpener provides URL shortening and smart link services. 
            Users can create shortened URLs and smart links to efficiently share and manage links.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>User Accounts</h3>
            <p>
            To access certain features of AppOpener, you may be required to create a user account. 
            You are responsible for maintaining the confidentiality of your account information and are fully 
            responsible for all activities that occur under your account.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>User Conduct</h3>
            <p>
            You agree to use AppOpener for lawful purposes only. You are prohibited 
            from engaging in any activity that may disrupt, damage, or interfere 
            with the functionality of the Website or the services provided.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Intellectual Property</h3>
            <p>
            All content and materials available on the AppOpener Website, including 
            but not limited to text, graphics, logos, button icons, images, 
            and software, are the property of AppOpener and are protected by applicable 
            copyright and trademark law.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Disputes Resolution</h3>
            <p>
            If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Privacy</h3>
            <p>
            Your use of AppOpener is also governed by our Privacy Policy, available at <a href="https://www.appopener.com/privacy-policy">Privacy Policy</a>. 
            Please review the Privacy Policy to understand how we collect, use, and disclose your information.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Termination of Services</h3>
            <p>
            AppOpener reserves the right to terminate or suspend your access to the services 
            at any time, with or without cause, and with or without notice.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Changes to Terms</h3>
            <p>
            AppOpener reserves the right to modify or revise these Terms at any time. 
            Continued use of the services after such changes constitutes your 
            acceptance of the new Terms.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Disclaimer of Warranties</h3>
            <p>
            AppOpener provides its services on an "as-is" and "as-available" basis. 
            We do not warrant that our services will be uninterrupted, error-free, or secure.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Limitation of Liability</h3>
            <p>
            AppOpener shall not be liable for any indirect, incidental, special, consequential, or 
            punitive damages, or any loss of profits or revenues.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Governing Law</h3>
            <p>
            The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3></h3>
            <p>
            If you have any questions or concerns regarding these Terms, 
            please contact us at <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>
            </p>
          </div>

          <p id={styles.subtext}>
            Thank you for using AppOpener!
          </p>
        </div>

        <div className={classes.patternImg}>
          <img src={PatternLogo} alt="pattern" />
        </div>
      </div>
      <Footer />
      <Float/>
      <Floattwo/>
    </div>
  );
};

export default TermsAndConditions;
