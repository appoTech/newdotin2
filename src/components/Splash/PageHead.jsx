import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const PageHead = ({metadata}) => {
    let location = useLocation();
    let canonicalUrl= "https://appopener-frontend.vercel.app"+location.pathname;
    return (
        <div>
            <Helmet>
                <title>{metadata.title ? `${metadata.title} | AppOpener` : "AppOpener" } </title>

                <meta name="description" content={metadata.description} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={metadata.title} />
                <meta property="og:description" content={metadata.description} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={metadata.image} />
                <meta property="og:image:width" content="320" />
                <meta property="og:image:height" content="256" />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={metadata.title} />
                <meta property="twitter:description" content={metadata.description} />
                <meta property="twitter:image" content={metadata.image} />
                <meta name="keywords" content={metadata.tag}></meta>
            </Helmet>

            <link itemProp="thumbnailUrl" href={metadata.image} /> 
            <span itemProp="thumbnail" itemScope itemType="http://schema.org/ImageObject"> 
                <link itemProp="url" href={metadata.image} /> 
            </span>
        </div>
    );
};

export default PageHead;
