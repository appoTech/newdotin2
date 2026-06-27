// src/components/MenuFooterLinks.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";

const MenuFooterLinks = ({ textColor = "black" }) => {
  return (
    <div style={{ marginTop: "auto", fontSize: "11px"}}>
      <div style={{ marginBottom: "0px" }}>
        <h6 style={{ fontWeight: "bold" }}>Policies</h6>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/privacy-policy" style={{ textDecoration: "none", color: textColor }}>
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms-and-conditions" style={{ textDecoration: "none", color: textColor }}>
              Terms and Conditions
            </Link>
          </li>
          {/* <li>
            <Link to="/contact-us" style={{ textDecoration: "none", color: textColor }}>
              Contact Us
            </Link>
          </li> */}
        </ul>
      </div>

      <div>
        <h6 style={{ fontWeight: "bold" }}>Support</h6>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/cancel-and-refund" style={{ textDecoration: "none", color: textColor }}>
              Cancellation and Refund
            </Link>
          </li>
          <li>
            <Link to="/shipping-and-delivery" style={{ textDecoration: "none", color: textColor }}>
              Shipping and Delivery
            </Link>
          </li>
        </ul>
      </div>

      <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        Dm us on&nbsp;
        <a
          href="https://instagram.com/appopener.com8"
          target="_blank"
          rel="noreferrer"
          title="Instagram"
        >
          <FaInstagram style={{ color: textColor }} size="18px" />
        </a>
        &nbsp;to Collab!
      </div>
    </div>
  );
};

export default MenuFooterLinks;
