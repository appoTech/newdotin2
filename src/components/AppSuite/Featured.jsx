import React from 'react';
import "../../css/splash.css"

const Featured = ({ data }) => {
    return (
        <a href={process.env.REACT_APP_APPSUITE_FEAT_PREFIX + data["smart_link"]} style={{maxWidth: "450px", width: "90%" }}>
            <div className="Glass" style={{ marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: "10px", width: "100%"}}>
                <div className="thumb" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <img src={data.metadata.image} style={{maxHeight: "300px"}}/>
                </div>

                <div style={{ color: "white", padding: "15px", fontWeight: "700", wordWrap: "break-word", maxWidth: "500px" }}>
                    {data.metadata.title}
                </div>
            </div>
        </a>
    );
};

export default Featured;
