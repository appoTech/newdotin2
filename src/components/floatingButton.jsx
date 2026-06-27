import React, { useState, useRef, useEffect } from "react";
import "../css/FloatingButtons.css";
import { Link } from "react-router-dom";
import appOpnr from "../assets/AppOpener.png";
import slogo from "../assets/slogo.avif";
import loginskip from "../assets/loginskip.png";
import CREATORS from "../assets/file.png";
import superprofile from "../assets/Superprofile.png";
import creatorCommerce from "../assets/creatorCommerce.png";

const Float = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 455, right: 25 });
  const [openDirection, setOpenDirection] = useState("right"); // Initialize with default direction
  const containerRef = useRef(null);

  const toggleButtons = () => {
    setIsOpen(!isOpen);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleMouseDown = (e) => {
    // Only drag with left click and when not clicking children buttons
    if (e.button !== 0 || e.target.closest(".floating-buttons")) return;
    e.preventDefault();
    const element = containerRef.current;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialRight = parseFloat(window.getComputedStyle(element).right);
    const initialTop = parseFloat(window.getComputedStyle(element).top);

    const handleMouseMove = (e) => {
      const newRight = initialRight - (e.clientX - startX);
      const newTop = initialTop + (e.clientY - startY);
      
      setPosition({
        top: newTop,
        right: newRight,
      });

      const screenWidth = window.innerWidth;
      const containerWidth = element.offsetWidth;
      setOpenDirection(newRight + containerWidth / 2 < screenWidth / 2 ? "right" : "left");
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest(".floating-buttons")) return;
    const touch = e.touches[0];
    const element = containerRef.current;
    const startX = touch.clientX;
    const startY = touch.clientY;
    const initialRight = parseFloat(window.getComputedStyle(element).right);
    const initialTop = parseFloat(window.getComputedStyle(element).top);

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const newRight = initialRight - (touch.clientX - startX);
      const newTop = initialTop + (touch.clientY - startY);
      
      setPosition({
        top: newTop,
        right: newRight,
      });

      // Determine if the floating container is on the left or right side of the screen
      const screenWidth = window.innerWidth;
      const containerWidth = element.offsetWidth;
      setOpenDirection(newRight + containerWidth / 2 < screenWidth / 2 ? "right" : "left");
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div
      className="floating-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ top: `${position.top}px`, right: `${position.right}px`, position: "fixed", zIndex: 9999 }}
    >
      <div className={`arrow-button ${isOpen ? "open" : ""}`} onClick={toggleButtons}>
        {isOpen ? (
          <div className="flex font-[50px]" style={{ fontSize: "45px", fontFamily: "sans-serif" }}>Ø</div>
        ) : (
          <img className="w-11" src={appOpnr} alt="closed" />
        )}
      </div>
      <div className={`floating-buttons ${isOpen ? "open" : ""} ${openDirection}`}>
        <button className="floating-btn bg-white">
          <Link
            to="https://shop.creatorcosmos.com/"
            onClick={(e) => {
              e.preventDefault();
              openInNewTab("https://shop.creatorcosmos.com/");
            }}
          >
            <img className="w-9" src={CREATORS} alt="closed" />
          </Link>
        </button>
        <button className="floating-btn pt-[1px] pl-[2px] bg-white">
          <Link
            to="https://cosmofeed.com/appopener"
            onClick={(e) => {
              e.preventDefault();
              openInNewTab("https://cosmofeed.com/appopener");
            }}
          >
            <img className="w-8" src={superprofile} alt="closed" />
          </Link>
        </button>
        <button className="floating-btn bg-white">
          <Link
            to="https://spawnser.com/"
            onClick={(e) => {
              e.preventDefault();
              openInNewTab("https://spawnser.com/");
            }}
          >
            <img className="w-8" src={slogo} alt="closed" />
          </Link>
        </button>
        <button className="floating-btn bg-white">
          <Link
            to="https://loginskip.com/"
            onClick={(e) => {
              e.preventDefault();
              openInNewTab("https://loginskip.com/");
            }}
          >
            <img className="w-10" src={loginskip} alt="new button" />
          </Link>
        </button>
        <button className="floating-btn bg-white">
          <Link
            to="https://commerce.creatorcosmos.com/"
            onClick={(e) => {
              e.preventDefault();
              openInNewTab("https://commerce.creatorcosmos.com/");
            }}
          >
            <img className="w-8" src={creatorCommerce} alt="new button" />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Float;
