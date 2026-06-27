import { useEffect, useRef } from 'react'
const AdxBanner320x50 = () => {
    const banner = useRef();

    useEffect(() => {
        window.googletag = window.googletag || { cmd: [] };
        window.googletag.cmd.push(() => {
            window.googletag.defineSlot('/22939112713,61160860/lhk-web/appopener.com_320x50_4', [320, 50], 'div-gpt-ad-1718272274170-0').addService(window.googletag.pubads());
            window.googletag.pubads().enableSingleRequest();
            window.googletag.enableServices();
        })
        window.googletag.cmd.push(function () { window.googletag.display('div-gpt-ad-1718272274170-0'); });
    }, [banner]);

    return (
        <div id='div-gpt-ad-1718272274170-0' ref={banner} ></div >
    );
}


export default AdxBanner320x50;
