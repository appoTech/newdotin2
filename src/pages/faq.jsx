import React, { useRef } from "react";
import Footer from "../components/Footer";
import styles from "./Faq.module.css";
import classes from "../components/Styles.module.css";
import { Link } from "react-router-dom";
import { Row, Col, Button, Container, Card } from "react-bootstrap";
import { FaAmazonPay, FaDollarSign, FaWhatsapp } from "react-icons/fa";
import HeroFaqSection from "../components/HeroFaqSection";
import PatternLogo from "../assets/pattern.avif";
import Float from '../components/side_button';
import Floattwo from '../components/side_button2';
import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";


const FaqPage = () => {
     // Ref for the first question section
     const firstQuestionRef = useRef(null);

     // Function to scroll to a specific section and stop at the first question
     const scrollToSection = () => {
         if (firstQuestionRef.current) {
             window.scrollTo({
                 top: firstQuestionRef.current.offsetTop,
                 behavior: "smooth",
             });
         }
     };

    return (
        <div className={styles.mainContainer}>
          {/* <G13Ads/> */}
          <AdsterraAd/>
          <HeroFaqSection scrollNow={scrollToSection} />
          <div className={styles.container}>
            {/* <h1 id={styles.head}>Privacy Policy</h1> */}
            <div>
              {/* <p id={styles.subtext}>
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
              </p> */}
    
              <div className={styles.faqSingleContainer} ref={firstQuestionRef}>
                <h3 >What is App Opener?</h3>
                <p >
                  App Opener is designed to help affiliate marketers, social media influencers, and
                  business owners generate a custom link that will help redirect traffic to specific
                  apps. With App Opener, users can optimize their social media strategies, improve
                  engagements, conversions, and click-through rates of their social media accounts. 
                </p>
              </div>
    
              <div className={styles.faqSingleContainer}>
                <h3 >What are the benefits of using App Opener?</h3>
                <p >
                When you use App Opener to generate custom links, you not only streamline your social media, 
                but also increase engagements, conversions, brand identity, and click-through rate for your 
                social media channels. That’s how App Opener’s direct app redirection benefits its users.
                </p>
              </div>
    
              <div className={styles.faqSingleContainer}>
                <h3 >Can I customize the links?</h3>
                <p >
                Yes, you can create customized links with App Opener.
                </p>
              </div>
    
              <div className={styles.faqSingleContainer}>
                <h3 >How do I get started with App Opener?</h3>
                <p >
                Getting started with App Opener is easy. Just visit the website, paste the url link in the smart link 
                generator box, click on smarten link. Your customized branded link will be ready in a few minutes.
                </p>
              </div>
    
              <div className={styles.faqSingleContainer}>
                <h3 >Is there a limit to the number of links that I can generate?</h3>
                <p >
                No, there is no limit to the number of links that you can generate with App Opener.
                </p>
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

export default FaqPage;
