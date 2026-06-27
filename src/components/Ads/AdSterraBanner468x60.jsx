import { useEffect, useRef } from 'react'
const AdSterraBanner468x60 = () => {
    useEffect(() => {
        if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
        atAsyncOptions.push({
            'key': 'bc044563c60b844ce3eeda25f90893ae',
            'format': 'js',
            'async': true,
            'container': 'atContainer-bc044563c60b844ce3eeda25f90893ae',
            'params' : {}
        });
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.async = true;
        script.src = 'http' + (window.location.protocol === 'https:' ? 's' : '') + '://www.topcreativeformat.com/bc044563c60b844ce3eeda25f90893ae/invoke.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    }, []);

    return <div id="atContainer-bc044563c60b844ce3eeda25f90893ae"></div>;
}


export default AdSterraBanner468x60;