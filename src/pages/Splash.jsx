// src/pages/Splash.jsx
import React, { Component } from "react";
import classes from "../components/Styles.module.css";
import appOpnr from "../assets/AppOpener.png";
import homeImage from "../assets/footer-space-man.avif";
import { redirectOpenLink, getSuggestions, GetLatestBlogs } from "../helper/api";
import InApp from "detect-inapp";
import axios from "axios";


class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intentvalue: "",
      original_url: "",
      ostype: "",
      showFullText: false,
      setPageHead: false,
      linkMetadata: {},
      isSmallScreen: false,
      thumbUrl: "",
      description: "",
      video_id: "",
      video_title: "",
      channel_title: "",
      yt_dp_url: "",
      seconds: 5, // countdown start (string to keep same shape)
      redirectText: "Redirecting in",
      show_description: false,
      suggestions: {},
      showSuggestion: false,
      blogs: {},
      showBlogs: false,
      googleuserID: "",
      GoogleAuthToken: "",
      isLogin: false,
      visible_captcha: false,
      errortext: "",
      loadingicon: false,
      generateModalVisibe: false,
      old_original_url: "",
      generateURL: "",
      captchadone: false,
      copied: false,
      generatedlink: "",
      userURL: "",
      displayemail: "",
      displayImage: "",
      displayname: "",
      url: ""
    };

    this.getLoginDetails = this.getLoginDetails.bind(this);
    this.openCaptchaModal = this.openCaptchaModal.bind(this);
    this.updateScreenSize = this.updateScreenSize.bind(this);
  }

  fetchData = async () => {
    if (!this.state.video_id) return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${this.state.video_id}&key=AIzaSyDmdJlLHLNXXrcziAnfmZ0PfL7Pl7Reza0`
      );
      const videoInfo = response.data?.items?.[0]?.snippet;
      if (videoInfo) {
        this.setState({
          thumbUrl: videoInfo.thumbnails?.high?.url || "",
          video_description: videoInfo.description || "",
          video_title: videoInfo.title || "",
          channel_title: videoInfo.channelTitle || ""
        });
      }
    } catch (e) {
      // ignore
    }
  };


  getSugBlog = async () => {
    try {
      const suggestions = await getSuggestions();
      if (suggestions !== undefined) {
        this.setState({ suggestions, showSuggestion: true });
      }
      const blogs = await GetLatestBlogs(5);
      if (blogs !== undefined) {
        this.setState({ blogs, showBlogs: true });
      }
    } catch (e) {
      // ignore
    }
  };

  componentDidMount() {
  let apptag = this.props.match?.params?.apptype;
  let shortstring = this.props.match?.params?.shorturl;

  redirectOpenLink(apptag, shortstring).then((res) => {
    if (!res) return;

    // update same pieces of state as before (kept names)
    const linkMeta = res.data?.metadata || {};
    let linkMetaTag = (linkMeta.tag || "").trim();
    linkMetaTag = linkMetaTag + " appopener app0 appo smart links";
    linkMetaTag = linkMetaTag.replace(/ /g, ", ");

    this.setState({
      linkMetadata: {
        title: linkMeta.title || "AppOpener",
        image: linkMeta.image || homeImage,
        description: linkMeta.description || "",
        embedUrl: linkMeta.embedUrl || "",
        tag: linkMetaTag
      },
      setPageHead: true,
      intentvalue: res.data?.app_intend || "",
      original_url: res.data?.originalURL || "",
      ostype: res.data?.os_type || ""
    }, () => {
      const originalURL = this.state.original_url || "";
      let videoId = "";
      try {
        if (originalURL.includes("youtu.be")) {
          const urlParams = new URL(originalURL);
          videoId = urlParams.pathname.substr(1);
        } else {
          const urlParams = new URL(originalURL);
          videoId = urlParams.searchParams.get("v") || "";
        }
      } catch (e) {
        videoId = "";
      }
      if (videoId) {
        this.setState({ video_id: videoId }, this.fetchData);
      }
      this.getSugBlog();

      // start timer
      this.startTimer();
    });
  });

  window.addEventListener("resize", this.updateScreenSize);
  this.updateScreenSize();
}

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateScreenSize);
    clearInterval(this.timerInterval);
  }

  updateScreenSize = () => {
    this.setState({ isSmallScreen: window.innerWidth <= 655 });
  };

  startTimer = () => {
  let secs = parseInt(this.state.seconds, 10);
  if (isNaN(secs) || secs < 0) secs = 5;

  this.setState({ seconds: secs });

  if (this.timerInterval) clearInterval(this.timerInterval);

  this.timerInterval = setInterval(() => {
    this.setState((prev) => {
      const newVal = (typeof prev.seconds === "number" ? prev.seconds : parseInt(prev.seconds || "0", 10)) - 1;
      return { seconds: newVal >= 0 ? newVal : 0 };
    }, () => {
      const curr = typeof this.state.seconds === "number" ? this.state.seconds : parseInt(this.state.seconds || "0", 10);
      if (curr <= 0) {
        clearInterval(this.timerInterval);
        this.setState({ seconds: "", redirectText: "Click here to Continue" }, () => {
          const app_intend = this.state.intentvalue === "Desktop" || this.state.intentvalue === "Mobile"
            ? this.state.original_url
            : this.state.intentvalue || this.state.original_url;

          if (!app_intend) return;

          try {
            window.open(app_intend, "_blank", "noopener,noreferrer");
          } catch (e) {
            try { window.location.href = app_intend; } catch (_) {}
          }
        });
      }
    });
  }, 1000);
};

  stopRedirecting() {
    this.setState({ seconds: "", redirectText: "Click here to Continue" });
    clearInterval(this.timerInterval);
    const cancel = document.getElementById("cancel");
    if (cancel) cancel.style.display = "none";
  }

  getLoginDetails(val) {
    if (val?.googleId) {
      this.setState({
        googleuserID: val.googleId,
        isLogin: true,
        displayemail: val.profileObj?.email || "",
        displayImage: val.profileObj?.imageUrl || "",
        displayname: val.profileObj?.name || "",
        GoogleAuthToken: val.tokenObj?.id_token || ""
      });
    }
  }

  async timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  async openCaptchaModal(event) {
    this.setState({ visible_captcha: true, errortext: "", loadingicon: false });
    await this.timeout(200);
    event?.preventDefault?.();
  }

  closeCaptchaModal() {
    this.setState({ visible_captcha: false });
  }

  handleGenerateModal() {
    this.setState({ generateModalVisibe: true });
  }

  submitForm = () => {
    const origLink = document.getElementById("user_link_input")?.value || "";
    if (!origLink.trim()) {
      this.setState({ errortext: "Please enter correct link" });
      return;
    }
    this.setState({ userURL: origLink, errortext: "Verified Please wait ... ", loadingicon: true });
    setTimeout(() => this.setState({ loadingicon: false }), 800);
  };

  closeModal() {
    this.setState({ generateModalVisibe: false });
    this.closeCaptchaModal();
  }

  updateGeneratedUrl = (generatedURL) => {
    this.setState({ url: generatedURL });
  };

  render() {
    const apptag = this.props.match?.params?.apptype;
    const shortstring = this.props.match?.params?.shorturl;
    const { seconds, redirectText, linkMetadata } = this.state;

    const title = (linkMetadata && (linkMetadata.title || "AppOpener")) || "AppOpener";
    const image = (linkMetadata && (linkMetadata.image || homeImage)) || homeImage;
    const subtitle = (linkMetadata && linkMetadata.description) || "";

    return (
      <>
        <div style={styles.page}>
          <header style={styles.header}>
            <a href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              <img src={appOpnr} alt="AppOpener" style={styles.logo} />
            </a>
          </header>

          <main style={styles.main}>
            <div style={styles.card}>
              <img src={image} alt="thumb" style={styles.thumb} />
              <h1 style={styles.title}>{title}</h1>
              {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}

              <div style={styles.timerWrap}>
                <a id="abcd" target="_blank" rel="noreferrer" href="#!">
                  <button
                    className={classes?.btnSignUp}
                    style={styles.continueButton}
                    onClick={() => {
                      const url = this.state.original_url;
                      if (url) {
                        try {
                          window.open(url, "_blank", "noopener,noreferrer");
                        } catch (e) {
                          try { window.location.href = url; } catch (_) {}
                        }
                      }
                    }}
                  >
                    <span style={styles.timerText}>
                      {redirectText} {seconds}
                    </span>
                  </button>
                </a>

                <button id="cancel" onClick={() => this.stopRedirecting()} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </main>

          <footer style={styles.footer}>
            <small style={{ color: "#aaa" }}>Made with ♥ — AppOpener</small>
            <div style={{ marginTop: 8 }}>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.REACT_APP_SMART_LINK_PREFIX + apptag + "/" + shortstring)}`}
                target="_blank"
                rel="noreferrer"
                style={styles.shareIcon}
              >
                Facebook
              </a>{" "}
              •{" "}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(process.env.REACT_APP_SMART_LINK_PREFIX + apptag + "/" + shortstring)}&text=${encodeURIComponent("Use appopener")}`}
                target="_blank"
                rel="noreferrer"
                style={styles.shareIcon}
              >
                X
              </a>
            </div>
          </footer>
        </div>
      </>
    );
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0b1220",
    color: "white",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 12px",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingTop: 8,
  },
  logo: {
    height: 42,
    objectFit: "contain",
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  card: {
    maxWidth: 760,
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: 24,
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
  },
  thumb: {
    width: 160,
    height: 90,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
  },
  subtitle: {
    color: "#d1d5db",
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
  },
  timerWrap: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  continueButton: {
    background: "#ff6b35",
    border: "none",
    padding: "12px 20px",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
    color: "white",
    fontWeight: 700,
  },
  cancelButton: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    padding: "10px 14px",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },
  timerText: {
    textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
  },
  footer: {
    padding: 8,
    textAlign: "center",
  },
  shareIcon: {
    color: "#9ca3af",
    textDecoration: "none",
    fontSize: 13,
  },
};

export default Splash;