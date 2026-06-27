import { Component } from "react";
import React from "react";
import classes from "../components/Styles.module.css";
import "../css/splash.css";
import PageHead from "../components/Splash/PageHead";
import appOpnr from "../assets/AppOpener.png";
import star from "../assets/star.png";
import star1 from "../assets/star1.png";
import redbutton from "../assets/redbutton.png";
import homeImage from "../assets/footer-space-man.avif"

import HamburgerMenu from "../components/hamburger";
import Small_ham from "../components/small_ham";
import Suggest from "../components/Splash/Suggest";
import Blog from "../components/Splash/Blog";
import { getBrandURL } from "../helper/brandApi";
import Featured from "../components/AppSuite/Featured";
import AdsterraAd from "../components/Adsterads";
// import G13Ads from "../components/g13ads";




class AppSuite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intentvalue: "", original_url: "", ostype: "", showFullText: false, setPageHead: false, linkMetadata: {}, isSmallScreen: false,
            thumbUrl: "",
            description: "",
            video_id: "",
            video_title: "",
            channel_title: "",
            yt_dp_url: "",
            seconds: "5",
            redirectText: "Please wait...",
            show_description: false,
            suggestions: {},
            showSuggestion: false,
            subdomain: undefined,
            doRedirection: true
        };
    }

    componentDidMount() {
        let subdomain = this.props.subdomain;
        this.setState({
            subdomain: subdomain
        });
        getBrandURL(subdomain).then((res) => {
            if (res === undefined) {
                return
            }
            const linkMeta = res.data.metadata
            this.setState({
                linkMetadata: {
                    title: linkMeta.title || "AppSuite by AppOpener",
                    image: linkMeta.image || homeImage,
                    description: linkMeta.description || "Get all your links in one place",
                    embedUrl: linkMeta.embedUrl || "",
                    tag: linkMeta.tag || "links appsuite appopener"
                }
            })

            this.setState({ setPageHead: true })
            this.setState({ original_url: res.data.originalURL });
            let originalURL = this.state.original_url;

            this.setState({
                suggestions: res.data.links
            });

            this.setState({
                showSuggestion: true
            });

            const click_link = document.getElementById("abcd");

            this.timerInterval = setInterval(() => {
                this.setState(prevState => ({
                    seconds: prevState.seconds - 1
                }), () => {
                    if (this.state.seconds === 0) {
                        this.setState({ seconds: "" })
                        if (this.state.ostype == "windows") {
                            click_link.setAttribute("href", originalURL);
                            click_link.click();
                            //console.log("hello")
                        }
                        // const cancel = document.getElementById("cancel");
                        // cancel.style.display = "none";
                        // clearInterval(this.timerInterval);
                        // Perform action after 5 seconds (e.g., trigger a click event)
                    }
                });
            }, 1000); // Update every second


            setTimeout(() => {
                click_link.setAttribute("href", originalURL);
                this.setState({ seconds: "", redirectText: "Click here to Continue" })
                // if (this.state.doRedirection) {
                //     click_link.click();
                // }
            }, 5000);


        });

        window.addEventListener("resize", this.updateScreenSize);
        // Call updateScreenSize once to set initial state based on screen size
        this.updateScreenSize();

    }
    componentWillUnmount() {
        // Cleanup listener on unmount
        window.removeEventListener("resize", this.updateScreenSize);
        clearInterval(this.timerInterval);
    }
    updateScreenSize = () => {
        // Update isSmallScreen state based on screen width
        this.setState({ isSmallScreen: window.innerWidth <= 655 });
    };

    stopRedirecting() {
        this.setState({ seconds: "", redirectText: "Click here to Continue", doRedirection: false });
        clearInterval(this.timerInterval);
        const cancel = document.getElementById("cancel");
        cancel.style.display = "none";
    }

    render() {
        return (
            <>
                {this.state.setPageHead && <PageHead metadata={this.state.linkMetadata} />}

                <div className={classes.mainContainer}>
                    <AdsterraAd/>

                    <div className="App">
                        <div className="w-screen h-[120px] flex items-center justify-center strip">
                            <div className="logo">
                                <a href="/"><img src={appOpnr} alt="" /></a>
                            </div>
                            <div style={{ marginLeft: "77%", marginBottom: "2%", whiteSpace: "nowrap" }}>
                                {/* Conditionally render based on screen size */}
                                {this.state.isSmallScreen ? <Small_ham /> : <HamburgerMenu />}
                            </div>
                        </div>

                        <a className="continueButton" id="abcd" target="_blank">
                            <button style={{ color: "white", fontWeight: "600" }}><span style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>{this.state.redirectText}</span></button>
                        </a>

                        {/* <div className="cancel" id="cancel">
                            <button style={{ color: "white", fontWeight: "600", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }} onClick={() => {
                                this.stopRedirecting()
                            }}>Cancel</button>
                        </div> */}

                        {this.state.setPageHead ? (<>
                            <div className="Glass" style={{ margin: '1%', marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: "10px" }}>
                                <div className="thumb" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

                                    <img src={this.state.linkMetadata.image} style={{maxHeight: "300px"}} />


                                </div>

                                <div style={{ color: "white", padding: "15px", fontWeight: "700", wordWrap: "break-word", maxWidth: "500px" }}>
                                    {this.state.linkMetadata.title}
                                </div>

                                <div style={{ color: "white", maxWidth: "600px", margin: "10px auto" }}>
                                    <span className="hover:cursor-pointer" onClick={() => this.setState({ show_description: !this.state.show_description })}>
                                        {this.state.linkMetadata.description && this.state.show_description ?
                                            (this.state.linkMetadata.description ?
                                                this.state.linkMetadata.description :
                                                this.state.linkMetadata.description
                                            ) :

                                            (this.state.linkMetadata.description ?
                                                this.state.linkMetadata.description.split(' ').slice(0, 15).join(' ') + '. . .read more' :
                                                this.state.linkMetadata.description
                                            )
                                        }
                                    </span>
                                </div>

                            </div>

                            <div className="tag">
                                <h1 style={{ fontSize: "30px", fontFamily: "Palatino" }}>"AppOpener Featured Content"</h1>
                            </div>

                        </>) : (<></>)}
                        {/* {
                            (process.env.REACT_APP_BOSS_TITLE.length) ?
                                <>
                                    <Featured data={{
                                        "smart_link": process.env.REACT_APP_BOSS_SMART_LINK,
                                        metadata: {
                                            "title": process.env.REACT_APP_BOSS_TITLE,
                                            "image": process.env.REACT_APP_BOSS_IMAGE
                                        }
                                    }} key="boss1" />
                                </> : <></>
                        } */}

                        {this.state.showSuggestion ? <>
                            {this.state.suggestions.map((item, index) => {
                                let key = `suggest${index}`
                                return (
                                    <>
                                        <Featured data={item} key={key} />
                                    </>)
                            })}
                        </> : <>
                            {/* <div className="tag">
                                <p style={{ fontSize: "20px", fontFamily: "Palatino", margin: "20px" }}>"Loading..."</p>
                            </div> */}
                        </>}
                    </div>
                </div >
            </>
        );
    }
}

export default AppSuite;
