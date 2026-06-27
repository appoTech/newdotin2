// AdsterraAd.js
import React, { useEffect } from 'react';

const AdsterraAd = ({ id = 'default-ad', className = '' }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//peeringannecultivate.com/e2/3e/01/e23e018b733e2e433886c45b49cc0cf3.js';
    script.async = true;
    script.id = `adsterra-script-${id}`;
    
    document.body.appendChild(script);
    
    return () => {
      const scriptElement = document.getElementById(`adsterra-script-${id}`);
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    }
  }, [id]);

  return <div id={id} className={`adsterra-ad-container ${className}`}></div>;
};

export default AdsterraAd;
