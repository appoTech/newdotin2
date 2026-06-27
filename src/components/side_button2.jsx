import React, { useState, useRef, useEffect } from "react";
import "../css/FloatingButtons.css";
import { Link } from "react-router-dom";
import slogo from "../assets/slogo.avif";

import next from "../assets/next.avif";
/* import shop from "../assets/cosedge.webp";

import hat from "../assets/santa-hat.png"; */

const Floattwo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 510, left: 45 });
  const [openDirection, setOpenDirection] = useState("left"); // Initialize with default direction
  const containerRef = useRef(null);

  const toggleButtons = () => {
    setIsOpen(!isOpen);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const element = containerRef.current;
    const startX = e.clientX - element.offsetLeft;
    const startY = e.clientY - element.offsetTop;

    const handleMouseMove = (e) => {
      const newLeft = e.clientX - startX;
      setPosition({
        top: e.clientY - startY,
        left: newLeft,
      });

      // Determine if the floating container is on the left or right side of the screen
      const screenWidth = window.innerWidth;
      const containerWidth = element.offsetWidth;
      setOpenDirection(newLeft + containerWidth / 2 < screenWidth / 2 ? "left" : "right");
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const element = containerRef.current;
    const startX = touch.clientX - element.offsetLeft;
    const startY = touch.clientY - element.offsetTop;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const newLeft = touch.clientX - startX;
      setPosition({
        top: touch.clientY - startY,
        left: newLeft,
      });

      // Determine if the floating container is on the left or right side of the screen
      const screenWidth = window.innerWidth;
      const containerWidth = element.offsetWidth;
      setOpenDirection(newLeft + containerWidth / 2 < screenWidth / 2 ? "left" : "right");
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
      document.addEventListener("mousedown", (event) => {
        if (!containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      });
    }
  }, [isOpen]);

  return (
    <div
      className="floating-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ top: `${position.top}px`, left: `${position.left}px`, position: "fixed", zIndex:50 }}
    >
      {/*  <img
                src={hat}
                alt="Profile"
                style={{     width: "60px",
                  position: "absolute",
                  zIndex: "100",
                  top: "-41px",
                  left: "4px",
                  pointerEvents: "none",
                }}
                
              />  */}
      <div className={`arrow-button ${isOpen ? "open" : ""}`} onClick={toggleButtons}>
        {isOpen ? (
           <img className="w-12" src={slogo} alt="closed" />
        ) : (
            <img className="w-12" src={slogo} alt="closed" />
        )}
      </div>
      <div className={`floating-buttons ${isOpen ? "open" : ""} ${openDirection}`}>
        <button className="floating-btn bg-white">
          <Link
            to="https://www.appopener.in/"
            onClick={(e) => {
              e.preventDefault();
              openInNewTab("https://www.appopener.in/");
            }}
          >
             <img className="w-10" src={next} alt="closed" />
          </Link>
        </button>
        <button className="floating-btn pt-[1px] pl-[2px] bg-white">
          <Link
            to="https://www.appopener.ai/"
            onClick={(e) => {
              e.preventDefault();
              openInNewTab("https://www.appopener.net/");
            }}
          >
            <div className=" text-black" style={{ fontSize: "37px",textDecoration: "none !important",}}>Ø</div>
          </Link>
        </button>
        <button className="floating-btn bg-white">
          <Link
            to="https://www.spawnser.com/"
            onClick={(e) => {
              e.preventDefault();
              openInNewTab("https://www.spawnser.com/");
            }}
          >
            <img className="w-9" src={slogo} alt="closed" /> 
            {/* <img className="w-9" src={shop} alt="closed" /> */}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Floattwo;
