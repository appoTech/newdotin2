import React from 'react';
import "../../css/splash.css"

const EmbedVideo = ({metadata}) => {
    return (
        <div className='VideoFrame'>
            <iframe className="embedVideo" src={metadata.embedUrl} title={metadata.title} width="300px" height="200px"></iframe>
        </div>
    );
};

export default EmbedVideo;
