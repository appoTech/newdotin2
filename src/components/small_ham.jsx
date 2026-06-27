import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { GiAstronautHelmet } from 'react-icons/gi';
// import { GiHamburgerMenu } from "react-icons/gi";
import { CgMenuGridO } from "react-icons/cg";
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { MdOutlineSettings } from 'react-icons/md';
import { FaQuestionCircle } from 'react-icons/fa';
import { SiMicrodotblog } from 'react-icons/si';
import { MdContacts } from 'react-icons/md';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import classes from "./Styles.module.css";
import logo from "../assets/logo.avif";
import MenuFooterLinks from './MenuFooterLinks';


const Small_ham = () => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    // Handle body overflow when options are open
    if (showOptions) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    // Cleanup the effect
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [showOptions]);

  return (
    <div className={classes.smallham} style={{ position: 'absolute', zIndex: 1000, marginTop: '-5px', marginLeft: '-50px' }}>
      <div
        className={classes.hamburgericon}
        style={{
          color: 'white',
          fontSize: '30px',
          marginRight: '10px',
          cursor: 'pointer',
        }}
        onClick={toggleOptions}
      >
        <CgMenuGridO />
      </div>
      <div
        className={classes.optionscontainer1}
        style={{
          position: 'fixed',
          top: '0',
          left: showOptions ? '0' : '100%',
          width: '100%',
          height: '100%',
          background: 'white',
          color: 'black',
          padding: '30px',
          textAlign: 'center',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          overflowY: 'auto',
          transition: 'left 0.3s ease',
        }}
        >
        <div className="d-flex justify-content-start">
          <img className={classes.logo} src={logo} alt="Logo" />
        </div>
        {/* Close (cross) icon */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '30px',
          }}
          onClick={toggleOptions}
        >
          &#10006;
        </div>
        <Link to="/how-it-works" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ padding: '5px', marginBottom: '10px', marginTop: '20px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <MdOutlineSettings style={{ fontSize: '30px', marginRight: '5px' }} /> Pricing
          </div>
        </Link>
        <Link to="/blog" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ padding: '5px', marginBottom: '10px', marginTop: '20px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <SiMicrodotblog style={{ fontSize: '30px', marginRight: '5px' }} /> Blog
          </div>
        </Link>
        <Link to="/contact-us" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ padding: '5px', marginBottom: '20px', marginTop: '20px', textAlign: 'left', borderBottom: '1px solid black', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }}>
            <MdContacts style={{ fontSize: '30px', marginRight: '5px' }} /> Contact Us
          </div>
        </Link>

        {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10%' }}>
          <FaInstagram style={{ color: 'black', fontSize: '30px', margin: '0 5px', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }} />
          <FaFacebook style={{ color: 'black', fontSize: '30px', margin: '0 5px', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }} />
          <FaTwitter style={{ color: 'black', fontSize: '30px', margin: '0 5px', cursor: 'pointer', transition: 'background 0.3s ease', ':hover': { backgroundColor: '#f0f0f0' } }} />
        </div>  */}
        <MenuFooterLinks />
      </div>
    </div>
  );
};

export default Small_ham;
