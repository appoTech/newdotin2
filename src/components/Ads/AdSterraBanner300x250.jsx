import { useEffect, useRef } from 'react'
const AdSterraBanner300x250 = () => {

    useEffect(() => {
        if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
        atAsyncOptions.push({
            'key': '2e4a20b282be2769a30cda4b91c76921',
            'format': 'js',
            'async': true,
            'container': 'atContainer-2e4a20b282be2769a30cda4b91c76921',
            'params': {}
        });
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.async = true;
        script.src = 'http' + (window.location.protocol === 'https:' ? 's' : '') + '://www.topcreativeformat.com/2e4a20b282be2769a30cda4b91c76921/invoke.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    }, []);

    return <div id="atContainer-2e4a20b282be2769a30cda4b91c76921"></div>;
}


export default AdSterraBanner300x250;