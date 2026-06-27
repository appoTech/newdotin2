import React from "react";
import classes from "./Styles.module.css";
import {
  generateOpenShortLink,
  generateUserLink,
  checkIfUserExist,
} from "../helper/api";
import {
  Row,
  Col,
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import Header from "./Header";
// import Login from "../components/login";
import Logout from "../components/logout";
import { Component } from "react";
import {
  FaAndroid,
  FaCircleNotch,
  FaClosedCaptioning,
  FaCopy,
  FaGlobe,
  FaGooglePay,
  FaGooglePlay,
  FaLinkedin,
  FaSleigh,
  FaSpinner,
  FaSpotify,
  FaTelegram,
  FaTimesCircle,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { get_Tag, validURL } from "../helper/helperfn";
import Modal from "react-awesome-modal";
import ShareButton from "react-web-share-button";
import ShareButtons from "../components/share";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "../css/profile.css";
import InApp from "detect-inapp";

import logo from "../assets/logo.avif";
import helmetLogo from "../assets/helmet.avif";
import transparentBg from "../assets/bg.svg";


// branded imports
import Dashboard from "./dashboard";
import Pop from "./pop_up";
import Login from "./login";
import "./styles.css";
import HomePage from "./HomePage";

import { CiHome } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5"; 
import { SlHome } from "react-icons/sl";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuPieChart } from "react-icons/lu";
import appIco from "../assets/favicon.ico";
import { FaSearch } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { IoCloseSharp } from "react-icons/io5";
import { Email } from "@mui/icons-material";
import { MdDashboard } from "react-icons/md";


class Dashes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      appname: "",
      old_original_url: "",
      new_link: "",
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
      showDashboard: true,
      showHomepage: true,
      showOLinks: false,
      showMyCart: false,
      showMenuBar: false,
      
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLoginDetails = this.getLoginDetails.bind(this);
  }
  componentDidMount() {
    // this.getLoginDetails()
    // let location = localStorage.getItem('location_dashboard')
    // if (location) {
    //   this.setState(
    //     { showDashboard: true, showHomepage: false, showMyCart:false, showOLinks:false}
    //   )
    // }
  }

  getLoginDetails(val) {
    
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
      });
      // console.log('token set', val.tokenObj.id_token);
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    let appnames = "";
    appnames = get_Tag(event.target.value);
    this.setState({ appname: appnames });
    // console.log(this.state.appname, this.state.value)
  }
  handleSubmit(event) {
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
    let appopener_app_url = process.env.REACT_APP_SMART_LINK_PREFIX;
    // console.log(appopener_app_url);
    if (this.state.value === this.state.old_original_url) {
      this.setState({
        loadingicon: false,
        generatedlink: this.state.generatedlink,
      });
    } else {
      //check if user is login or not
      if (this.state.isLogin) {
        this.setState({ generatedlink: "", copied: false });
        //check first whether to create new user account or not
        checkIfUserExist(
          this.state.displayname,
          this.state.displayemail,
          this.state.googleuserID
        );

        generateUserLink(
          this.state.appname,
          this.state.value,
          this.state.GoogleAuthToken
        ).then((res) => {
          //console.log("status");
          //console.log(res.status);
          if (res.status == 401) {
            alert("Invalid Token Please try again");
            window.location.reload();
            return;
          }
          let tag = res.data.tag.toLowerCase();
          //console.log(tag);
          if (this.state.new_link !== res.data) {
            this.setState({new_link: res.data})
          }
          let original_url = res.data.originalURL;

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
          }
          let generated_url = appopener_app_url + tag + "/" + res.data.shortid;
          this.setState({
            loadingicon: false,
            old_original_url: original_url,
            generatedlink: generated_url,
          });
        });
      } else {
        this.setState({ generatedlink: "" });
        generateOpenShortLink(this.state.appname, this.state.value).then(
          (res) => {
            //console.log(res);
            let tag = res.data.tag.toLowerCase();
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
            } 
            let original_url = res.data.originalURL;
            let generated_url =
              appopener_app_url + tag + "/" + res.data.shortid;
            //this.setState({intentvalue : res.data.app_intend});
            this.setState({
              loadingicon: false,
              old_original_url: original_url,
              generatedlink: generated_url,
            });
          }
        );
      }
    }
  }

  async timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
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
      if (validateCaptcha(user_captcha) == true) {
        this.setState({
          errortext: "Verified Please wait ... ",
          loadingicon: true,
        });
        loadCaptchaEnginge(4, "black", "white");
        document.getElementById("user_captcha_input").value = "";

        this.openModal();
      } else {
        this.setState({
          errortext: "Captcha not matched, Plz try again",
        });
        document.getElementById("user_captcha_input").value = "";
      }
    }
  };

  render() {
    const useragent = navigator.userAgent || navigator.vendor || window.opera;
    const inapp = new InApp(useragent);

    const handleCLick = (event) => {
      this.setState({ value: "" });
    };

    let modal_captcha = <div></div>;

    if (this.state.visible_captcha) {
      modal_captcha = (
        <Modal
          style={{ position: "absolute" }}
          visible={this.state.visible_captcha}
          width="500"
          height="300"
          effect="fadeInDown"
          position="absolute"
          onClickAway={() => this.closeCaptchaModal()}
        >
          <div className="modal-content" style={{ border: "0" }}>
            <div className="modal-header text-center">
              <h5 className="modal-title">Captcha verification</h5>
              <a
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
                    reloadColor="green"
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
                    className="btn btn-primary"
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
                <i>To avoid Captcha Please Login..</i>
              </center>
            </div>
          </div>
        </Modal>
      );
    } else {
      modal_captcha = <div></div>;
    }
    let modal_generatelink = <div></div>;
    if (this.state.visible) {
      modal_generatelink = (
        <Modal
          style={{ position: "absolute" }}
          visible={this.state.visible}
          width="90%"
          height="50%"
          effect="fadeInDown"
          position="absolute"
          onClickAway={() => this.closeModal()}
        >
          <div className="modal-content" style={{ border: "0" }}>
            <div className="modal-header text-center">
              <h5 className="modal-title">Smarten your Links</h5>
              <a href="javascript:void(0);" onClick={() => this.closeModal()}>
                <FaTimesCircle size="25px" />
              </a>
            </div>
            <div className="modal-body">
              <div className="input-group mt-3">
                <button
                  className="btn btn-secondary"
                  disabled={true}
                  type="button"
                  style={{ padding: "10px" }}
                  onClick={handleCLick}
                >
                  <FaLink size="20px" />
                </button>
                <input
                  type="text"
                  className="form-control"
                  style={{ padding: "10px" }}
                  value={this.state.generatedlink}
                  disabled={true}
                />
                <div className="input-group-append">
                  {this.state.loadingicon ? (
                    <>
                      {" "}
                      <button
                        className="btn btn-primary"
                        type="button"
                        style={{ padding: "11px" }}
                      >
                        <FaCircleNotch className={classes.spinner} /> Please
                        wait
                      </button>
                    </>
                  ) : (
                    <>
                      <CopyToClipboard
                        text={this.state.generatedlink}
                        onCopy={() => this.setState({ copied: true })}
                      >
                        <button
                          className="btn btn-primary"
                          type="button"
                          style={{ padding: "11px" }}
                        >
                          <FaCopy size="25px" /> Copy Link
                        </button>
                      </CopyToClipboard>
                    </>
                  )}
                </div>
              </div>
              {this.state.copied ? (
                <p style={{ color: "red", padding: "5px" }}>link copied</p>
              ) : (
                ""
              )}

              <hr />
            </div>
            <div
              className="modal-footer"
              style={{ display: "block", borderTop: "0" }}
            >
              {inapp.isMobile ? (
                <ShareButton
                  className=""
                  title="AppOpener Smartlink"
                  url={this.state.generatedlink}
                />
              ) : (
                <>
                  <center>
                    <ShareButtons
                      title="AppOpener Smartlink"
                      url={this.state.generatedlink}
                      tags="#appopener"
                    />
                  </center>
                </>
              )}
            </div>
          </div>
        </Modal>
      );
    } else {
      modal_generatelink = <div></div>;
    }
    return (
      <>
            {/* NavBar */}
            
            <div className="flex w-full min-h-screen flex-col md:grid md:grid-cols-12 max-w-full">
            {this.state.showMenuBar ? (<></>):(<>
            <div className={`${classes.navMenu} flex flex-1 items-center md:flex-col min-w-screen justify-between md:justify-start gap-20 md:pt-7 bg-blue-950  text-gray-500 
                `} style={{gridColumn: 'span 1'}}>
                    <div className="text-2xl md:flex justify-center md:w-24"><a target="blank"onClick={() => {localStorage.setItem('loaded', 'ignoreOnce')} } href="/"><img className="w-10" src={appIco} alt="ICO Image"  /></a></div>
                      {/* <div className={`text-2xl md:flex justify-center py-2 md:w-24 ${this.state.showHomepage? `text-white`:``}  hidden cursor-pointer`} onClick={() => this.setState({showDashboard: false, showHomepage: true, showOLinks: false, showMyCart:false})}>
                        <SlHome />
                      </div> */}
                        <div className={`text-2xl hidden md:flex ${this.state.showDashboard ? `text-white`:``} justify-center py-2 cursor-pointer md:w-24`} onClick={() => this.setState({ showDashboard: true, showHomepage: false, showMyCart:false, showOLinks:false})}>
                        <MdDashboard/></div>
                      <div className={`text-2xl hidden md:flex ${this.state.showMyCart ? `text-white`:``} justify-center py-2 cursor-pointer md:w-24`} onClick={() => this.setState({showHomepage: false,showDashboard: false, showOLinks: false, showMyCart:true})}>
                          <FaArrowTrendUp  /></div>
                      <div className={`text-2xl hidden md:flex ${this.state.showOLinks ? `text-white`:``} justify-center py-2 cursor-pointer md:w-24`} onClick={() => this.setState({ showOLinks: true, showDashboard: false, showMyCart:false, showHomepage:false})}>
                        <LuPieChart  /></div>
                      
                      <div className="text-2xl border-2 p-2 md:hidden cursor-pointer"
                          onClick={() => this.setState({showMenuBar: true})}>
                        <SlOptionsVertical/>
                    </div>

                    
                {/* <div className="flex flex-col-reverse flex-1 mb-5 w-24 items-center">
                    <div className="text-2xl text-white"><IoSettingsOutline /></div>
                </div> */}
            </div>
            </>)}

            {/* mobile view menu */}
            {this.state.showMenuBar ?(<>
            <div className="absolute bg-blue-900 h-24 min-h-full min-w-full md:hidden">
                <div className="h-28 flex items-center justify-end pr-4 text-white text-4xl border-b-[1px]"
                    onClick={() => this.setState({showMenuBar: false})}>
                    <IoCloseSharp />
                </div>
                <div className="text-xl py-8 grid grid-cols-6 items-center text-white gap-4">
                    <div className="flex justify-center"><img  src={appIco} alt="ICO Image" onClick={() => this.setState({showMyCart: false})}
                        style={{gridColumn: 'span 1'}} /></div>
                        <div style={{gridColumn: 'span 5'}} >APPOPENER</div>
                    </div>
                

                <div className="text-xl text-white grid grid-cols-6 items-center gap-4  py-2 focus:border-2 rounded-2xl mx-[3px] border-[1px] bg-blue-700 border-white cursor-pointer"
                    onClick={()=> this.setState({showDashboard: true, showHomepage: false, showOLinks: false, showMyCart: false, showMenuBar: false})}>
                    <div className="flex justify-center">
                        <SlHome 
                        style={{gridColumn: 'span 1'}} /></div>
                    <div style={{gridColumn: 'span 5'}}>Dashboard</div>
                </div>

                <div className="text-xl text-white grid grid-cols-6 items-center gap-4 py-2 cursor-pointer"
                    onClick={() => this.setState({showDashboard: false, showOLinks: false, showMyCart: true, showMenuBar: false, showHomepage: false})}>
                    <div className="text-2xl flex justify-center">
                        <FaArrowTrendUp 
                            style={{gridColumn: 'span 1'}} /></div>
                    <div style={{gridColumn: 'span 5'}}>Market Place</div>
                </div>
                <div className="text-xl text-white grid grid-cols-6 items-center gap-4 py-2 cursor-pointer"
                    onClick={() => this.setState({showDashboard: false, showOLinks: true, showMyCart: false, showMenuBar: false, showHomepage:false})}>
                <div className="text-xl flex justify-center">
                    <LuPieChart 
                        style={{gridColumn: 'span 1'}} /></div>
                    Analytics   
                </div>
            </div>
            </>):(<></>)}
            


            <div className="flex flex-col flex-2 overflow-auto max-h-screen flex-nowrap bg-blue-900 bg-gradient-to-br from-indigo-950 via-blue-700 to-blue-500 text-white w-full h-full"
                style={{gridColumn: 'span 11'}}>
                <div className="flex flex-row-reverse items-center justify-between">
                <div className="flex flex-row mr-5 md:mr-10 mt-2 md:mt-3 items-center">   
                { this.state.isLogin ? (<>
                    
                    <img src={this.state.displayImage} className="rounded-full text-4xl object-cover w-12 h-12]"/>
                    <div className="flex flex-col justify-center items-center ml-2 pt-3">
                        <h2 className="text-sm font-bold text-white">{this.state.displayname}</h2>
                        <p className="text-sm text-left text-gray-300">{this.state.displayemail}</p>
                    </div>
                    </>):(<>
                {this.state.showMenuBar ? (<></>):(<>
                <div className="my-4">
                <Login sendData={this.getLoginDetails} />
                </div></>)}</>)}
                
                </div>
                
                
                </div>
                {this.state.showMyCart ? (
                <>
       
                    {/* <MyCart /> */}
                    <div className="min-h-screen">
                    <Pop  text='Branded Links' />
                    </div>
                </>):(<></>)}


                {this.state.showOLinks ? (
                <>
                {/* <Available_links /> */}
                <div className="min-h-screen">
                <Pop text='Analytics' />
                </div>

                </>):(<></>)}

                
                {/* {this.state.showHomepage ? (
                <>
                <div className="min-h-screen">
                
                <HomePage handleChange={this.handleChange} handleSubmit={this.handleSubmit}/> */}
                {/* <Edit />
                <Success />
                <Branded_Selection /> */}
                {/* </div>
                

                </>):(<></>)} */}

                {this.state.showDashboard? (
                <>
                <div className="min-h-screen">
                
                <Dashboard handleChange={this.handleChange} handleSubmit={this.handleSubmit} token={this.state.GoogleAuthToken} newLink={this.state.new_link}/>
                {/* <Edit />
                <Success />
                <Branded_Selection /> */}
                </div>
                

                </>):(<></>)}


                
                
            </div>
            </div>
            {/* -----Modal for Captcha---------- */}
            {modal_captcha}
                      {/* -----Modal for Captcha---END------- */}
                      {modal_generatelink}
      </>
    );
  }
}

export default Dashes;
