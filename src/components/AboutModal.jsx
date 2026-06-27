import React from "react";
import { useEffect } from "react";

import "../css/splash.css";

const AboutModal = ({ links, isOpen, closeAboutModal, bio }) => {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && e.target.closest(".about-modal") === null) {
        closeAboutModal();
      }
    };

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      // Clean up event listener when modal is closed
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, closeAboutModal]);

  return (
    <div className={`about-modal ${isOpen ? "show" : ""}`}>
      {/* {console.log("Links are : ", links)}; */}
      <div className="about-modal-content">
        <span className="close" onClick={closeAboutModal}>
          &times;
        </span>

        <div className="about-bio">
          <h2>Bio</h2>

          <p align="left"> {bio}</p>
        </div>

        <div className="social-links">
          {links&&<h2>Social Links</h2>}

          {links&&links.map((link, index) => {
            // console.log("Link is : ", `https://${link.link}`);
            // console.log("Favicon is : ", link.favicon[0].url);
            return (
              <a href={`https://${link.link}`} target="_blank">
                <img
                  key={index}
                  src={link.favicon[0].url}
                  alt={`Favicon for ${link.title}`}
                />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
