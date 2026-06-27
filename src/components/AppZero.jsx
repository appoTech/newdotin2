import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import appOpnr from "../assets/AppOpener.png";
import classes from "../components/Styles.module.css";
import Modal from 'react-awesome-modal';
import { FaCircleNotch, FaCopy, FaTimesCircle, FaLink } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha
} from 'react-simple-captcha';
import {
  generateOpenShortLink,
  generateUserLink,
  checkIfUserExist
} from '../helper/api'; // Update the path as needed
import Login from "../components/login";// Update the path as needed

const appZero = ({ isLogin, GoogleAuthToken, userURL, appname, onSuccess }) => {
  const [visibleCaptcha, setVisibleCaptcha] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [userInputURL, setUserInputURL] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openCaptchaModal = async (event) => {
    setVisibleCaptcha(true);
    setErrortext('');
    setLoadingIcon(false);
    if (!isLogin) {
      loadCaptchaEnginge(4, 'black', 'white');
    }
    event.preventDefault();
  };

  const closeCaptchaModal = () => setVisibleCaptcha(false);

  const submitForm = () => {
    setErrortext('');
    setLoadingIcon(false);
    if (userInputURL.trim() === '') {
      setErrortext('Please enter a correct link');
      return;
    }
    const userCaptcha = isLogin ? 'LoggedIn' : document.getElementById('user_captcha_input').value;

    if (userCaptcha.trim() === '') {
      setErrortext('Please enter captcha value');
      return;
    }

    if (isLogin || validateCaptcha(userCaptcha)) {
      setLoadingIcon(true);
      handleGenerateModal(userInputURL);
    } else {
      setErrortext('Captcha not matched, please try again');
      document.getElementById('user_captcha_input').value = '';
    }
  };

  const handleGenerateModal = async (userURL) => {
    setLoadingIcon(true);
    let appopenerAppUrl = process.env.REACT_APP_SMART_LINK_PREFIX;

    if (isLogin) {
      await checkIfUserExist(userURL, GoogleAuthToken);
      const response = await generateUserLink(appname, userURL, GoogleAuthToken);
      const tag = mapTag(response.data.tag);
      setGeneratedLink(`${appopenerAppUrl}${tag}/${response.data.shortid}`);
    } else {
      const response = await generateOpenShortLink(appname, userURL);
      const tag = mapTag(response.data.tag);
      setGeneratedLink(`${appopenerAppUrl}${tag}/${response.data.shortid}`);
    }

    setLoadingIcon(false);
    setGenerateModalVisible(true);
  };

  const mapTag = (tag) => {
    const tagMap = {
      youtube: 'yt',
      instagram: 'ig',
      spotify: 'sp',
      telegram: 'tg',
      twitter: 'tw',
      linkedin: 'lk',
      playstore: 'ps'
    };
    return tagMap[tag.toLowerCase()];
  };

  const closeGenerateModal = () => {
    setGenerateModalVisible(false);
    closeCaptchaModal();
  };

  const getLoginDetails = (response) => {
    console.log('Login Successful:', response);
    // Handle login details here
    setIsLoggedIn(true);
    // You can set user data, authentication tokens, etc.
  };

  return (
    <>
      <Button
        
        className=" fixed bottom-[86.5px] w-[70%] justify-center z-30  text-white font-semibold text-lg rounded-lg h-12 md:w-[60%] lg:w-[60%] "
        variant="primary"
        type="button"
        onClick={openCaptchaModal}
       style={{  /* position: "fixed",
            bottom: "86.5px",
            width: "70%",
            left: "2.5%",
            zIndex: "3",  */ 
            backgroundColor: "#34b759" ,
            borderColor: "#198754",
            borderRadius: "0.8rem",
           /*  borderColor: "blue", */

            
            
        }} 
      >
         <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <img src={appOpnr} alt="App Logo" style={{ width: '22px', height: '22px', marginRight: '0px' }} />ppOpener
                
              </span>
      </Button>
      

      <Modal
        style={{ position: 'absolute' }}
        visible={visibleCaptcha}
        width="500"
        height="300"
        effect="fadeInDown"
        onClickAway={closeCaptchaModal}
      >
        <div className="modal-content" style={{ border: '0' }}>
          <div className="modal-header text-center">
            <h5 className="modal-title">Generate Smart Links</h5>
            <a href="javascript:void(0);" onClick={closeCaptchaModal}>
              <FaTimesCircle size="25px" />
            </a>
          </div>
          <div className="modal-body">
            {isLogin ? (
              <>
                <center>
                  <div>
                    <input
                      placeholder="Enter Link to Smartify"
                      value={userInputURL}
                      onChange={(e) => setUserInputURL(e.target.value)}
                      className="form-control"
                      type="text"
                    />
                    <p className="text-danger">{errortext}</p>
                    <button className="btn btn-primary" type="button" onClick={submitForm}>
                      Submit
                      {loadingIcon && <FaCircleNotch className="spinner" />}
                    </button>
                  </div>
                  <br />
                </center>
              </>
            ) : (
              <>
                <center>
                  <Login sendData={getLoginDetails} />
                </center>
                <center>
                  <h3>OR</h3>
                </center>
                <center>
                  <div>
                    <input
                      placeholder="Enter Link to Smartify"
                      value={userInputURL}
                      onChange={(e) => setUserInputURL(e.target.value)}
                      className="form-control"
                      type="text"
                    />
                    <LoadCanvasTemplate reloadText="Reload Captcha" reloadColor="green" />
                    <input
                      placeholder="Enter Captcha Value"
                      id="user_captcha_input"
                      className="form-control"
                      type="text"
                    />
                    <p className="text-danger">{errortext}</p>
                    <button className="btn btn-primary" type="button" onClick={submitForm}>
                      Submit
                      {loadingIcon && <FaCircleNotch className="spinner" />}
                    </button>
                  </div>
                  <br />
                </center>
              </>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        style={{ position: 'absolute' }}
        visible={generateModalVisible}
        width="90%"
        height="50%"
        effect="fadeInDown"
        onClickAway={closeGenerateModal}
      >
        <div className="modal-content" style={{ border: '0' }}>
          <div className="modal-header text-center">
            <h5 className="modal-title">Smarten your Links</h5>
            <a href="javascript:void(0);" onClick={closeGenerateModal}>
              <FaTimesCircle size="25px" />
            </a>
          </div>
          <div className="modal-body">
            <div className="input-group mt-3">
              <button className="btn btn-secondary" disabled type="button" style={{ padding: '10px' }}>
                <FaLink size="20px" />
              </button>
              <input
                type="text"
                className="form-control"
                style={{ padding: '10px' }}
                value={generatedLink}
                disabled
              />
              <div className="input-group-append">
                {loadingIcon ? (
                  <button className="btn btn-primary" type="button" style={{ padding: '11px' }}>
                    <FaCircleNotch className="spinner" /> Please wait
                  </button>
                ) : (
                  <CopyToClipboard text={generatedLink} onCopy={() => setCopied(true)}>
                    <button className="btn btn-primary" type="button" style={{ padding: '11px' }}>
                      <FaCopy size="20px" />
                      {copied ? ' Copied' : ' Copy'}
                    </button>
                  </CopyToClipboard>
                )}
              </div>
            </div>
            <p className="text-center mt-3">
              {generatedLink && !loadingIcon && <a href={generatedLink} target="_blank" rel="noopener noreferrer">Click to open generated smart link</a>}
            </p>
            <hr />
          </div>
          <div className="modal-footer" style={{ display: 'block', borderTop: '0' }}>
            {/* Replace with your ShareButton and ShareButtons components */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default appZero;
