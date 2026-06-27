import React from 'react';
import '../css/splash2.css'


const Thumbnail = ({ linkMetadata, channel_title, yt_dp_url, setPageHead, show_description }) => {
    return (
    <div className="Glass" style={{ margin: '0', marginTop: '-5px', padding: '20px' }}>
            {setPageHead ? (
                <>
                    <div className="thumb">
                        <img src={linkMetadata.image} alt="Thumbnail" />
                    </div>
                    <div style={{ color: "white", padding: "15px", fontWeight: "700", wordWrap: "break-word", maxWidth: "500px" }}>
                        {linkMetadata.title}
                    </div>
                    {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: "10px" }}>
                        <div style={{ width: '70px', height: '70px', overflow: 'hidden', borderRadius: '50%' }}>
                            <img src={yt_dp_url} alt="Channel Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                        <div style={{ color: "white", fontSize: "20px", fontWeight: "700", marginLeft: '10px' }}>
                            {channel_title}
                        </div>
                    </div> */}

                    <div style={{ color: "white", maxWidth: "600px", margin: "10px auto" }}>
                        <span className="hover:cursor-pointer" onClick={() => this.setState({ show_description: !show_description })}>
                            {linkMetadata.description && show_description ?
                                (linkMetadata.description ?
                                    linkMetadata.description :
                                    linkMetadata.description
                                ) :
                                (linkMetadata.description ?
                                    linkMetadata.description.split(' ').slice(0, 15).join(' ') + '. . .read more' :
                                    linkMetadata.description
                                )
                            }
                        </span>
                    </div>
                </>
            ) : null}
        </div>
    );
}
export default Thumbnail;
