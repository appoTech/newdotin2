import React from "react";
import Footer from "../components/Footer";
import styles from "./PrivacyPolicy.module.css";
import classes from "../components/Styles.module.css";
import { Link } from "react-router-dom";
import { Row, Col, Button, Container, Card } from "react-bootstrap";
import { FaAmazonPay, FaDollarSign, FaWhatsapp } from "react-icons/fa";
import HeroPrivacyPolicySection from "../components/Policies/HeroPrivacyPolicySection";
import PatternLogo from "../assets/pattern.avif";
import Float from '../components/side_button';
import Floattwo from '../components/side_button2';
// import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";

const PrivacyPolicy = () => {
  return (
    <div className={styles.mainContainer}>
      {/* <G13Ads/> */}
      <AdsterraAd/>
      <HeroPrivacyPolicySection />
      <div className={styles.container}>
        {/* <h1 id={styles.head}>Privacy Policy</h1> */}
        <div>
          <p id={styles.subtext}>
            This Privacy Policy <b>(“Privacy Policy”)</b> shall help the user
            <b>(“creator”/“viewer”/“you”/“your”)</b> to know the manner in which
            your Information <b>(“Information”)</b> shall be collected,
            retained, used and protected pertaining to the services{" "}
            <b>(“Services”)</b>provided on the application of Appopener
            <b>(“Application”/“us”/“our”/“We”)</b>. It must be noted that your
            information collected, retained and used shall be protected as per
            the applicable laws of India.
            <br />
            By accessing or availing the Services of our Application, you agree
            to abide by the Privacy Policy and here forth, consent to collect,
            retain and use your Information as provided herein. In case you
            differ from the terms of the Privacy Policy, you may abstain from
            accessing or availing any Services on our Application.
            <br />
            We pledge to respect your online privacy and protection of any
            information that you share with us on our Application.
          </p>

          <div className={styles.policySingleContainer}>
            <h3>Scope</h3>
            <p>
              By accessing and/or availing of the Services on our Application,
              you agree to abide by the Terms & Conditions of our Application.
              It shall lead to a legal agreement between you and us. You shall
              also undertake that you have the legal capacity to enter into a
              legal agreement with us, which shall lead to a legally enforceable
              contract between you and us.
              <br />
              This Privacy Policy provides the types of information that the
              Application collects, retains and processes; how the Information
              is collected; and where is the Information shared. The Application
              shall collect, retain and process your information, for the
              purpose of providing you smooth Services. Your Information
              collected by us, shall not be shared with anyone and shall be safe
              with us. However, it may be shared with the third party, only if
              you consent to it on our Application.
              <br />
              We provide utmost security to your sensitive information on our
              Application. Please be noted that we have proper servers to
              protect your information, but no data can be fully protected from
              getting hacked. If you encounter such an issue, then kindly report
              such an issue to us on our customer care phone number or email id
              provided at the end of this Privacy Policy.
              <br />
              This Policy provides the current data protection policies and
              practices which may be altered, amended or updated from time to
              time. Any changes to this Policy shall become effective upon
              posting of the revised Policy on the Application, and no
              communication of such alteration, amendment or update shall be
              made to you. It is recommended that you regularly check this
              Policy to apprise yourself of any updates. Your continued use of
              the Application, thereafter, shall imply your unconditional
              acceptance of the Policy.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>What do we collect?</h3>
            <p>
              In order to provide you with smooth Service, we may collect your
              Information and use it as mentioned below:
              <ul>
                <li>
                  Your name, address, e-mail Id, and contact details upon
                  registering on the Application;
                </li>
                <li>
                  Your IP address, mobile network, device ID, operating system,
                  etc.;
                </li>
                <li>
                  We may also collect cookies that aid us in recognizing you as
                  a customer and remember your preferences so we can personalize
                  our Services. You are free to decline our cookies if your
                  browser permits this. It must be noted that cookies are
                  essential to prevent fraud and ensure the security of
                  Applications that we control. If you choose to decline our
                  cookies, that may not guarantee you a seamless user
                  experience;
                </li>
                <li>
                  We may use the user’s photos for advertising our Services;
                </li>
                <li>
                  We collect the content, communications and other information
                  you provide when you use our Products, including when you sign
                  up for an account, create or share content and message or
                  communicate with others. This can include information in or
                  about the content that you provide
                </li>
                <li>
                  We collect information about how you use our Products, such as
                  the types of content that you engage with, the features you
                  use, the actions you take, the people or accounts you interact
                  with and the time, frequency and duration of your activities.
                </li>
                <li>
                  If you use our Services for purchases or other financial
                  transactions, we collect information about the purchase or
                  transaction. This includes payment information, such as your
                  credit or debit card number and other card information, other
                  account and authentication information, and billing, delivery
                  and contact details.
                </li>
                <li>
                  We also receive and analyze content, communications and
                  information that other people provide when they use our
                  Products. This can include information about you.
                </li>
              </ul>
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>How do we collect your data</h3>
            <ul>
              <li>
                We may engage third-party services to collect and monitor such
                Information that will help us to verify your credentials, and
                maintain privacy, which will enable us to provide better
                Services, enhance your user experience and fulfill your
                requests;
              </li>
              <li>
                We may also collect cookies that aid us in recognizing you as a
                customer and remember your preferences so we can personalize our
                Services. You are free to decline our cookies if your browser
                permits this. It must be noted that cookies are essential to
                prevent fraud and ensure the security of Applications that we
                control. If you choose to decline our cookies, that may not
                guarantee you a seamless user experience;
              </li>
            </ul>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>How will we use your data</h3>
            <ul>
              <li>
                We share your information with only those third parties who work
                to provide you smooth Services through this Application, like:
                <ul>
                  <li>
                    employees, affiliates, subsidiaries, business partners, and
                    marketing partners of our Application, etc.;
                  </li>
                  <li>
                    where it is necessary for us to defend and establish our
                    legal right, to enforce our policies and agreements;
                  </li>
                  <li>
                    if required by any government department or authority as per
                    the applicable laws of India;
                  </li>
                  <li>
                    When the users consent to disclose their information to
                    third parties, it may be used by such third parties to send
                    unsolicited e-mails to the users. If the user encounters
                    issues of impersonation or any misuse by such third parties,
                    the user shall report to us by emailing at
                    support@appopener.com
                  </li>
                  <li>
                    If you have consented to share your information with any
                    third party, then such information may be shared with the
                    third party
                  </li>
                </ul>
              </li>
              <li>
                We may use the user’s photos for advertising our Services;
              </li>
              <li>
                We may use your information to send you newsletters, or other
                updates and notifications, which will be solely related to the
                Services of our Application, through WhatsApp, E-mail, etc.,
                only if you consent to be communicated in such manner;
              </li>
              <li>
                Your Information that has been retained by us may be shared with
                third parties, employees, partners, affiliates, marketing
                partners or other officers, who are working with us towards
                providing you better Services through our Application;
              </li>
            </ul>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>How do we store your data?</h3>
            <p>
              We provide utmost security to your sensitive information on our
              Application. Please be noted that we have proper servers to
              protect your information, but no data can be fully protected from
              getting hacked. If you encounter such an issue, then kindly report
              it to us and we shall take all the steps necessary to protect
              against the misuse of your information.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Marketing</h3>
            <ul>
              <li>We use retargeting pixels for marketing our Services;</li>
              <li>
                We may send you newsletters, or other updates and notifications,
                which will be solely related to the Services of our Application,
                through WhatsApp, E-mail, etc., only if you consent to be
                communicated in such manner;
              </li>
            </ul>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>What are your data protection rights?</h3>
            <p>
              We provide utmost security to your sensitive information on our
              Application. Please be noted that we have proper servers to
              protect your information, but no data can be fully protected from
              getting hacked. If you encounter such an issue, then kindly report
              it to us and we shall take all the steps necessary to protect
              against the misuse of your information.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>What are cookies?</h3>
            <p>
              Cookies are text files placed on your computer to collect standard
              Internet log information and visitor behavior information. When
              you visit our websites, we may collect information from you
              automatically through cookies or similar technology
              <br />
              For further information, visit allaboutcookies.org
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>How do we use cookies?</h3>
            <p>
              We may collect cookies that aid us in recognizing you as a
              customer and remember your preferences so we can personalize our
              Services. You are free to decline our cookies if your browser
              permits this. It must be noted that cookies are essential to
              prevent fraud and ensure the security of Applications that we
              control. If you choose to decline our cookies, that may not
              guarantee you a seamless user experience;
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>What type of cookies do we use?</h3>
            <p>
              When your browser or device allows it, we use both session cookies
              and persistent cookies to better understand how you interact with
              our services, to monitor aggregate usage patterns, and to
              personalize and otherwise operate our services such as by
              providing account security, personalizing the content we show you
              including ads, and remembering your language preferences
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>How to manage your cookies?</h3>
            <p>
              You are free to decline our cookies if your browser permits this.
              It must be noted that cookies are essential to prevent fraud and
              ensure the security of Applications that we control. If you choose
              to decline our cookies, that may not guarantee you a seamless user
              experience.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Privacy policies of other websites</h3>
            <p>
              Our Application may contain links to other websites and platforms.
              Our Privacy Policy shall only apply to our Application unless and
              until specified otherwise and it is upto the users to know about
              the Privacy Policy of such websites and platforms before accessing
              them
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Changes to our privacy policies</h3>
            <ul>
              <li>
                We may keep our privacy policy under review regularly and we may
                update the existing policy with the new one if any as and when
                necessary
              </li>
              <li>
                Any changes to this Privacy Policy shall become effective upon
                posting of the revised Privacy Policy on the Application, and no
                communication of such alteration, amendment or update shall be
                made to you. It is recommended that you regularly check these
                Privacy Policy to apprise yourself of any updates.
              </li>
            </ul>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>How to contact us</h3>
            <ul>
              <li>
                You may contact us at our registered office at H-294, Lane 2,
                Westend Marg, Saidulajab, New Delhi, Delhi 110030.
              </li>
              <li>
                If you have any concerns, questions or feedback pertaining to
                this Policy, please feel free to contact us at
                support@appopener.com.
              </li>
              <li>
                In case you have any grievances relating to the Services of the
                Application or the manner of usage of Information provided by
                you, you may contact our Grievance Officer at the following
                address:
                <ul>
                  <li>
                    <b>Name</b> : Midas
                  </li>
                  <li>
                    <b>Address</b> : H-294, Lane 2, Westend Marg, Saidulajab,
                    New Delhi, Delhi 110030
                  </li>
                  <li>
                    <b>Email Id</b> : <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
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

export default PrivacyPolicy;
