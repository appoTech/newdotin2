import React from "react";
import Footer from "../components/Footer";
import styles from "./PrivacyPolicy.module.css";
import classes from "../components/Styles.module.css";
import ShipandDeliverySection from "../components/Policies/ShipandDeliverySection";
import PatternLogo from "../assets/pattern.avif";
import Float from '../components/side_button';
import Floattwo from '../components/side_button2';

const ShipAndDelivery = () => {
  return (
    <div className={styles.mainContainer}>
        <ShipandDeliverySection />   
       <div className={styles.container}>
        <div>
          <p id={styles.subtext}>
            Welcome to the Shipping and Delivery policy of AppOpener. This policy outlines how we manage the delivery process for branded links purchased from us.
          </p>

          <div className={styles.policySingleContainer}>
            <h3>Delivery of Branded Links</h3>
            <p>
              When you purchase branded links from AppOpener, we will deliver them to you via email. The email will contain the necessary login credentials, access instructions, and guidelines on how to set up and manage your branded links. Please ensure that the email address you provide is accurate, as all communication regarding your order will be sent there.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Delivery Timeframe</h3>
            <p>
              Once payment has been confirmed, we will process and deliver your branded links within 24-48 hours. Depending on the complexity of your order, delivery might take up to 72 hours, especially for custom domain setups or bulk link orders.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Order Tracking and Updates</h3>
            <p>
              You will receive a confirmation email once your branded links are ready. This will include all relevant details, such as the domain used, the number of links, and any customization options you selected. In case of any delays, you will be notified via email.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>International Orders</h3>
            <p>
              Our services are available globally, and branded links can be delivered to clients in any country. Delivery times may vary slightly for international clients due to time zone differences or domain registration requirements in certain regions.
            </p>
          </div>

          <div className={styles.policySingleContainer}>
            <h3>Support After Delivery</h3>
            <p>
              After your branded links have been delivered, our support team is available to assist with any setup issues or questions. If you encounter any problems accessing or using your branded links, feel free to contact us at <a href="mailto:contactus@appopener.com">contactus@appopener.com</a>.
            </p>
          </div>

          <p id={styles.subtext}>
            Thank you for choosing AppOpener for your branded link needs! If you have any questions about the shipping and delivery of your links, feel free to reach out to us.
          </p>
        </div>

        <div className={classes.patternImg}>
          <img src={PatternLogo} alt="pattern" />
        </div>
      </div>
      <Footer />
     {/*   <Float /> */}
      <Floattwo />
    </div>
  );
};

export default ShipAndDelivery;
