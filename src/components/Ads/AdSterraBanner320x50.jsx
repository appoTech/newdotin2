import { useEffect, useRef } from 'react'
const AdSterraBanner320x50 = () => {
    useEffect(() => {
        if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
        atAsyncOptions.push({
            'key': '6fbb1ac3837ccbcbdff1ce71edea4011',
            'format': 'js',
            'async': true,
            'container': 'atContainer-6fbb1ac3837ccbcbdff1ce71edea4011',
            'params' : {}
        });
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.async = true;
        script.src = 'http' + (window.location.protocol === 'https:' ? 's' : '') + '://www.topcreativeformat.com/6fbb1ac3837ccbcbdff1ce71edea4011/invoke.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    }, []);

    return <div id="atContainer-6fbb1ac3837ccbcbdff1ce71edea4011"></div>;
}


export default AdSterraBanner320x50;