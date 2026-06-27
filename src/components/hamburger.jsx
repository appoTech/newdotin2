import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { GiAstronautHelmet } from 'react-icons/gi';
import { FaInstagram, FaFacebook, FaTwitter, FaQuestionCircle, FaLink } from 'react-icons/fa';
import  helmet from "../assets/helmet.avif";
import { MdOutlineSettings } from 'react-icons/md';
import { SiMicrodotblog } from 'react-icons/si';
import { MdContacts } from 'react-icons/md';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import classes from "./Styles.module.css";
import MenuFooterLinks from './MenuFooterLinks';

const HamburgerMenu = () => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };


  useEffect(() => {
    const closeOptionsOnOutsideClick = (event) => {
      if (showOptions && !event.target.closest('.hamburger-icon') && !event.target.closest('.options-container')) {
        setShowOptions(false);
      }
    };

    document.addEventListener('click', closeOptionsOnOutsideClick);

    return () => {
      document.removeEventListener('click', closeOptionsOnOutsideClick);
    };
  }, [showOptions]);

  
  return (
    <div className="absolute -top-0 border-none flex z-9999 -ml-4 items-center justify-center">
      <div
        className='flex items-center justify-center hamburger-icon -left-1'
        onClick={toggleOptions}
      >
        <img src={helmet} alt="helmet icon" className='w-10'/>

      </div>
      {showOptions ? (<>
      <div
        className={classes.optionscontainer}
        style={{
          position: 'absolute',
          top: `${window.innerWidth <= 655 ? '200%' : '150%'}`,
          left: `${window.innerWidth <= 655 ? '-125%' : '-200%'}`,
          transform: `translateX(-50%) translateY(${showOptions ? '0' : '-20px'})`,
          background: 'white',
          width: '200px',
          color: 'black',
          padding: '20px',
          textAlign: 'center',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          opacity: showOptions ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          display: "inline-block",
        }}
      >
        <a href="/pricing" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', marginBottom: '10px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <MdOutlineSettings style={{ fontSize: '15px', marginRight: '5px' }} /> Pricing
          </div>
        </a>
        <a href="/features" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', marginBottom: '10px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <MdOutlineFeaturedPlayList style={{ fontSize: '15px', marginRight: '5px' }} /> Features
          </div>
        </a>
        <a href="/faq" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', marginBottom: '10px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <FaQuestionCircle style={{ fontSize: '15px', marginRight: '5px' }} /> FAQs
          </div>
        </a>
        <a href= "/blog" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', marginBottom: '10px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <SiMicrodotblog style={{ fontSize: '15px', marginRight: '5px' }} /> Blog
          </div>
        </a>
        <a href="/contact-us" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', marginBottom: '10px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <MdContacts style={{ fontSize: '15px', marginRight: '5px' }} /> Contact Us
          </div>
        </a>
        {/* <a href="/retrieve-links" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', marginBottom: '10px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <FaLink style={{ fontSize: '15px', marginRight: '5px' }} /> Retrieve Links
          </div>
        </a> */}
        {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <FaInstagram style={{ color: 'black', fontSize: '20px', margin: '0 5px', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }} />
          <FaFacebook style={{ color: 'black', fontSize: '20px', margin: '0 5px', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }} />
          <FaTwitter style={{ color: 'black', fontSize: '20px', margin: '0 5px', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }} />
        </div> */}
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: "7px" }}>
          <div style={{ cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <a href="/terms-and-conditions" style={{ textDecoration: 'none', color: 'black' }}>
              Terms and Conditions
            </a>
          </div>
          <div style={{ cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' }, marginLeft: '20px' }}>
            <a href="/privacy-policy" style={{ textDecoration: 'none', color: 'black' }}>
              Privacy Policy
            </a>
          </div>
        </div> */}
        <MenuFooterLinks />
      </div>
      </>):(<></>)}
    </div>
    
  );
};

export default HamburgerMenu;
