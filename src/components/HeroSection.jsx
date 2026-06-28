import React, { Component } from "react";
import classes from "./Styles.module.css";
import axios from "axios";
import {
  generateOpenShortLink,
  generateUserLink,
  checkIfUserExist,
} from "../helper/api";
import { Nav, Navbar, Container, Form, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import {
  FaPaste,
  FaCircleNotch,
  FaTimesCircle,
  FaYoutube,
  FaInstagram,
  FaSpotify,
  FaTwitter,
  FaTelegram,
  FaLinkedin,
  FaGooglePlay,
  FaGlobe,
  FaLink,
  FaCopy,
} from "react-icons/fa";
import { get_Tag } from "../helper/helperfn";
import Modal from "react-awesome-modal";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import "../css/profile.css";
import InApp from "detect-inapp";
import logo from "../assets/logo.avif";
import helmet from "../assets/helmet.avif";
import slogo from "../assets/slogo.png";
import appopenerLogo from "../assets/logo.avif";
import creatorcosmosLogo from "../assets/creator-cosmos.png";
import superprofileLogo from "../assets/Appzero.png";
import spawnserLogo from "../assets/Spawnsers.png";
import omniLogo from "../assets/Omni-logo.png";
import deetLogo from "../assets/deet-logo.png";
import talkieGhost from "../assets/talkie-ghost.png";
import IndianAi from "../assets/indian-ai.png";
import LinkModal from "./LinkModal";
import SpaceBackground from "./spaceComponent";
import PipIframe from "./PipFrame1";
import AttendanceButton from "./attendanceButton";
import Login from "../components/login";
import Logout from "../components/logout";

const cleanPhone = (val) => {
  if (!val) return "";
  let clean = String(val).trim().replace(/\D/g, "");
  if (clean.length === 12 && clean.startsWith("91")) {
    clean = clean.slice(2);
  } else if (clean.length === 11 && clean.startsWith("0")) {
    clean = clean.slice(1);
  }
  return clean;
};

class HeroSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      appname: "",
      old_original_url: "",
      errortext: "",
      loadingicon: false,
      urlexist: false,
      errortext_url: "",
      captchadone: false,
      copied: false,
      generatedlink: "",
      isLogin: false,
      googleuserID: "",
      GoogleAuthToken: "",
      displayemail: "",
      displayImage: "",
      displayname: "",
      screenWidth: window.innerWidth,
      selectedDomain: ".com",
      editWindow: false,
      showTypeModal: false,
      showPaymentFormModal: false,
      paymentName: "",
      paymentEmail: "",
      paymentPhone: "",
      type: "link",
      pendingType: "",
      countdown: 5,
      showAttedance: false,
      showHeroPromoteModal: false,
      heroPLinks: ["", "", "", ""],
      heroPromoName: "",
      heroPromoEmail: "",
      heroPromoPhone: "",
      heroPromoLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLoginDetails = this.getLoginDetails.bind(this);
    this.updateScreenWidth = this.updateScreenWidth.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.closeEditWindow = this.closeEditWindow.bind(this);
    this.getShortIdFromLink = this.getShortIdFromLink.bind(this);
  }

  closeEditWindow = () => {
    this.setState({ editWindow: false });
  };

  getShortIdFromLink = (generatedLink) => {
    if (!generatedLink) return "";
    const urlParts = generatedLink.split("/");
    return urlParts[urlParts.length - 1];
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateScreenWidth);
  }

  handleDomainChange = (e) => {
    this.setState({ selectedDomain: e.target.value });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateScreenWidth);
  }

  updateScreenWidth() {
    this.setState({ screenWidth: window.innerWidth });
  }

  getLoginDetails(val) {
    /* console.log("Login Details Received:", {
      googleId: val.googleId,
      email: val.profileObj.email,
      name: val.profileObj.name,
      tokenId: val.tokenObj.id_token
    }); */
    // alert("hi");
    // do not forget to bind getData in constructor
    //console.log("hello - ",val);
    //console.log("userID herosection - ", val.googleId);
    // console.log("email herosection - ",val.profileObj.email);
    if (val.googleId) {
      this.setState({
        googleuserID: val.googleId,
        isLogin: true,
        displayemail: val.profileObj.email,
        displayImage: val.profileObj.imageUrl,
        displayname: val.profileObj.name,
        GoogleAuthToken: val.tokenObj.id_token,
        toDash: "no",
      });

      checkIfUserExist(
        this.state.displayname,
        this.state.displayemail,
        this.state.googleuserID,
        this.state.GoogleAuthToken
      );
      /* console.log("Sending to checkIfUserExist:", {
        displayname: this.state.displayname,
        displayemail: this.state.displayemail,
        googleuserID: this.state.googleuserID,
        GoogleAuthToken: this.state.GoogleAuthToken
      }); */

      if (localStorage.getItem("loaded") === "ignoreOnce") {
        localStorage.removeItem("loaded");
      }
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });

    let appnames = "";
    appnames = get_Tag(event.target.value);
    this.setState({ appname: appnames });
  }

  handleSubmit(event) {
    if (this.state.value === "") {
      this.setState({ errortext_url: "Please enter your link" });
    } else if (this.state.appname === "" || this.state.appname === " ") {
      this.setState({ errortext_url: "Invalid Link" });
    } else {
      this.setState({ urlexist: true, errortext_url: "" });
      if (this.state.isLogin) {
        // user is logged in -> set type to 'link' and open modal directly
        this.setState({ type: "link" }, () => {
          this.openModal();
        });
      } else {
        // user is not logged in -> show captcha modal
        this.openCaptchaModal();
      }
    }
    event.preventDefault();
  }

  openModal() {
    this.setState({ visible: true, loadingicon: true });

    let appopener_app_url = "https://appopener" + this.state.selectedDomain + "/";

    if (this.state.isLogin) {
      this.setState({ generatedlink: "", copied: false });
      checkIfUserExist(
        this.state.displayname,
        this.state.displayemail,
        this.state.googleuserID,
        this.state.GoogleAuthToken
      );

      generateUserLink(
        this.state.appname,
        this.state.value,
        this.state.GoogleAuthToken,
        this.state.paymentPhone || null,
        this.state.type !== "link" ? this.state.type : null
      ).then((res) => {
        /* console.log("generateUserLink Request Data:", {
            appName: this.state.appname,
            originalUrl: this.state.value,
            authToken: this.state.GoogleAuthToken
          }); */
        //console.log("status");
        console.log("generateUserLink Response:", res);

        if (res.status === 401) {
          alert("Invalid Token Please try again");
          window.location.reload();
          return;
        }
        let tag = res.data.tag.toLowerCase();
        let original_url = res.data.originalURL;
        if (tag === "youtube") {
          // const videoIdIdx = original_url.search("v=")
          // const containsAnd=original_url.search("&t");
          // let videoId="";
          //   if(containsAnd!==-1){
          //     videoId=original_url.substring(videoIdIdx+2,containsAnd);
          //   }else{
          //     videoId=original_url.substring(videoIdIdx+2)
          //   }

          //   if(localStorage.getItem('videoId')===null){
          //     localStorage.setItem('videoId',videoId)
          //   }else{
          //     localStorage.removeItem('videoId')
          //     localStorage.setItem('videoId',videoId)
          // }
          tag = "yt";
        } else if (tag === "instagram") {
          tag = "ig";
        } else if (tag === "spotify") {
          tag = "sp";
        } else if (tag === "telegram") {
          tag = "tg";
        } else if (tag === "twitter") {
          tag = "tw";
        } else if (tag === "linkedin") {
          tag = "lk";
        } else if (tag === "playstore") {
          tag = "ps";
        } else if (tag === "docs") {
          tag = "docs";
        } else if (tag === "facebook") {
          tag = "fb";
        }
        let generated_url = "";
        if (this.state.type === "app") {
          generated_url = "https://appopener.com/" + tag + "/" + res.data.shortid;
        } else if (this.state.type === "ad-free") {
          generated_url = "https://appopener.net/free/" + tag + "/" + res.data.shortid;
        } else {
          generated_url = "https://appopener.in/" + tag + "/" + res.data.shortid;
        }
        this.setState({
          loadingicon: false,
          old_original_url: original_url,
          generatedlink: generated_url,
        });
      });
    } else {
      this.setState({ generatedlink: "" });
      generateOpenShortLink(
        this.state.appname,
        this.state.value,
        this.state.paymentPhone || null,
        this.state.type !== "link" ? this.state.type : null
      ).then((res) => {
          console.log("generateOpenShortLink Request Data:", {
            appName: this.state.appname,
            originalUrl: this.state.value,
          });
          // console.log("result is : ", res.data);
        let original_url = res.data.originalURL;
        let tag = res.data.tag.toLowerCase();
        console.log("generateOpenShortLink Response:", res);
        if (tag === "youtube") {
          tag = "yt";
        } else if (tag === "instagram") {
          tag = "ig";
        } else if (tag === "spotify") {
          tag = "sp";
        } else if (tag === "telegram") {
          tag = "tg";
        } else if (tag === "twitter") {
          tag = "tw";
        } else if (tag === "linkedin") {
          tag = "lk";
        } else if (tag === "playstore") {
          tag = "ps";
        } else if (tag === "docs") {
          tag = "docs";
        } else if (tag === "facebook") {
          tag = "fb";
        }
        let generated_url = "";
        if (this.state.type === "app") {
          generated_url = "https://appopener.com/" + tag + "/" + res.data.shortid;
        } else if (this.state.type === "ad-free") {
          generated_url = "https://appopener.net/free/" + tag + "/" + res.data.shortid;
        } else {
          generated_url = "https://appopener.in/" + tag + "/" + res.data.shortid;
        }
        this.setState({
          loadingicon: false,
          old_original_url: original_url,
          generatedlink: generated_url,
        });
      });
    }
  }

  async timeout(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  async handlePaste(input) {
    const text = await navigator.clipboard.readText();
    console.log(text);
    let appnames = "";
    appnames = get_Tag(text);
    this.setState({
      value: text,
      appname: appnames,
    });
  }

  async openCaptchaModal() {
    this.setState({
      visible_captcha: true,
      errortext: "",
      loadingicon: false,
    });
    await this.timeout(100);
    loadCaptchaEnginge(4, "black", "white");
  }
  closeCaptchaModal() {
    this.setState({
      visible_captcha: false,
    });
  }

  closeModal() {
    this.setState({
      visible: false,
    });
    this.closeCaptchaModal();
  }

  closeTypeModal = () => {
    this.setState({ showTypeModal: false });
  };

  handleOpenHeroPromoteModal = () => {
    if (this.state.value === "") {
      alert("Please enter your main link first");
      return;
    }
    if (this.state.appname === "" || this.state.appname === " ") {
      alert("Invalid Main Link");
      return;
    }
    this.setState({
      showHeroPromoteModal: true,
      heroPromoName: this.state.displayname || "",
      heroPromoEmail: this.state.displayemail || "",
      heroPromoPhone: "",
      heroPLinks: ["", "", "", ""],
    });
  };

  generateMainLinkForPromotion = async () => {
    let res;
    if (this.state.isLogin) {
      checkIfUserExist(
        this.state.displayname,
        this.state.displayemail,
        this.state.googleuserID,
        this.state.GoogleAuthToken
      );
      res = await generateUserLink(
        this.state.appname,
        this.state.value,
        this.state.GoogleAuthToken,
        null,
        "app"
      );
    } else {
      res = await generateOpenShortLink(
        this.state.appname,
        this.state.value,
        null,
        "app"
      );
    }

    if (!res || !res.data || !res.data.shortid) {
      throw new Error("Failed to generate main link");
    }

    let tag = res.data.tag.toLowerCase();
    if (tag === "youtube") tag = "yt";
    else if (tag === "instagram") tag = "ig";
    else if (tag === "spotify") tag = "sp";
    else if (tag === "telegram") tag = "tg";
    else if (tag === "twitter") tag = "tw";
    else if (tag === "linkedin") tag = "lk";
    else if (tag === "playstore") tag = "ps";
    else if (tag === "docs") tag = "docs";
    else if (tag === "facebook") tag = "fb";

    let generated_url = "";
    if (this.state.type === "app") {
      generated_url = "https://appopener.com/" + tag + "/a4/" + res.data.shortid;
    } else if (this.state.type === "ad-free") {
      generated_url = "https://appopener.net/free/" + tag + "/a4/" + res.data.shortid;
    } else {
      generated_url = "https://appopener.in/" + tag + "/a4/" + res.data.shortid;
    }

    return {
      shortId: res.data.shortid,
      generatedLink: generated_url,
      originalUrl: res.data.originalURL,
      type: this.state.type || "link"
    };
  };

  handleHeroPromoteSubmit = async (e) => {
    e.preventDefault();
    const { heroPLinks, heroPromoName, heroPromoEmail, heroPromoPhone } = this.state;

    const activeLinks = heroPLinks.filter((l) => l.trim() !== "");
    if (activeLinks.length === 0) {
      alert("Please enter at least one link to promote");
      return;
    }

    for (let linkStr of activeLinks) {
      try {
        const parsedUrl = new URL(linkStr.startsWith("http") ? linkStr : `https://${linkStr}`);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          throw new Error();
        }
      } catch (err) {
        alert(`Invalid URL: ${linkStr}`);
        return;
      }
    }

    if (!heroPromoName || !heroPromoPhone) {
      alert("Please fill in all payment details");
      return;
    }

    const cleanedPhone = cleanPhone(heroPromoPhone);
    this.setState({ heroPromoLoading: true, heroPromoPhone: cleanedPhone });

    try {
      const mainLinkData = await this.generateMainLinkForPromotion();
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}payment/createOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: heroPromoName,
            customer_email: heroPromoEmail || "",
            customer_phone: cleanedPhone,
            amount: 50,
            OrderType: "promote_links",
            promoted_links_data: {
              shortId: mainLinkData.shortId,
              links: activeLinks,
            },
          }),
        }
      );

      const orderData = await response.json();
      if (!response.ok || !orderData.success || !orderData.payment_session_id) {
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      const loadCashfreeSDK = () => {
        return new Promise((resolve, reject) => {
          if (window.Cashfree) {
            resolve(window.Cashfree);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
          script.onload = () => resolve(window.Cashfree);
          script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
          document.head.appendChild(script);
        });
      };

      const CashfreeInstance = await loadCashfreeSDK();
      const cashfree = CashfreeInstance({ mode: "production" });

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      }).then(() => {
        this.pollHeroPromoPaymentStatus(orderData.order_id, mainLinkData);
      });

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to initiate payment");
      this.setState({ heroPromoLoading: false });
    }
  };

  pollHeroPromoPaymentStatus = (orderIdToPoll, mainLinkData) => {
    let pollCount = 0;
    const POLL_INTERVAL = 3000;
    const MAX_POLLS = 10;

    const poll = async () => {
      pollCount++;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}payment/verify/${orderIdToPoll}`
        );
        const verifyData = await response.json();

        if (verifyData.order_status === "PAID") {
          alert("Payment successful! Promoted links added.");
          this.setState({
            showHeroPromoteModal: false,
            heroPromoLoading: false,
            visible: true,
            generatedlink: mainLinkData.generatedLink,
            old_original_url: mainLinkData.originalUrl,
            type: mainLinkData.type,
          });
          return;
        }

        if (verifyData.order_status === "EXPIRED" || verifyData.order_status === "TERMINATED") {
          alert("Payment failed or expired.");
          this.setState({ heroPromoLoading: false });
          return;
        }

        if (pollCount < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          alert("Payment verification timed out. If you paid, it will update automatically soon.");
          this.setState({ heroPromoLoading: false });
        }
      } catch (error) {
        console.error("Verification error:", error);
        if (pollCount < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          alert("Could not verify payment status.");
          this.setState({ heroPromoLoading: false });
        }
      }
    };

    poll();
  };

  handleTypeSelect = async (type) => {
    if (type === "ad-free" || type === "app") {
      this.setState({
        showTypeModal: false,
        showPaymentFormModal: true,
        pendingType: type,
        paymentName: this.state.displayname || "",
        paymentEmail: this.state.displayemail || "",
        paymentPhone: "",
      });
    } else {
      this.setState({ type }, () => {
        this.setState({ showTypeModal: false }, () => {
          this.openModal();
        });
      });
    }
  };

  initiatePayment = async (e) => {
    e?.preventDefault();
    const { paymentName, paymentEmail, paymentPhone, pendingType } = this.state;
    if (!paymentName|| !paymentPhone) {
      alert("Please fill all details");
      return;
    }
    const cleanedPhone = cleanPhone(paymentPhone);
    this.setState({ paymentPhone: cleanedPhone, showPaymentFormModal: false, loadingicon: true });
    try {
      const amount = pendingType === "app" ? "97" : "11";
      const orderType = pendingType === "app" ? "app_link" : "ad_free_link";
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}payment/createOrder`,
        {
          customer_name: paymentName,
          customer_email: paymentEmail || "",
          customer_phone: cleanedPhone,
          amount: amount,
          OrderType: orderType,
        }
      );

      if (!data.success || !data.payment_session_id) {
        throw new Error("Failed to create order");
      }

      const loadCashfreeSDK = () => {
        return new Promise((resolve, reject) => {
          if (window.Cashfree) {
            resolve(window.Cashfree);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
          script.onload = () => resolve(window.Cashfree);
          script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
          document.head.appendChild(script);
        });
      };

      const Cashfree = await loadCashfreeSDK();
      const cashfree = Cashfree({ mode: "production" });

      cashfree
        .checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal",
        })
        .then(() => {
          this.pollPaymentStatus(data.order_id);
        });
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed");
      this.setState({ loadingicon: false, showTypeModal: true });
    }
  };

  pollPaymentStatus = (orderIdToPoll) => {
    let pollCount = 0;
    const POLL_INTERVAL = 3000;
    const MAX_POLLS = 10;

    const poll = async () => {
      pollCount++;
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}payment/verify/${orderIdToPoll}`
        );

        if (data.order_status === "PAID") {
          this.setState({ type: this.state.pendingType || "ad-free" }, () => {
            this.openModal();
          });
          return;
        }

        if (data.order_status === "EXPIRED" || data.order_status === "TERMINATED") {
          alert("Payment failed or expired.");
          this.setState({ loadingicon: false, showTypeModal: true });
          return;
        }

        if (pollCount < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL);
        } else {
          alert("Payment verification timed out.");
          this.setState({ loadingicon: false, showTypeModal: true });
        }
      } catch (error) {
        alert("Could not verify payment status.");
        this.setState({ loadingicon: false, showTypeModal: true });
      }
    };

    poll();
  };

  verifyCaptcha = () => {
    this.setState({
      errortext: "",
      loadingicon: false,
    });
    let user_captcha = document.getElementById("user_captcha_input").value;
    if (user_captcha === "" || user_captcha === " ") {
      this.setState({
        errortext: "Please enter captcha value",
      });
    } else {
      if (validateCaptcha(user_captcha) === true) {
        this.setState(
          {
            errortext: "Verified!",
            loadingicon: false,
            visible_captcha: false,
            type: "link",
          },
          () => {
            console.log(
              "Captcha verified ✅ showing type modal",
              this.state.showTypeModal
            );
            this.openModal();
          }
        );
        document.getElementById("user_captcha_input").value = "";
      } else {
        this.setState({
          errortext: "Captcha not matched, Plz try again",
        });
        document.getElementById("user_captcha_input").value = "";
      }
    }
  };

  render() {
    if (this.state.toDash === "yes") {
      if (localStorage.getItem("loaded") !== "ignoreOnce") {
        return <Redirect to="/dashboard" />;
      }
    }

    const useragent = navigator.userAgent || navigator.vendor || window.opera;
    const inapp = new InApp(useragent);

    // 1. Captcha Modal
    let modal_captcha = <div></div>;
    if (this.state.visible_captcha) {
      modal_captcha = (
        <Modal
          style={{ position: "absolute" }}
          visible={this.state.visible_captcha}
          width="500"
          height="280"
          effect="fadeInDown"
          position="absolute"
          onClickAway={() => this.closeCaptchaModal()}
        >
          <div className="modal-content text-white relative bg-black border-0">
            <SpaceBackground />
            <div className="modal-header text-center relative z-10 p-6 flex justify-between items-center">
              <h5 className="modal-title font-bold">Verification for Added Security</h5>
              <a href="javascript:void(0);" onClick={() => this.closeCaptchaModal()}>
                <FaTimesCircle size="25px" color="white" />
              </a>
            </div>
            <div className="modal-body relative z-10">
              <center>
                <div>
                  {" "}
                  <LoadCanvasTemplate
                    reloadText="Reload Captcha"
                    reloadColor="white"
                  />
                  <input
                    placeholder="Enter Captcha Value"
                    id="user_captcha_input"
                    className="form-control mt-2"
                    name="user_captcha_input"
                    type="text"
                  />
                  <p className="text-danger mt-1">{this.state.errortext}</p>
                  <button className="btn btn-primary font-semibold mt-2" type="button" onClick={this.verifyCaptcha}>
                    Verify
                    {this.state.loadingicon ? <FaCircleNotch className={classes.spinner} /> : ""}
                  </button>
                </div>
                <br />
                <i className="font-semibold text-gray-300">To avoid Captcha Please Login..</i>
              </center>
            </div>
          </div>
        </Modal>
      );
    }
    // let showTypeModal1 = <div></div>;
    // if (this.state.showTypeModal) {
    //   showTypeModal1 = (
    //     <Modal
    //       visible={this.state.showTypeModal}
    //       width="95%"
    //       height="55%"
    //       effect="fadeInDown"
    //       onClickAway={() => this.closeTypeModal()}
    //       style={{
    //         zIndex: 99999,
    //         position: "fixed",
    //         maxWidth: "700px",
    //         width: "95%",
    //         maxHeight: "90vh",
    //         overflowY: "auto",
    //         borderRadius: "20px",
    //         padding: "6px",
    //       }}
    //     >
    //       <SpaceBackground />
    //       <div className="flex flex-row flex-wrap items-center justify-center gap-2 py-4 relative z-10">
    //         {/* Card 1: Single Link */}
    //         <div className="relative flex justify-center w-auto" onClick={() => this.handleTypeSelect("link")}>
    //           <div className={`relative w-[140px] h-[200px] sm:w-[150px] sm:h-[210px] rounded-xl border-[3px] border-gray-300 shadow-[0_6px_18px_rgba(0,0,0,0.25)] overflow-hidden select-none cursor-pointer transition-all duration-300 hover:-rotate-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${this.state.type === "link" ? "ring-4 ring-blue-500" : ""}`}>
    //             <div className="absolute inset-0 flex items-center justify-center opacity-30">
    //               <img src={slogo} alt="" />
    //             </div>
    //             <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center text-white">
    //               <div className="text-4xl mb-1">🔗</div>
    //               <h2 className="text-[16px] sm:text-[18px] font-bold uppercase">SINGLE LINK</h2>
    //               <p className="text-[13px] sm:text-[14px] font-semibold mt-1">(for Stories)</p>
    //             </div>
    //             <div className="absolute top-2 left-2">
    //               <img src={appopenerLogo} alt="" className="w-6 h-6" />
    //             </div>
    //             <div className="absolute bottom-2 right-2 rotate-180">
    //               <img src={appopenerLogo} alt="" className="w-6 h-6" />
    //             </div>
    //           </div>
    //         </div>

    //         {/* Card 2: Boost App Link */}
    //         <div className="relative flex justify-center w-auto" onClick={() => this.handleTypeSelect("app")}>
    //           <div className={`relative w-[140px] h-[200px] sm:w-[150px] sm:h-[210px] rounded-xl border-[3px] border-gray-300 shadow-[0_6px_18px_rgba(0,0,0,0.25)] overflow-hidden select-none cursor-pointer transition-all duration-300 hover:rotate-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${this.state.type === "app" ? "ring-4 ring-green-500" : ""}`}>
    //             <div className="absolute inset-0 flex items-center justify-center opacity-30">
    //               <img src={slogo} alt="" />
    //             </div>
    //             <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center text-white">
    //               <div className="text-4xl mb-1">📱</div>
    //               <h2 className="text-[16px] sm:text-[18px] font-bold uppercase">Boost<br />-O-<br />Barter Box</h2>
    //               <p className="text-[13px] sm:text-[14px] font-semibold mt-1">(for Bio)<br />($1)</p>
    //             </div>
    //             <div className="absolute top-2 left-2">
    //               <img src={appopenerLogo} alt="" className="w-6 h-6" />
    //             </div>
    //             <div className="absolute bottom-2 right-2 rotate-180">
    //               <img src={appopenerLogo} alt="" className="w-6 h-6" />
    //             </div>
    //           </div>
    //         </div>

    //         {/* Card 3: Ad-Free Link */}
    //         <div className="relative flex justify-center w-auto" onClick={() => this.handleTypeSelect("ad-free")}>
    //           <div className={`relative w-[140px] h-[200px] sm:w-[150px] sm:h-[210px] rounded-xl border-[3px] border-gray-300 shadow-[0_6px_18px_rgba(0,0,0,0.25)] overflow-hidden select-none cursor-pointer transition-all duration-300 hover:rotate-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${this.state.type === "ad-free" ? "ring-4 ring-yellow-500" : ""}`}>
    //             <div className="absolute inset-0 flex items-center justify-center opacity-30">
    //               <img src={slogo} alt="" />
    //             </div>
    //             <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center text-white">
    //               <div className="text-4xl mb-1">⭐</div>
    //               <h2 className="text-[16px] sm:text-[18px] font-bold uppercase">AD-FREE</h2>
    //               <p className="text-[13px] sm:text-[14px] font-semibold mt-1">(₹11)</p>
    //             </div>
    //             <div className="absolute top-2 left-2">
    //               <img src={appopenerLogo} alt="" className="w-6 h-6" />
    //             </div>
    //             <div className="absolute bottom-2 right-2 rotate-180">
    //               <img src={appopenerLogo} alt="" className="w-6 h-6" />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </Modal>
    //   );
    // }

    // // 3. Billing details payment modal
    // let paymentFormModal = <div></div>;
    // if (this.state.showPaymentFormModal) {
    //   paymentFormModal = (
    //     <Modal
    //       style={{ position: "absolute" }}
    //       visible={this.state.showPaymentFormModal}
    //       width="400"
    //       height="auto"
    //       effect="fadeInDown"
    //       position="absolute"
    //       onClickAway={() => this.setState({ showPaymentFormModal: false })}
    //     >
    //       <div className="modal-content text-white relative bg-black border-0 p-6 rounded-lg">
    //         <SpaceBackground />
    //         <div className="modal-header text-center relative z-10 flex justify-between items-center mb-4">
    //           <h5 className="modal-title font-bold text-xl">Payment Details</h5>
    //           <a className="color-white cursor-pointer ml-auto" onClick={() => this.setState({ showPaymentFormModal: false })}>
    //             <FaTimesCircle size="25px" color="white" />
    //           </a>
    //         </div>
    //         <div className="modal-body relative z-10">
    //           <form onSubmit={this.initiatePayment} className="flex flex-col gap-4">
    //             <input
    //               type="text"
    //               placeholder="Instagram Handle (without '@')"
    //               className="form-control px-3 py-2 rounded text-black"
    //               value={this.state.paymentName}
    //               onChange={(e) => this.setState({ paymentName: e.target.value })}
    //               required
    //             />
    //             <input
    //               type="email"
    //               placeholder="Email Address (optional)"
    //               className="form-control px-3 py-2 rounded text-black"
    //               value={this.state.paymentEmail}
    //               onChange={(e) => this.setState({ paymentEmail: e.target.value })}
    //             />
    //             <input
    //               type="tel"
    //               placeholder="Phone Number (10 digits)"
    //               className="form-control px-3 py-2 rounded text-black"
    //               value={this.state.paymentPhone}
    //               onChange={(e) => this.setState({ paymentPhone: cleanPhone(e.target.value) })}
    //               pattern="[0-9]{10}"
    //               required
    //             />
    //             <button
    //               type="submit"
    //               className="btn btn-primary font-bold mt-4 py-2 flex justify-center items-center"
    //               disabled={this.state.loadingicon}
    //             >
    //               Pay {this.state.pendingType === "app" ? "$1" : "₹11"}
    //               {this.state.loadingicon ? <FaCircleNotch className={`${classes.spinner} ml-2`} /> : null}
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     </Modal>
    //   );
    // }

    // // 4. Hero promote package modal (4 links)
    // let heroPromoteModal = <div></div>;
    // if (this.state.showHeroPromoteModal) {
    //   heroPromoteModal = (
    //     <Modal
    //       visible={this.state.showHeroPromoteModal}
    //       width="95%"
    //       height="auto"
    //       effect="fadeInDown"
    //       onClickAway={() => this.setState({ showHeroPromoteModal: false })}
    //       style={{
    //         zIndex: 99999,
    //         position: "fixed",
    //         maxWidth: "450px",
    //         width: "95%",
    //         maxHeight: "90vh",
    //         overflowY: "auto",
    //         borderRadius: "20px",
    //         padding: "6px",
    //       }}
    //     >
    //       <div className="modal-content text-white relative bg-[#0d0d1c] border-2 border-white/20 p-6 rounded-2xl max-h-[85vh] overflow-y-auto">
    //         <SpaceBackground />

    //         <div className="relative z-10">
    //           <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
    //             <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
    //               Promote More Links
    //             </h3>
    //             <button
    //               onClick={() => this.setState({ showHeroPromoteModal: false })}
    //               className="text-gray-400 hover:text-white border border-white/20 rounded px-2.5 py-0.5 text-xs"
    //             >
    //               Close
    //             </button>
    //           </div>

    //           <p className="text-xs text-gray-300 mb-4 leading-relaxed">
    //             Promote up to 4 other links alongside your main link for only ₹50! These will be visible to everyone who visits your smart link.
    //           </p>

    //           <form onSubmit={this.handleHeroPromoteSubmit} className="flex flex-col gap-3">
    //             {this.state.heroPLinks.map((pLink, idx) => (
    //               <div key={idx} className="flex flex-col gap-1">
    //                 <label className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
    //                   Promoted Link {idx + 1}
    //                 </label>
    //                 <input
    //                   type="url"
    //                   placeholder={`https://example.com/link${idx + 1}`}
    //                   value={pLink}
    //                   onChange={(e) => {
    //                     const updated = [...this.state.heroPLinks];
    //                     updated[idx] = e.target.value;
    //                     this.setState({ heroPLinks: updated });
    //                   }}
    //                   className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
    //                 />
    //               </div>
    //             ))}

    //             <div className="border-t border-white/10 my-3 pt-3 flex flex-col gap-3">
    //               <h4 className="text-sm font-bold text-gray-200">Billing Information</h4>
    //               <div className="flex flex-col gap-1">
    //                 <label className="text-[10px] text-gray-400 uppercase tracking-wider">Full Name</label>
    //                 <input
    //                   type="text"
    //                   placeholder="John Doe"
    //                   value={this.state.heroPromoName}
    //                   onChange={(e) => this.setState({ heroPromoName: e.target.value })}
    //                   className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
    //                   required
    //                 />
    //               </div>
    //               <div className="flex flex-col gap-1">
    //                 <label className="text-[10px] text-gray-400 uppercase tracking-wider">Email Address</label>
    //                 <input
    //                   type="email"
    //                   placeholder="john@example.com"
    //                   value={this.state.heroPromoEmail}
    //                   onChange={(e) => this.setState({ heroPromoEmail: e.target.value })}
    //                   className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
    //                   required
    //                 />
    //               </div>
    //               <div className="flex flex-col gap-1">
    //                 <label className="text-[10px] text-gray-400 uppercase tracking-wider">Phone Number</label>
    //                 <input
    //                   type="tel"
    //                   placeholder="10 digit number"
    //                   value={this.state.heroPromoPhone}
    //                   onChange={(e) => this.setState({ heroPromoPhone: e.target.value })}
    //                   className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
    //                   pattern="[0-9]{10}"
    //                   required
    //                 />
    //               </div>
    //             </div>

    //             <button
    //               type="submit"
    //               disabled={this.state.heroPromoLoading}
    //               className="w-full mt-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all duration-300 transform hover:scale-[1.02] flex justify-center items-center gap-2"
    //             >
    //               {this.state.heroPromoLoading ? (
    //                 <>
    //                   <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
    //                   Processing...
    //                 </>
    //               ) : (
    //                 "Pay ₹50 & Promote"
    //               )}
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     </Modal>
    //   );
    // }

    // 5. LinkModal output when visible is true
    let modal_generatelink = <div></div>;
    if (this.state.visible) {
      modal_generatelink = (
        <LinkModal
          isOpen={this.state.visible}
          onClose={() => this.closeModal()}
          link={this.state.generatedlink}
          originalUrl={this.state.old_original_url}
          type={this.state.type || "link"}
          onClickAway={() => this.closeModal()}
        />
      );
    }

    return (
      <>
        <div className={classes.heroBanner}>
          <div className={classes.overflowHidden}>
            <div className={classes.topHeader}>
              <div className="header">
                <Navbar expand="lg" className="navbar-dark">
                  <Container>
                    <div className="d-flex justify-content-start align-items-center">
                      <Navbar.Brand href="/" className="navbar-logo">
                        <img className={classes.logo} src={logo} alt="Logo" />
                      </Navbar.Brand>
                      <a
                        className="navbar-brand d-none d-lg-block"
                        href="/"
                        style={{
                          fontFamily: "Montserrat Alternates",
                          fontWeight: 600,
                          fontSize: "23px",
                          color: "white",
                          textDecoration: "none",
                        }}
                      >
                        APPOPENER
                      </a>
                    </div>

                    <div className="d-flex justify-content-start">
                      {this.state.isLogin ? (
                        <Nav.Link
                          href="/retrieve-links"
                          style={{
                            color: "white",
                            fontFamily: "Montserrat Alternates",
                            fontWeight: "800",
                            fontSize: "16px",
                          }}
                        >
                          Dashboard
                        </Nav.Link>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="d-flex justify-content-end">
                      <Nav>
                        <Form style={{ width: "100%" }}>
                          <div className={classes.btnSignGrp}>
                            {this.state.isLogin ? (
                              <div className="container d-flex flex-row">
                                <div className="top-container flex items-center gap-2">
                                  <img
                                    className="img-responsive img-fluid profile-image rounded-full"
                                    src={this.state.displayImage}
                                    width="40"
                                    alt="profile"
                                  />
                                  <div className="flex flex-col">
                                    <p className="name d-none d-lg-block text-white text-xs mb-0">
                                      {this.state.displayemail}
                                    </p>
                                    <div className="mail mt-0.5">
                                      <Logout />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <center>
                                <Login sendData={this.getLoginDetails} />
                              </center>
                            )}
                          </div>
                        </Form>
                      </Nav>
                    </div>
                  </Container>
                </Navbar>
              </div>
            </div>

            <div>
              <div className={classes.stars}></div>
              <div className={classes.stars2}></div>
              <div className={classes.stars3}></div>
            </div>

            <div className={classes.innerContent}>
              <Container>
                <Row>
                  <Col xs={12} md={12} lg={6}>
                    <h1 className={classes.title}>Smart Link</h1>
                    <p className={classes.subTitle} style={{ fontFamily: "Montserrat Alternates" }}>
                      Create SmartLinks to open desired apps from url without login
                    </p>
                    <Form className={classes.signupForm} style={{ marginBottom: "0px" }} onSubmit={this.handleSubmit}>
                      <div className="input-group mt-3" style={{ marginBottom: "0px" }}>
                        <input
                          type="text"
                          className="form-control w-full"
                          placeholder="paste your link here"
                          style={{ padding: "10px" }}
                          value={this.state.value}
                          onChange={this.handleChange}
                        />
                        <div className="input-group-append flex gap-1">
                          <button
                            className="btn btn-secondary"
                            type="button"
                            style={{ padding: "11px" }}
                            onClick={() => this.handlePaste()}
                          >
                            <FaPaste size="20px" />
                          </button>
                          <button
                            className="btn btn-secondary border-l border-white/20"
                            type="button"
                            style={{ padding: "11px" }}
                            disabled={true}
                          >
                            {this.state.appname === "Youtube" ? (
                              <FaYoutube size="25px" />
                            ) : this.state.appname === "Instagram" ? (
                              <FaInstagram size="25px" />
                            ) : this.state.appname === "Spotify" ? (
                              <FaSpotify size="25px" />
                            ) : this.state.appname === "Telegram" ? (
                              <FaTelegram size="25px" />
                            ) : this.state.appname === "Twitter" ? (
                              <FaTwitter size="25px" />
                            ) : this.state.appname === "Linkedin" ? (
                              <FaLinkedin size="25px" />
                            ) : this.state.appname === "Playstore" ? (
                              <FaGooglePlay size="25px" />
                            ) : (
                              <FaLink size="25px" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row gap-1">
                        <Button
                          className={classes.btnSignUp}
                          variant="primary"
                          type="submit"
                          style={{ height: "55px", flex: 1 }}
                        >
                          Smarten Link
                        </Button>
                        {/* <Button
                          className="rounded-lg font-bold flex items-center justify-center"
                          type="button"
                          onClick={this.handleOpenHeroPromoteModal}
                          style={{ height: "55px", flex: 1 }}
                        >
                          Promote 4 Links (₹50)
                        </Button> */}
                      </div>
                    </Form>

                    <div>
                      <p style={{ color: "red", paddingLeft: "10px", marginTop: "10px" }}>
                        {this.state.errortext_url}
                      </p>
                      <p style={{ color: "white", fontFamily: "Montserrat Alternates", fontSize: "15.38px" }}>
                        Login to view analytics
                      </p>
                    </div>

                    <div className="flex flex-row mt-2 items-center flex-wrap gap-3">
                      <FaYoutube size="30px" style={{ color: "#F20200" }} />
                      <FaInstagram size="30px" style={{ color: "#C42D8F" }} />
                      <FaSpotify size="30px" style={{ color: "#1BCC5A" }} />
                      <FaTwitter size="30px" style={{ color: "#1B99E5" }} />
                      <FaTelegram size="30px" style={{ color: "#2394CC" }} />
                      <FaLinkedin size="30px" style={{ color: "#0C61B8" }} />
                      <FaGooglePlay size="30px" style={{ color: "white" }} />
                      <FaGlobe size="30px" style={{ color: "#5BCEF2" }} />
                      <span style={{ color: "white" }}>& more to come...</span>
                    </div>
                  </Col>
                  
                  <Col xs={12} md={12} lg={6} className="d-none d-lg-block relative">
                    <img
                      className={classes.helmetanimate}
                      style={{
                        width: "350px",
                        right: "-24%",
                        bottom: "-12%",
                        position: "relative",
                      }}
                      src={helmet}
                      alt="Helmet Graphic"
                    />
                  </Col>
                </Row>
              </Container>
            </div>

            <div className={classes.totalCount}>
              <Container>
                <div className={classes.separator}></div>
                <Row className="mt-3">
                  <Col xs={12} md={12} lg={7}>
                    <Row className="justify-content-center text-center sm:text-left">
                      <Col xs={6} md={3} lg={3}>
                        <h3 className={classes.h3}>
                          200<span className="text-white-fade">+</span> thousand
                        </h3>
                        <p>Links</p>
                      </Col>
                      <Col xs={6} md={3} lg={3}>
                        <h3 className={classes.h3}>
                          100<span className="text-white-fade">+</span> thousand
                        </h3>
                        <p>Creators</p>
                      </Col>
                      <Col xs={6} md={3} lg={3} className={classes.xsNone}>
                        <h3 className={classes.h3}>
                          200<span className="text-white-fade">+</span> million
                        </h3>
                        <p>Clicks</p>
                      </Col>
                      <Col xs={6} md={3} lg={3} className={classes.xsNone}>
                        <h3 className={classes.h3}>
                          99.9<span className="text-white-fade">%</span>
                        </h3>
                        <p>Uptime</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={12} lg={5}></Col>
                </Row>
              </Container>
            </div>

            <div className={classes.displayFlex}>
              <img
                className={classes.bgImg}
                src={require("../assets/bg.svg").default}
                alt="bg transparent"
              />
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1680 40"
              className="position-absolute width-full z-1"
            >
              <path d="M0 40h1680V30S1340 0 840 0 0 30 0 30z" fill="#fff" />
            </svg>
          </div>
        </div>

        {/* Attendance, PIP Frame & Talkie widgets at the bottom */}
        {this.state.showAttedance && (
          <AttendanceButton setShowAttendanceButton={() => this.setState({ showAttedance: false })} />
        )}
        {/* <PipIframe src={"https://www.instagram.com/reel/DZVIu2Zv5nq/"} /> */}

        <a
          href="https://cosmic-chat-scan.lovable.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-2 left-2 z-50"
        >
          <img
            src={talkieGhost}
            alt="Talkie"
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        </a>

        {/* Modals from newdotin2 */}
        {modal_captcha}
        {/* {showTypeModal1} */}
        {modal_generatelink}
        {/* {paymentFormModal} */}
        {/* {heroPromoteModal} */}
      </>
    );
  }
}

export default HeroSection;
