import { useEffect } from "react";

const G13Ads = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "CleverCoreLoader89618";
    script.src = "https://scripts.cleverwebserver.com/f15747514f5ac6370206bd4c6568c3a7.js";
    script.async = true;
    script.type = "text/javascript";
    script.setAttribute("data-cfasync", "false");
    script.setAttribute(
      "data-target",
      window.name || (window.frameElement && window.frameElement.getAttribute("id"))
    );
    script.setAttribute("data-callback", "put-your-callback-function-here");
    script.setAttribute("data-callback-url-click", "put-your-click-macro-here");
    script.setAttribute("data-callback-url-view", "put-your-view-macro-here");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  return null; // No visible UI needed
};

export default G13Ads;
