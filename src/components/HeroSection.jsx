import classes from "./Styles.module.css";
import axios from "axios";
import {
  generateOpenShortLink,
  generateUserLink,
  checkIfUserExist,
} from "../helper/api";
import { Nav, Navbar, Container, Form } from "react-bootstrap";
/* import Header from "./Header";
import Login from "../components/login";
import Logout from "../components/logout"; */
import { Redirect } from "react-router-dom";
import { Component } from "react";
import { FaPaste, FaCircleNotch, FaTimesCircle } from "react-icons/fa";
import { get_Tag } from "../helper/helperfn";
import Modal from "react-awesome-modal";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import "../css/profile.css";
// import logo from "../assets/logo.avif";
import slogo from "../assets/slogo.png";
import appopenerLogo from "../assets/logo.avif";
import appodisco from "../assets/appo-disco.png";
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
import TopNav from "./TopNav";
import AttendanceButton from "./attendanceButton"

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

export function GlassBanner() {
  return (
    <div className="relative w-full flex justify-center pt-6 select-none">
      <div className="relative" style={{ perspective: "1200px" }}>
        <div className="pointer-events-none absolute -inset-8 -z-10 opacity-70">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-48 w-48 bg-fuchsia-500/40 blur-3xl" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-48 w-48 bg-cyan-400/40 blur-3xl" />
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-32 w-72 bg-indigo-500/30 blur-3xl" />
        </div>

        <div
          className="relative backdrop-blur-md p-2"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,26,26,0.45) 0%, rgba(0,0,0,0.45) 100%)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -8px 24px rgba(0,0,0,0.55), 0 30px 60px -10px rgba(0,0,0,0.7)",
            transform: "rotateX(6deg)",
            clipPath:
              "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
          }}
        >
          <div
            className="relative w-[320px] sm:w-[560px] h-[160px] sm:h-[280px] overflow-hidden bg-black/60"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
            }}
          >
            <a
            href="https://www.creatorcosmos.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/banner.png"
              alt="AppOpener banner"
              className="w-full h-full object-cover"
            />
          </a>
          </div>

          <div
            className="pointer-events-none absolute inset-x-4 top-0 h-6 opacity-50"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.4), transparent 90%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

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
      type: "app",
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
    return urlParts[urlParts.length - 1]; // Get the last part (shortId)
  };

  componentDidMount() {
    // this.getLoginDetails()
    window.addEventListener("resize", this.updateScreenWidth);
    // this.detectTimeZone();
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
    /* console.log("Handle Submit Data:", {
      url: this.state.value,
      appName: this.state.appname,
      isLogin: this.state.isLogin,
      selectedDomain: this.state.selectedDomain
    }); */
    if (this.state.value == "") {
      this.setState({ errortext_url: "Please enter your link" });
    } else if (this.state.appname == "" || this.state.appname == " ") {
      this.setState({ errortext_url: "Invalid Link" });
    } else {
      this.setState({ urlexist: true, errortext_url: "" });
      if (this.state.isLogin) {
        //user is loginned then no captcha
        this.openModal();
      } else {
        this.openCaptchaModal();
      }
    }

    //alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  openModal() {
    this.setState({ visible: true, loadingicon: true });

    //check if same link is clicked again & again

    let appopener_app_url =
      "https://appopener" + this.state.selectedDomain + "/";

    // if (this.state.value === this.state.old_original_url) {
    //   console.log("Same link detected — skipping API call");
    //   this.setState({
    //     visible: true, // still show modal
    //     loadingicon: false, // no spinner
    //     generatedlink: this.state.generatedlink,
    //   });
    //   return;
    // }

    /*  console.log(appopener_app_url); */
    // if (this.state.value === this.state.old_original_url) {
    //   this.setState({
    //     loadingicon: false,
    //     generatedlink: this.state.generatedlink,
    //   });
    // } else {
    //check if user is login or not
    if (this.state.isLogin) {
      this.setState({ generatedlink: "", copied: false });
      //check first whether to create new user account or not
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

        //console.log(res.status);
        if (res.status == 401) {
          alert("Invalid Token Please try again");
          window.location.reload();
          return;
        }
        let tag = res.data.tag.toLowerCase();
        //console.log(tag);
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
        // } else {
        //   tag = "web";
        // }
        let generated_url = "";
        console.log(this.state.type, res.data.shortid);
        if (this.state.type === "app") {
          generated_url =
            "https://appopener.com/" + tag + "/" + res.data.shortid;
        } else if (this.state.type === "ad-free") {
          generated_url =
            "https://appopener.net/free/" + tag + "/" + res.data.shortid;
        } else {
          generated_url =
            "https://appopener.in/" + tag + "/" + res.data.shortid;
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
            // const videoIdIdx = original_url.search("v=")
            // const containsAnd=original_url.search("&t");
            // // console.log("containsAnd: ",containsAnd);
            // let videoId="";
            // if(containsAnd!==-1){
            //   videoId=original_url.substring(videoIdIdx+2,containsAnd);
            // }else{
            //   videoId=original_url.substring(videoIdIdx+2)
            // }

            // if(localStorage.getItem('videoId')===null){
            //   localStorage.setItem('videoId',videoId)
            // }else{
            //   localStorage.removeItem('videoId')
            //   localStorage.setItem('videoId',videoId)
            // }
            // console.log("videoId", videoId);
            // console.log("props of the video section are : ", this.props);
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
          // else {
          //   tag = "web";
          // }
          let generated_url = "";
          console.log(this.state.type, res.data.shortid);
          if (this.state.type === "app") {
            generated_url =
              "https://appopener.com/" + tag + "/" + res.data.shortid;
          } else if (this.state.type === "ad-free") {
            generated_url =
              "https://appopener.net/free/" + tag + "/" + res.data.shortid;
          } else {
            generated_url =
              "https://appopener.in/" + tag + "/" + res.data.shortid;
          }
          //this.setState({intentvalue : res.data.app_intend});
          this.setState({
            loadingicon: false,
            old_original_url: original_url,
            generatedlink: generated_url,
          });
          console.log("-----", this.state);
        }
      );
    }
  }

  //   detectTimeZone = () => {
  //     const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //     if (
  //         userTimeZone.includes('Asia/Kolkata') ||
  //         userTimeZone.includes('Asia/Mumbai') ||
  //         userTimeZone.includes('Asia/Calcutta')
  //     ) {
  //         this.setState({ selectedDomain: '.in' });
  //     } else {
  //         this.setState({ selectedDomain: '.com' });
  //     }
  // };

  async timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
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
            errortext: "Verified! Please choose link type...",
            loadingicon: false,
            visible_captcha: false,
            showTypeModal: true,
          },
          () => {
            console.log(
              "Captcha verified ✅ showing type modal",
              this.state.showTypeModal
            );
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
          <div
            className="modal-content text-white relative bg-black"
            style={{
              border: "0",
            }}
          >
            <SpaceBackground />
            <div className="modal-header text-center relative z-10 p-6">
              <h5 className="modal-title">Verification for Added Security</h5>
              <a
                className="color-white"
                href="javascript:void(0);"
                onClick={() => this.closeCaptchaModal()}
              >
                <FaTimesCircle size="25px" />
              </a>
            </div>
            <div className="modal-body">
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
                    className="form-control"
                    name="user_captcha_input"
                    type="text"
                  ></input>
                  <p className="text-danger">{this.state.errortext}</p>
                  <button
                    className="btn btn-primary font-semibold"
                    type="button"
                    onClick={this.verifyCaptcha}
                  >
                    Verify
                    {this.state.loadingicon ? (
                      <FaCircleNotch className={classes.spinner} />
                    ) : (
                      ""
                    )}
                  </button>
                </div>
                <br></br>
                <i className="font-semibold">To avoid Captcha Please Login..</i>
              </center>
            </div>
          </div>
        </Modal>
      );
    } else {
      modal_captcha = <div></div>;
    }
    let showTypeModal1 = <div></div>;
    if (this.state.showTypeModal) {
      showTypeModal1 = (
        <Modal
  visible={this.state.showTypeModal}
  width="95%"
  height="55%"
  effect="fadeInDown"
  onClickAway={() => this.closeTypeModal()}
  style={{
    zIndex: 99999,
    position: "fixed",
    maxWidth: "700px",
    width: "95%",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "20px",
    padding: "6px",
  }}
>
  <SpaceBackground />

  {/* CARD WRAPPER */}
  <div
    className="
      flex flex-row
      flex-wrap
      items-center
      justify-center
      gap-2
      py-4
    "
  >
    {/* CARD 1 */}
    <div
      className="relative flex justify-center w-auto"
      onClick={() => this.handleTypeSelect("link")}
    >
      <div
        className={`relative w-[140px] h-[200px] sm:w-[150px] sm:h-[210px]
        rounded-xl border-[3px] border-gray-300 shadow-[0_6px_18px_rgba(0,0,0,0.25)]
        overflow-hidden select-none cursor-pointer transition-all duration-300
        hover:-rotate-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        ${
          this.state.type === "link" ? "ring-4 ring-blue-500" : ""
        }`}
      >
        Watermark logo
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <img src={slogo} alt="" />
        </div>

        {/* Card inner text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <div className="text-4xl mb-1">🔗</div>

          <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-200 uppercase">
            SINGLE LINK
          </h2>

          <p className="text-[13px] sm:text-[14px] text-gray-200 font-semibold mt-1">
            (for Stories)
          </p>
        </div>

        {/* Top-left value */}
        <div className="absolute top-2 left-2">
          <img src={appopenerLogo} alt="" className="w-6 h-6" />
        </div>

        {/* Bottom-right rotated value */}
        <div className="absolute bottom-2 right-2 rotate-180">
          <img src={appopenerLogo} alt="" className="w-6 h-6" />
        </div>
      </div>
    </div>

    {/* CARD 2 */}
    <div
      className="relative flex justify-center w-auto"
      onClick={() => this.handleTypeSelect("app")}
    >
      <div
        className={`relative w-[140px] h-[200px] sm:w-[150px] sm:h-[210px]
        rounded-xl border-[3px] border-gray-300 shadow-[0_6px_18px_rgba(0,0,0,0.25)]
        overflow-hidden select-none cursor-pointer transition-all duration-300
        hover:rotate-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        ${
          this.state.type === "app" ? "ring-4 ring-green-500" : ""
        }`}
      >
        {/* Watermark logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <img src={slogo} alt="" />
        </div>

        {/* Card inner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <div className="text-4xl mb-1">📱</div>

          <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-200 uppercase">
            Boost
            <br />
            -O-
            <br />
            Barter Box 
          </h2>

          <p className="text-[13px] sm:text-[14px] text-gray-200 font-semibold mt-1">
            (for Bio)
            <br />
            ($1)
          </p>
        </div>

        {/* Top-left value */}
        <div className="absolute top-2 left-2">
          <img src={appopenerLogo} alt="" className="w-6 h-6" />
        </div>

        {/* Bottom-right rotated value */}
        <div className="absolute bottom-2 right-2 rotate-180">
          <img src={appopenerLogo} alt="" className="w-6 h-6" />
        </div>
      </div>
    </div>

    {/* CARD 3 */}
    <div
      className="relative flex justify-center w-auto"
      onClick={() => this.handleTypeSelect("ad-free")}
    >
      <div
        className={`relative w-[140px] h-[200px] sm:w-[150px] sm:h-[210px]
        rounded-xl border-[3px] border-gray-300 shadow-[0_6px_18px_rgba(0,0,0,0.25)]
        overflow-hidden select-none cursor-pointer transition-all duration-300
        hover:rotate-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        ${
          this.state.type === "ad-free"
            ? "ring-4 ring-yellow-500"
            : ""
        }`}
      >
        {/* Watermark logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <img src={slogo} alt="" />
        </div>

        {/* Card inner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <div className="text-4xl mb-1">⭐</div>

          <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-200 uppercase">
            AD-FREE
          </h2>

          <p className="text-[13px] sm:text-[14px] text-gray-200 font-semibold mt-1">
            (₹11)
          </p>
        </div>

        {/* Top-left value */}
        <div className="absolute top-2 left-2">
          <img src={appopenerLogo} alt="" className="w-6 h-6" />
        </div>

        {/* Bottom-right rotated value */}
        <div className="absolute bottom-2 right-2 rotate-180">
          <img src={appopenerLogo} alt="" className="w-6 h-6" />
        </div>
      </div>
    </div>
  </div>
</Modal>
      );
    }
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
        //         <Modal
        //           style={{
        //             position: "absolute",
        //             display: "flex",
        //             justifyContent: "center",
        //             alignItems: "center",
        //           }}
        //           visible={this.state.visible}
        //           width="auto"
        //           maxwidth="90%"
        //           height="auto"
        //           maxHeight="80%"
        //           effect="fadeInDown"
        //           position="absolute"
        //           onClickAway={() => this.closeModal()}
        //         >
        //           <div
        //             className="modal-content"
        //             style={{
        //               border: "0",
        //               borderRadius: "10px",
        //               boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        //               overflow: "hidden",
        //             }}
        //           >
        //             {/* Header */}
        //             <div className="modal-header d-flex justify-content-between align-items-center px-4 py-3">
        //               <h5 className="modal-title mb-0 flex items-center justify-center">Step 3. Share your Super Story</h5>
        //               <a href="javascript:void(0);" onClick={() => this.closeModal()}>
        //                 <FaTimesCircle size="22px" color="#000000" />
        //               </a>
        //             </div>

        //             {/* Main Scrollable Body */}
        //             <div
        //               className="modal-body"
        //               style={{
        //                 padding: "1px",
        //                 maxHeight: "65vh",
        //                 overflowY: "auto",
        //                 backgroundColor: "#f9f9fb",
        //               }}
        //             >

        //             <EditLinkForm
        //               originalURL={this.state.old_original_url}
        //               shortId={this.getShortIdFromLink(this.state.generatedlink)}
        //               onCancel={() => this.closeEditWindow()}
        //               disabled={!this.state.editWindow}
        //             />
        //               {/* <InstaStory
        //                 download={false}
        //                 videoId="nQOescIkJns"
        //                 headline="Check out our latest video!"
        //                 /> */}
        //               {/* Link Preview Section */}
        //               <div className="mt-4">
        //                 <div className="input-group shadow-sm">
        //                   <span className="input-group-text bg-secondary text-white">
        //                     <FaLink />
        //                   </span>
        //                   <input
        //                     type="text"
        //                     className="form-control"
        //                     value={this.state.generatedlink}
        //                     disabled={true}
        //                   />
        //                 </div>

        //                 {/* Button actions */}
        //                 <div className="d-flex flex-wrap gap-2 mt-3">
        //                   {this.state.loadingicon ? (
        //                     <button className="btn btn-primary px-4 py-2" disabled>
        //                       <FaCircleNotch className={classes.spinner} /> Please wait
        //                     </button>
        //                   ) : (
        //                     <div className="flex flex-col gap-2 w-full">
        //                       <div className="flex gap-4 justify-between items-center">
        //                       <CopyToClipboard
        //                         text={this.state.generatedlink}
        //                         onCopy={() => this.setState({ copied: true })}
        //                       >
        //                         <button className="btn btn-primary px-2 py-2">
        //                           <FaCopy size="20px" /> Copy Link
        //                         </button>
        //                       </CopyToClipboard>
        // {/*                       <button
        //                         className="btn btn-secondary px-2 py-2"
        //                         onClick={() => this.setState({ editWindow: true })}
        //                       >
        //                         <FaEdit size="20px" /> Edit Link
        //                       </button> */}
        //                       <a href={`/visualShop/${this.state.VideoId}`}>
        //                       <button
        //                         className="btn btn-secondary px-2 py-2"
        //                       >
        //                         <FaShoppingBag size="20px" /> Super Story
        //                       </button>
        //                       </a>
        //                       </div>

        //                     </div>
        //                   )}
        //                 </div>

        //                 {this.state.copied && (
        //                   <p className="text-success mt-2">Link copied to clipboard!</p>
        //                 )}
        //               </div>
        //             </div>

        //             {/* Footer */}
        //             <div className="modal-footer px-4 py-3 bg-white text-black">
        //               <p
        //                 className="text-muted text-white mb-2"
        //                 style={{ fontSize: "0.9rem" }}
        //               >
        //               </p>
        //               {inapp.isMobile ? (
        //                 <ShareButton
        //                   className="mt-2"
        //                   title="AppOpener Smartlink"
        //                   url={this.state.generatedlink}
        //                 />
        //               ) : (
        //                 <div className="d-flex justify-content-center mt-3 w-100">
        //                   <ShareButtons
        //                     title="AppOpener Smartlink"
        //                     url={this.state.generatedlink}
        //                     tags="#appopener"
        //                   />
        //                 </div>
        //               )}
        //             </div>
        //           </div>
        //         </Modal>
      );
    } else {
      modal_generatelink = <div></div>;
    }

    let paymentFormModal = <div></div>;
    if (this.state.showPaymentFormModal) {
      paymentFormModal = (
        <Modal
          style={{ position: "absolute" }}
          visible={this.state.showPaymentFormModal}
          width="400"
          height="auto"
          effect="fadeInDown"
          position="absolute"
          onClickAway={() => this.setState({ showPaymentFormModal: false })}
        >
          <div className="modal-content text-white relative bg-black border-0 p-6 rounded-lg">
            <SpaceBackground />
            <div className="modal-header text-center relative z-10 flex justify-between items-center mb-4">
              <h5 className="modal-title font-bold text-xl">Payment Details</h5>
              <a
                className="color-white cursor-pointer ml-auto"
                onClick={() => this.setState({ showPaymentFormModal: false })}
              >
                <FaTimesCircle size="25px" />
              </a>
            </div>
            <div className="modal-body relative z-10">
              <form onSubmit={this.initiatePayment} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Instagram Handle (without '@')"
                  className="form-control px-3 py-2 rounded text-black"
                  value={this.state.paymentName}
                  onChange={(e) => this.setState({ paymentName: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address (optional)"
                  className="form-control px-3 py-2 rounded text-black"
                  value={this.state.paymentEmail}
                  onChange={(e) => this.setState({ paymentEmail: e.target.value })}
                  // required
                />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  className="form-control px-3 py-2 rounded text-black"
                  value={this.state.paymentPhone}
                  onChange={(e) => this.setState({ paymentPhone: cleanPhone(e.target.value) })}
                  pattern="[0-9]{10}"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary font-bold mt-4 py-2 flex justify-center items-center"
                  disabled={this.state.loadingicon}
                >
                  Pay {this.state.pendingType === "app" ? "$1" : "₹11"}
                  {this.state.loadingicon ? (
                    <FaCircleNotch className={`${classes.spinner} ml-2`} />
                  ) : null}
                </button>
              </form>
            </div>
          </div>
        </Modal>
      );
    }

    let heroPromoteModal = <div></div>;
    if (this.state.showHeroPromoteModal) {
      heroPromoteModal = (
        <Modal
          visible={this.state.showHeroPromoteModal}
          width="95%"
          height="auto"
          effect="fadeInDown"
          onClickAway={() => this.setState({ showHeroPromoteModal: false })}
          style={{
            zIndex: 99999,
            position: "fixed",
            maxWidth: "450px",
            width: "95%",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "20px",
            padding: "6px",
          }}
        >
          <div className="modal-content text-white relative bg-[#0d0d1c] border-2 border-white/20 p-6 rounded-2xl max-h-[85vh] overflow-y-auto">
            <SpaceBackground />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
                  Promote More Links
                </h3>
                <button
                  onClick={() => this.setState({ showHeroPromoteModal: false })}
                  className="text-gray-400 hover:text-white border border-white/20 rounded px-2.5 py-0.5 text-xs"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                Promote up to 4 other links alongside your main link for only ₹50! These will be visible to everyone who visits your smart link.
              </p>

              <form onSubmit={this.handleHeroPromoteSubmit} className="flex flex-col gap-3">
                {this.state.heroPLinks.map((pLink, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <label className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                      Promoted Link {idx + 1}
                    </label>
                    <input
                      type="url"
                      placeholder={`https://example.com/link${idx + 1}`}
                      value={pLink}
                      onChange={(e) => {
                        const updated = [...this.state.heroPLinks];
                        updated[idx] = e.target.value;
                        this.setState({ heroPLinks: updated });
                      }}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                    />
                  </div>
                ))}

                <div className="border-t border-white/10 my-3 pt-3 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-gray-200">Billing Information</h4>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={this.state.heroPromoName}
                      onChange={(e) => this.setState({ heroPromoName: e.target.value })}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={this.state.heroPromoEmail}
                      onChange={(e) => this.setState({ heroPromoEmail: e.target.value })}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="10 digit number"
                      value={this.state.heroPromoPhone}
                      onChange={(e) => this.setState({ heroPromoPhone: e.target.value })}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={this.state.heroPromoLoading}
                  className="w-full mt-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all duration-300 transform hover:scale-[1.02] flex justify-center items-center gap-2"
                >
                  {this.state.heroPromoLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    "Pay ₹50 & Promote"
                  )}
                </button>
              </form>
            </div>
          </div>
        </Modal>
      );
    }

    return (
      <div className="relative min-h-screen bg-transparent overflow-visible z-10 px-4 sm:px-6">

<div className="relative pt-4 pb-2">

  <div className="flex justify-center">
    <img
      className="w-30 sm:w-38 h-32 cursor-pointer"
      src={appodisco}
      alt="Logo"
      onClick={() => this.setState({ showAttedance: true })}
    />
  </div>

  <a
    href="/retrieve-links"
    className="absolute top-8 right-2 sm:right-4 flex items-center gap-2 rounded-lg py-2 px-4 bg-indigo-600 text-white font-semibold no-underline"
  >
    <span>Dashboard</span>
    {/* <img src={slogo} alt="logo" className="w-7 h-7" /> */}
  </a>

</div>

  <GlassBanner />

  <div className="header">
    <Navbar
      expand="lg"
      className={this.state.click ? classes.active : "navbar-dark"}
    >
      <Container>
        {/* ✅ FIXED NAVBAR */}
        <div className="flex items-center justify-between w-full px-2">
          <div className="w-full flex flex-row no-underline items-center justify-center" />
        </div>

        <div className="d-flex justify-content-end">
          <Nav>
            <Form className={classes.logingoogle} style={{ width: "100%" }}>
              <div className={classes.btnSignGrp}>
                {this.state.isLogin ? <></> : <></>}
              </div>
            </Form>
          </Nav>
        </div>
      </Container>
    </Navbar>
  </div>
{/* <div className="relative" style={{ zIndex: 0 }}>
  <TopNav />
</div>  */}
  {/* ✅ MAIN SECTION */}
  <div className="relative flex flex-col items-center justify-center mt-4">

    {/* ✅ CARD FIXED */}
    <div className="relative flex flex-col w-full max-w-[360px] rounded-[2.5rem] bg-gradient-to-br from-[#0d0d1c] to-[#1b1b2d] p-4 py-4 text-white shadow-inner border-4 border-orange-900">

      <div className="space-y-6">

        <h5 className="font-bold flex items-center justify-center text-center text-2xl sm:text-base">
          Welcome to AppOpener
        </h5>

        {/* STEP 1 */}
        <div>
          <p className="text-sm mb-1 text-gray-400">Apka Romanchic Kissa ?</p>

          {/* ✅ INPUT FIX */}
          <div className="flex flex-row gap-2">
            <input
              className="form-control flex-1 min-w-0"
              value={this.state.value}
              onChange={this.handleChange}
              placeholder="Paste your Link ->"
            />
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => this.handlePaste()}
            >
              <FaPaste size="20px" />
            </button>
          </div>
        </div>

          {/* ✅ BUTTON STACK FIX */}
          <div className="flex-row gap-5 mt-2">
            <button
  className="
    group relative overflow-hidden
    flex items-center justify-center gap-3
    w-full mt-3 px-3 py-2
    rounded-2xl
    bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700
    hover:from-violet-500 hover:via-fuchsia-500 hover:to-indigo-600
    border border-white/20
    shadow-[0_10px_35px_rgba(139,92,246,0.45)]
    hover:shadow-[0_15px_45px_rgba(168,85,247,0.65)]
    transition-all duration-300
    hover:scale-[1.02]
    active:scale-[0.98]
  "
  onClick={this.handleOpenHeroPromoteModal}
>
  {/* Glow Effect */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

  {/* Premium Shine */}
  <div className="absolute -left-20 top-0 h-full w-16 rotate-12 bg-white/20 blur-md group-hover:left-[120%] transition-all duration-1000" />

  {/* Left Content */}
  <div className="flex flex-col items-start text-left z-10">
    <span className="text-lg font-extrabold tracking-wide text-white">
      ADD UPTO 4 LINK 
      SUGGESTIONS
    </span>
  </div>

  {/* Price Badge */}
  <div
    className="
      z-10 shrink-0
      flex flex-col items-center justify-center
      min-w-[72px]
      px-3 py-2
      rounded-2xl
      bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400
      border-2 border-yellow-100
      shadow-lg shadow-yellow-500/40
      text-black
      group-hover:scale-105
      transition-transform duration-300
    "
  >
    <span className="text-[10px] font-black uppercase tracking-widest">
      Only
    </span>

    <span className="text-xl leading-none font-extrabold">
      ₹50
    </span>
  </div>
</button>
            <button 
              className="flex-1 py-1 rounded-md bg-violet-700 text-white shadow-md font-bold text-lg sm:text-lg mt-4 w-full"
              onClick={this.handleSubmit}
            >
              Smarten 🌟
            </button>
          </div>
        </div> 
      </div>
  
  <div className="relative" style={{ zIndex: 0 }}>
  <TopNav />
  </div> 
    {/* ✅ LINKS SECTION - 3D ORBITING ECOSYSTEM SPHERES */}
    {/* <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl justify-center mt-8 mb-4 relative z-10 w-full max-w-[900px] border-4 border-orange-900 p-4 overflow-hidden"> */}
      <style>{`
        .orbit-container {
          --radius: 105px;
          position: relative;
          width: 320px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1.5rem auto;
        }

        @media (min-width: 640px) {
          .orbit-container {
            --radius: 155px;
            width: 450px;
            height: 450px;
          }
        }

        /* Orbital path ring */
        .orbit-path {
          position: absolute;
          width: calc(var(--radius) * 2);
          height: calc(var(--radius) * 2);
          border: 2px dashed rgba(255, 255, 255, 0.12);
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        }

        /* Central core sphere */
        .orbit-core {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;

  /* Realistic glossy red sphere */
  background:
    radial-gradient(circle at 30% 28%,
      #ffffff 0%,
      #ffe5e5 6%,
      #ff8f8f 14%,
      #ff3b3b 32%,
      #ff0000 55%,
      #c40000 78%,
      #5a0000 100%
    );

  /* 3D depth + outer glow */
  box-shadow:
    inset -12px -14px 20px rgba(0, 0, 0, 0.45),
    inset 10px 10px 16px rgba(255, 255, 255, 0.18),
    0 0 18px rgba(255, 0, 0, 0.55),
    0 0 40px rgba(255, 0, 0, 0.3);

  border: 1px solid rgba(255,255,255,0.12);

  z-index: 20;
  animation: pulseCore 3s ease-in-out infinite;
  overflow: hidden;
}

/* Main glossy reflection */
.orbit-core::before {
  content: "";
  position: absolute;
  top: 10px;
  left: 14px;
  width: 600px;
  height: 50px;
  border-radius: 100%;

  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.95),
    rgba(255,255,255,0.15)
  );

  transform: rotate(-18deg);
  filter: blur(1px);
}

/* Lower ambient reflection */
.orbit-core::after {
  content: "";
  position: absolute;
  bottom: 10px;
  right: 12px;
  width: 28px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  filter: blur(4px);
}

        @media (min-width: 640px) {
          .orbit-core {
            width: 105px;
            height: 105px;
          }
        }

        @keyframes pulseCore {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 35px rgba(255, 94, 98, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.4);
          }
          50% {
            transform: scale(1.06);
            box-shadow: 0 0 50px rgba(255, 94, 98, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.5);
          }
        }

        /* Orbiting item wrappers */
        .orbit-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -30px;
          margin-left: -30px;
          width: 60px;
          height: 60px;
          z-index: 10;
        }

        @media (min-width: 640px) {
          .orbit-wrapper {
            margin-top: -42px;
            margin-left: -42px;
            width: 84px;
            height: 84px;
          }
        }

        /* Unique Orbit Keyframe Animations with counter-rotations */
        .orbit-0 { animation: orbit0 32s linear infinite; }
        .orbit-1 { animation: orbit1 32s linear infinite; }
        .orbit-2 { animation: orbit2 32s linear infinite; }
        .orbit-3 { animation: orbit3 32s linear infinite; }
        .orbit-4 { animation: orbit4 32s linear infinite; }
        .orbit-5 { animation: orbit5 32s linear infinite; }

        @keyframes orbit0 {
          from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg); }
          to { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg); }
        }
        @keyframes orbit1 {
          from { transform: rotate(60deg) translateX(var(--radius)) rotate(-60deg); }
          to { transform: rotate(420deg) translateX(var(--radius)) rotate(-420deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(var(--radius)) rotate(-120deg); }
          to { transform: rotate(480deg) translateX(var(--radius)) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(180deg) translateX(var(--radius)) rotate(-180deg); }
          to { transform: rotate(540deg) translateX(var(--radius)) rotate(-540deg); }
        }
        @keyframes orbit4 {
          from { transform: rotate(240deg) translateX(var(--radius)) rotate(-240deg); }
          to { transform: rotate(600deg) translateX(var(--radius)) rotate(-600deg); }
        }
        @keyframes orbit5 {
          from { transform: rotate(300deg) translateX(var(--radius)) rotate(-300deg); }
          to { transform: rotate(660deg) translateX(var(--radius)) rotate(-660deg); }
        }

        /* Pause rotation on container hover */
        .orbit-container:hover .orbit-wrapper {
          animation-play-state: paused;
        }

        /* 3D Glassmorphism Sphere */
        .orbit-sphere {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.5) 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 4px 15px rgba(255, 255, 255, 0.3);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .orbit-sphere:hover {
          transform: scale(1.22);
          border-color: rgba(255, 255, 255, 0.6);
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0.6) 100%);
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.45), inset 0 4px 20px rgba(255, 255, 255, 0.5);
        }
      `}</style>

    {/* <div className="orbit-wrapper orbit-0"> */}
        {/* </div> */}

      <div className="orbit-container">
        {/* Subtle path ring */}
        <div className="orbit-path" />

        {/* Pulsing Core */}
        <div className="orbit-core flex flex-col justify-center items-center text-center">
          <span className="font-orbitron font-extrabold text-[14px] sm:text-[17px] text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">APPO</span>
          <span className="text-[8px] sm:text-[10px] font-bold text-white/80 tracking-widest uppercase mt-0.5 select-none">Ecosys</span>
        </div>

        {/* Sphere 0: CreatorCosmos */}
        <div className="orbit-wrapper orbit-0">
          <a
            href="https://www.creatorcosmos.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="orbit-sphere flex items-center justify-center no-underline"
          >
            <img
              src={creatorcosmosLogo}
              alt="AppOpener"
              className="w-[60%] h-[60%] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
          </a>
        </div>

        {/* Sphere 1: Superprofile */}
        <div className="orbit-wrapper orbit-1">
          <a
            href="https://appø.com"
            target="_blank"
            rel="noopener noreferrer"
            className="orbit-sphere flex items-center justify-center no-underline"
          >
            <img
              src={superprofileLogo}
              alt="Superprofile"
              className="w-[60%] h-[60%] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
          </a>
        </div>

        {/* Sphere 2: Spawnser */}
        <div className="orbit-wrapper orbit-2">
          <a
            href="https://spawnser.com"
            target="_blank"
            rel="noopener noreferrer"
            className="orbit-sphere flex items-center justify-center no-underline"
          >
            <img
              src={spawnserLogo}
              alt="Spawnser"
              className="w-[65%] h-[65%] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
          </a>
        </div>

        {/* Sphere 3: Deet */}
        <div className="orbit-wrapper orbit-3">
          <a
            href="https://deet.me"
            target="_blank"
            rel="noopener noreferrer"
            className="orbit-sphere flex items-center justify-center no-underline"
          >
            <img
              src={deetLogo}
              alt="Deet"
              className="w-[60%] h-[60%] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
          </a>
        </div>

        {/* Sphere 4: LoginSkip */}
        <div className="orbit-wrapper orbit-4">
          <a
            href="https://loginskip.com"
            target="_blank"
            rel="noopener noreferrer"
            className="orbit-sphere flex items-center justify-center no-underline p-1 text-center"
          >
            <span className="text-[10px] sm:text-[13px] font-black uppercase tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              LoginSkip
            </span>
          </a>
        </div>

        {/* Sphere 5: Indian AI */}
        <div className="orbit-wrapper orbit-5">
          <a
            href="https://www.indian-ai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="orbit-sphere flex flex-col items-center justify-center no-underline p-1 text-center"
          >
            <img
              src={IndianAi}
              alt="Indian AI"
              className="w-[45%] h-[45%] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
            <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mt-0.5">
              Indian AI
            </span>
          </a>

        </div>
      </div>
    {/* </div> */}

      {/* </div> */}
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-2 rounded-xl justify-center mt-2 mb-4 relative -z-1 w-full max-w-[900px]">


      {/* ✅ TEXT FIX */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-white text-center">
        Preview Portal🔗
      </h2>

      <div className="flex flex-col items-center mt-3 text-center break-all px-2">
        <a href="https://www.appopener.com/yt/share"> 
          https://www.appopener.com/yt/share 
        </a>
        <a href="https://www.appopener.in/yt/share">
          https://www.appopener.in/yt/share
        </a>
        <a href="https://www.appopener.net/free/yt/share">
          https://www.appopener.net/free/yt/share
        </a>
      </div>
    </div>
        <div className="relative z-10 mb-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
  <img
    src="/portal.png"
    alt="ShareTray banner"
    className="h-80 w-full object-cover sm:h-96"
  />
</div>
<div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-xl">
  <iframe
    width="100%"
    height="500"
    src="https://www.youtube.com/embed/cYUfdsHK858"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
  />
  <img
    src="/sticker.png"
    alt="ShareTray banner"
    className="h-80 w-full object-cover sm:h-96"
  />
</div>
    {modal_captcha}
    {modal_generatelink}
    {showTypeModal1}
    {paymentFormModal}
    {heroPromoteModal}

    {/* Floating Talkie button — bottom left */}
    {/* <a href="https://cosmic-chat-scan.lovable.app/" target="_blank" rel="noopener noreferrer">
      <img
        src={talkieGhost}
        alt="Talkie"
        style={{ width: 120, height: 120, objectFit: "contain", pointerEvents: "none" }}
      />
    </a> */}
    <style>{`
      @keyframes talkiePulse {
        0%, 100% { box-shadow: 0 4px 20px rgba(126,200,227,.4), 0 0 30px rgba(168,237,234,.2); }
        50%      { box-shadow: 0 4px 28px rgba(126,200,227,.6), 0 0 45px rgba(168,237,234,.35); }
      }
    `}</style>

  </div>
  {this.state.showAttedance && <AttendanceButton setShowAttendanceButton={() => this.setState({showAttedance:false})}/>}
  <PipIframe src={"https://www.instagram.com/reel/DZVIu2Zv5nq/"} />

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
</div>
    );
  }
}

export default HeroSection;
