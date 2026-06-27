import React, { Component, props } from "react";
import { GoogleLogin } from "react-google-login";
import { refreshTokensetup } from "../helper/refreshToken";
import { Redirect, browserHistory } from "react-router-dom";

const clientID =
  "69320367329-6k1p17bfh8looe2j57nqt2ftuq5fel6p.apps.googleusercontent.com";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { userExist: false };
  }
  onSuccess = (res) => {
    //console.log(res);
    //console.log("[LoginSuccess] currenUser:", res.profileObj);
    this.props.sendData(res); //from header component
    //save token to local storage 
    localStorage.setItem("aop_token",res.tokenId);
    localStorage.setItem("aop_email",res.profileObj.email);
    localStorage.setItem("profile_url",res.profileObj.imageUrl);

    refreshTokensetup(res);
  };

  onFailure = (res) => {
    //console.log("[LoginFailed]:", res);
  };

  render() {
    return (
      <div style={{ marginRight: "90px",display: "block", overflow: "hidden" }}>
        <GoogleLogin
          clientId={clientID}
          buttonText="Login with Google"
          onSuccess={this.onSuccess}
          onFailure={this.onFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
          redirectUri="http://localhost:3000/user"
        />
      </div>  

    );
  }
}

export default Login;
