import React from "react";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import classes from "./Styles.module.css";
import slogo from "../assets/slogo.avif";
import "../css/splash2.css";

function Footer() {
  return (
    <>
      <footer
        style={{
          background: "#202124",
          color: "white",
          width: "100%",
          padding: "25px",
        }}
      >
        <div className="container">
          <div className="row">
            {/* Logo Section */}
            <div className="col-lg-3 col-md-4 mb-4">
              <img className={classes.logo} src={slogo} alt="Logo" />
            </div>

            {/* Policies Section */}
            <div className="col-lg-3 col-md-4 mb-4 mb-lg-0">
              <h6 className="text-uppercase font-weight-bold mb-4">Policies</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <Link
                    to="/privacy-policy"
                    style={{
                      textDecoration: "none",
                      color: "#ccc",
                      fontFamily: "Montserrat Alternates",
                      cursor: "pointer",
                    }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/terms-and-conditions"
                    style={{
                      textDecoration: "none",
                      color: "#ccc",
                      fontFamily: "Montserrat Alternates",
                      cursor: "pointer",
                    }}
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/contact-us"
                    style={{
                      textDecoration: "none",
                      color: "#ccc",
                      fontFamily: "Montserrat Alternates",
                      cursor: "pointer",
                    }}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="col-lg-3 col-md-4 mb-4 mb-lg-0">
              <h6 className="text-uppercase font-weight-bold mb-4">Support</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <Link
                    to="/cancel-and-refund"
                    style={{
                      textDecoration: "none",
                      color: "#ccc",
                      fontFamily: "Montserrat Alternates",
                      cursor: "pointer",
                    }}
                  >
                    Cancellation and Refund
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/shipping-and-delivery"
                    style={{
                      textDecoration: "none",
                      color: "#ccc",
                      fontFamily: "Montserrat Alternates",
                      cursor: "pointer",
                    }}
                  >
                    Shipping and Delivery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div className="flex flex-row">
              <div className="flex flex-row text-uppercase font-weight-bold mb-4">
                Dm us on&nbsp;&nbsp;{" "}
                <a
                  className=""
                  href="https://appopener.com/ig/jqq8uy2ww"
                  target="_blank"
                  title="instagram"
                >
                  <FaInstagram style={{ color: "#ccc" }} size="22px" />
                </a>
                &nbsp; to Collab!
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
