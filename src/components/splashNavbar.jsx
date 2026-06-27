import React, { useEffect, useState } from "react";
import { NavItem } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import avatarframe from "../assets/frame01.png";
import logo from "../assets/AppOpener.png";

const SplashNavbar = ({
  navItems,
  setDialogOpen,
  setShowTop,
  currentTheme,
  onOpenShareTray,
  showTop,
  // setShowTop
}) => {
  const history = useHistory();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Home");

  useEffect(() => {
    const currentRoute = location.pathname;
    const activeNavItem = navItems.find((item) => item.route === currentRoute);
    if (activeNavItem) {
      setActiveItem(activeNavItem.name);
    }
  }, [location.pathname, navItems]);

  const handleNavigation = (route, name) => {
    if (name === "Club") {
      setDialogOpen?.(true);
    } else if (name === "Top 10") {
      setShowTop?.(!showTop);
    } else if (route?.startsWith("http")) {
      window.location.href = route;
    } else {
      history.push(route);
    }
  };

  return (
    <div className={`relative w-full ${currentTheme.navbar} -top-8`}>
      <div
        className={`absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center mr-1 ${currentTheme.button} rounded-full`}
        onClick={() => onOpenShareTray?.()}
      >
        <div className="relative w-28 h-28 flex items-center justify-center">
          <img
            src={avatarframe}
            alt=""
            className="absolute inset-0 w-26 h-26 animate-spin-slow"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {navItems[2].icon ? navItems[2].icon : logo}
          </div>
        </div>
      </div>

      <nav
        className={`${currentTheme.button} w-full mb-2 mt-8 rounded-b-lg shadow-[0_0_20px_#00F5FF]/50`}
      >
        <div className="flex justify-around items-center text-center h-16 px-2 gap-6">
          {navItems.map((item, index) => {
            // Leave space for the floating button in the center
            if (index === Math.floor(navItems.length / 2)) {
              return <div key="placeholder" className="w-16" />;
            }

            const isActive = activeItem === item.name;

            return (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.route, item.name)}
                className={`flex flex-col justify-center items-center px-1 cursor-pointer hover:opacity-80 transition-opacity duration-200`}
              >
                <button className="flex items-center justify-center p-1 rounded-full">
                  {item.icon}
                </button>
                <span className="text-xs text-center font-bold sm:text-sm">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default SplashNavbar;