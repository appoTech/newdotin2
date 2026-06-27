import { useEffect, useRef } from 'react'
const AdxBanner250x250 = () => {
    const banner = useRef();

    useEffect(() => {
        window.googletag = window.googletag || { cmd: [] };
        window.googletag.cmd.push(() => {
            window.googletag.defineSlot('/22939112713,61160860/lhk-web/appopener.com_250x250_1', [250, 250], 'div-gpt-ad-1718013332941-0').addService(window.googletag.pubads());
            window.googletag.pubads().enableSingleRequest();
            window.googletag.enableServices();
        })
        window.googletag.cmd.push(function () { window.googletag.display('div-gpt-ad-1718013332941-0'); });
    }, [banner]);

    return (
        <div id='div-gpt-ad-1718013332941-0' ref={banner} ></div >
    );
}


export default AdxBanner250x250;