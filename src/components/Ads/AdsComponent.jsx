import React, { useEffect  } from 'react';
import "../../css/ads.css"

const AdsComponent = (props) => {
    const { dataAdSlot, setClass } = props;  

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        catch (e) {
            console.log(e);
        }
    },[]);

    return (
        <>
            <ins className={`adsbygoogle ${setClass}`}
                data-ad-client="ca-pub-5645705217995911"
                data-ad-slot={dataAdSlot}
                data-ad-format="auto">
            </ins>
        </>
    );
};

export default AdsComponent;