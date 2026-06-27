import React from "react";
import "../css/boot.css";
import logo from "../assets/logo.avif";
import profileuser from "../assets/profile.png"
import loginSkip from "../assets/Logo-cc.avif"
import share from "../assets/Share.png"
import backBtn from "../assets/backBtn.png"
import bgimg from "../assets/BOOT1.avif"
import appStore from "../assets/appleStore.png"
import playStore from "../assets/playStore.png"

const Boot = ({ show, onClose, onNextPopup, onBack, showSecondPopup, showThirdPopup,onProfileClick, }) => {
  if (!show) return null; 

  const handleShareClick = () => {
  
    if (navigator.share) {
      navigator
        .share({
          title: document.title, 
          text: "Check out this page:", 
          url: window.location.href, 
        })
        .then(() => console.log("Successful share")) 
        .catch((error) => console.log("Error sharing", error)); 
    } else {
      alert("Web Share API is not supported in your browser."); 
    }
  };

  return (
    <div className="popup-container">
      {!showSecondPopup && !showThirdPopup ? ( 
        <div className="popup-box">
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
            <div className="popup-content">
              <button onClick={onProfileClick}>
               <img
                src={profileuser}
                alt="Profile"
                className="popup-profile-pic"
                
              /> 
              </button>
              <div className="popup-image flex justify-center items-center ">
                <h1 className=" text-white text-[52px]">SATURN</h1>
              </div>
              <div className="popup-buttons justify-center ">
                <button className="popup-btn left-btn" onClick={onNextPopup}>BOOST </button>
                <button className="popup-btn right-btn">BRIBE</button>
              </div>
            </div>
          </div>
       
      ) : showSecondPopup ? (
        <div className="second-popup-box"> 
        <img className="backgroundImage" src={bgimg} alt="" />
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <button className="back-btn" onClick={onBack}>
        <img src={backBtn} alt="backBtn" style={{width: "25px",}}  />
        </button>
       
        <img src={loginSkip} alt="LoginSkip" className="center-logo" />
   
        <button className="share-btn" onClick={handleShareClick}>
          <img src={share} alt="share" /></button>
     
      </div>
      ) : (
        <div className="third-popup-box">
          <img className="backgroundImage" src={bgimg} alt="Background" />
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
          <button className="back-btn" onClick={onBack}>
          <img src={backBtn} alt="backBtn" style={{width: "25px",}}  />
        </button>
          <img src={logo} alt="Logo" className="center-logo" />
          <div className="download-buttons">
            <button className="download-btn "> <img className="download-btn " src={appStore } alt="appStore" /></button>
            <button className="download-btn"> <img className="download-btn" src={playStore} alt="playStore" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boot;