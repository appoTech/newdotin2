import { useEffect, useRef } from 'react'
const AdSterraNativeBanner = () => {
    const banner = useRef(HTMLDivElement)


    useEffect(() => {
        if (!banner.current.firstChild) {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = "//pl22939612.profitablegatecpm.com/04b55d948562a80250c8edc3346ab7d0/invoke.js"

            if (banner.current) {
                banner.current.append(script)
            }
        }
    }, [])
    return (
        <>
            <div ref={banner}></div>
            <div id="container-04b55d948562a80250c8edc3346ab7d0"></div >
        </>
    );
}


export default AdSterraNativeBanner;