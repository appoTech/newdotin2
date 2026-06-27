import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom"; // Import hooks
import GenerateLinkButton from "../components/SmartLink.jsx";
import helmet from "../assets/helmet.avif";
import HamburgerMenu from "./hamburger.jsx";
import { Ham } from "lucide-react";
import Small_ham from "./small_ham.jsx";
/* const GenerateLinkButton = lazy(() => import("../components/SmartLink.jsx")); */

const BottomNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [activeItem, setActiveItem] = useState("Home");
  const [showGenerateLink, setShowGenerateLink] = useState(false);
  const history = useHistory();
  const location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navItems = [
    {
      name: "Imagine",

      route: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Trending",
      route: "/trending",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      name: "Link",
      route: null, // No route since it triggers a component
      icon: <span className="text-lg font-bold">Å</span>,
    },
    {
      name: "Study",
      route: "/blog",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },

    {
      name: "Menu",
      route: null,
      icon: (
        <div>
        
          <HamburgerMenu />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const currentRoute = location.pathname;
    const activeNavItem = navItems.find((item) => item.route === currentRoute);
    if (activeNavItem) {
      setActiveItem(activeNavItem.name);
    }
  }, [location.pathname, navItems]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down, hide navbar
      } else {
        setIsVisible(true); // Scrolling up, show navbar
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (route, name) => {
    if (name === "Link") {
      setShowGenerateLink(true);
    } else if (name === "Menu");
    else if (route?.startsWith("http")) {
      window.location.href = route;
    } else {
      history.push(route);
    }
  };

  return (
    <>
      <nav
        style={{
          zIndex: "10000",
          transition: "transform 0.3s ease-in-out",
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
        }}
        className="fixed bottom-0 left-0 right-0 bg-white text-gray-800 w-full shadow-md mb-2 rounded-full shadow-gray-600"
      >
        <div className="flex justify-around items-center h-16 space-x-2 px-2">
          {navItems.map((item) => {
            const isActive = activeItem === item.name;
            return (
              <div
                key={item.name}
                className={`flex flex-col justify-center px-4 items-center rounded-lg overflow-hidden ${
                  isActive
                    ? "text-indigo-600 font-semibold"
                    : "hover:bg-gray-300 cursor-pointer"
                }`}
                onClick={() => handleNavigation(item.route, item.name)}
              >
                <button className="flex items-center justify-center p-0.5 rounded-full transition-colors text-sm sm:text-base w-10 h-10">
                  {item.icon}
                </button>
                <span
                  className={`text-xs sm:text-sm ${
                    isActive ? "text-indigo-600 font-semibold" : "text-gray-800"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </nav>
      {showGenerateLink && (
        <div className="bg-white p-4 md:p-6">
          <GenerateLinkButton />
        </div>
      )}
    </>
  );
};

export default BottomNav;
