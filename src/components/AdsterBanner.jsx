import React, { useEffect } from "react";

const AdsterBanner = ({ size = "300x250" }) => {
  useEffect(() => {
    const loadScript = () => {
      console.log("Loading Adster SDK script...");
      const script = document.createElement("script");
      script.src =
        "https://storage.googleapis.com/public-assets-websdk/appopener.com.min.js";
      script.async = true;
      script.onload = async () => {
        console.log("SDK script loaded, initializing Adster SDK...");
        if (window.AdsterSDK) {
          const adsterSDK = new window.AdsterSDK();
          console.log("Initializing Adster SDK...");
          await adsterSDK.init();
          console.log("Adster SDK setup complete");
        } else {
          console.error(
            "AdsterSDK not found in window object after script load"
          );
        }
      };
      script.onerror = () => {
        console.error("Failed to load the Adster SDK script");
      };
      document.body.appendChild(script);
      return script;
    };
    // Check if script is already present to avoid duplicates
    if (!document.querySelector('script[src="https://storage.googleapis.com/public-assets-websdk/appopener.com.min.js"]')) {
       loadScript();
    } else {
        // If script is already there, maybe just re-init? 
        // For now, assuming distinct page loads or single init is fine.
        // If we need to re-run init on size change, we might need a way to access the existing SDK instance.
        // However, the SDK might handle scanning on init. 
        if (window.AdsterSDK) {
             const adsterSDK = new window.AdsterSDK();
             adsterSDK.init();
        }
    }
  }, []); // Logic runs once on mount. If size changes, it might need to re-run init?

  // Map sizes to dimensions
  const getDimensions = (s) => {
    const [width, height] = s.split('x').map(Number);
    return { width: `${width}px`, height: `${height}px` };
  };

  const { width, height } = getDimensions(size);

  return (
    <div className="flex items-center justify-center w-full my-3">
      <div 
        id={`adster-banner-${size}`} 
        style={{ minWidth: width, minHeight: height }}
      >
      </div>
    </div>
  );
};

export default AdsterBanner;
