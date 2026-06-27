import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import appOpnr from "../assets/AppOpener.png";
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

const GenerateSmartLinkButton = ({ isLogin, GoogleAuthToken, userURL, appname, onSuccess, onSetShowGenerateLink }) => {
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
    if (event) event.preventDefault();
  };

  const closeCaptchaModal = () => {
    onSetShowGenerateLink?.(false);
    setVisibleCaptcha(false);
  }

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
    let appopenerAppUrl = "https://appopener.net/";

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
    return tagMap[tag.toLowerCase()] || 'web';
  };

  const closeGenerateModal = () => {
    onSetShowGenerateLink?.(false);
    setGenerateModalVisible(false);
    closeCaptchaModal();
  };

  const getLoginDetails = (response) => {
    console.log('Login Successful:', response);
    setIsLoggedIn(true);
  };

  // Trigger the modal on load or any other event
  React.useEffect(() => {
    openCaptchaModal();
  }, []); // Adjust the dependency array if needed

  return (
    <>
<Modal
  visible={visibleCaptcha}
  effect="fadeInDown"
  onClickAway={closeCaptchaModal}
  width="400"
  height="auto"
>
  <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">

    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <h5 className="text-base sm:text-lg md:text-xl font-semibold text-black">
        Generate Smart Links
      </h5>

      <button onClick={closeCaptchaModal}>
        <FaTimesCircle size={22} className="text-gray-600 hover:text-black" />
      </button>
    </div>

    {/* Body */}
    <div className="px-2 py-2 sm:px-4 sm:py-4 flex flex-col gap-2">

      {/* URL Input */}
      <input
        placeholder="Enter Link to Smartify"
        value={userInputURL}
        onChange={(e) => setUserInputURL(e.target.value)}
        className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
      />

      {/* CAPTCHA (only when not logged in) */}
      {!isLogin && (
        <>
          <div className="flex justify-center">
            <LoadCanvasTemplate
              reloadText="Reload Captcha"
              reloadColor="green"
            />
          </div>

          <input
            placeholder="Enter Captcha Value"
            id="user_captcha_input"
            className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
          />
        </>
      )}

      {/* Error */}
      {errortext && (
        <p className="text-red-500 text-sm text-center">{errortext}</p>
      )}

      {/* Submit Button */}
      <button
        className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-blue-700 transition flex items-center justify-center gap-2"
        type="button"
        onClick={submitForm}
      >
        Submit
        {loadingIcon && <FaCircleNotch className="animate-spin" />}
      </button>
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
                      {copied ? ' Copied' : ' Copy' }
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
        </div>
      </Modal>
    </>
  );
};

export default GenerateSmartLinkButton;