import axios from "axios";
import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
// import Slide from "@mui/material/Slide";

function ControlName({ userInfo, setUserInfo, handleSubmit }) {
  const [error, setError] = useState(false);
  const submitForm = (e) => {
    e.preventDefault();
    if (userInfo.name.length === 0) {
      setError(true);
      return;
    }
    handleSubmit();
  };

  const handleChange = (e) => {
    if (error && userInfo.name.length > 0) {
      setError(false);
    }
    setUserInfo({ ...userInfo, name: e.target.value });
  };

  return (
    <div className="SaveUserCredentials_form">
      <form onSubmit={(e) => submitForm(e)}>
        <div>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            value={userInfo.name}
            onChange={(e) => handleChange(e)}
          />
          {error && (
            <span className="error_message">This feild is required.</span>
          )}
        </div>

        <div className="button_container">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

function ControlPhoneNumber({ userInfo, setUserInfo, handleSubmit }) {
  const [error, setError] = useState(false);
  const [isInvalidNumber, setIsInvalidNumber] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    if (userInfo.phoneNo.length === 0) {
      setError(true);
      return;
    }
    if (userInfo.phoneNo.length === 10 || userInfo.phoneNo.length === 12) {
      let isNOFlag = false;
      const phoneNumberArray = userInfo.phoneNo.split("");
      for (let i = 0; i < phoneNumberArray; i++) {
        if (isNaN(parseInt(phoneNumberArray[i]))) {
          console.log("called 1");
          isNOFlag = true;
        }
      }
      if (isNOFlag) {
        setIsInvalidNumber(true);
        return;
      } else {
        console.log("Called");
        handleSubmit();
      }
    } else {
      setIsInvalidNumber(true);
      return;
    }
  };

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, phoneNo: e.target.value });
    if (error && userInfo.phoneNo.length > 0) {
      setError(false);
    }
    if (
      (isInvalidNumber && userInfo.phoneNo.length === 10) ||
      (isInvalidNumber && userInfo.phoneNo.length === 12)
    ) {
      setIsInvalidNumber(false);
    }
  };

  return (
    <div className="SaveUserCredentials_form">
      <form onSubmit={(e) => submitForm(e)}>
        <div>
          <TextField
            id="phoneNo"
            label="Phone No"
            variant="outlined"
            value={userInfo.phoneNo}
            onChange={(e) => handleChange(e)}
          />
          {error && (
            <span className="error_message">This feild is required.</span>
          )}
          {isInvalidNumber && (
            <span className="error_message">Invalid phone number</span>
          )}
        </div>

        <div className="button_container">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function SaveUserCredentials() {
  const containerRef = useRef(null);
  const [userInfo, setUserInfo] = useState({ name: "", phoneNo: "" });
  const [loading, setLoading] = useState(false);
  const [componentToRender, setComponentToRender] = useState("name");

  const handleUserSave = async () => {
    setLoading(true);
    try {
      const { status } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/create`,
        userInfo
      );
      if (status === 200) {
        setComponentToRender("formSubmited");
      }
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSaveName = () => setComponentToRender("phoneNo");

  return (
    <div ref={containerRef}>
      <Typography variant="h2">Deetox</Typography>
      {componentToRender === "name" && (
        <ControlName
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          handleSubmit={handleSaveName}
        />
      )}
      {/* {componentToRender === "phoneNo" && (
        <Slide
          direction="up"
          in={componentToRender === "phoneNo" ? true : false}
          container={containerRef.current}
        >
          <ControlPhoneNumber
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleSubmit={handleUserSave}
          />
        </Slide>
      )} */}
      {componentToRender === "phoneNo" && (
        <ControlPhoneNumber
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          handleSubmit={handleUserSave}
        />
      )}
      {componentToRender === "formSubmited" && (
        <div>
          <Typography variant="h5">Congratulations!</Typography>
          <Typography variant="body2">
            Your Deetox journey has
            <br /> been started.
          </Typography>
        </div>
      )}
      {loading && (
        <Typography variant="body2">Starting your Deetox journey...</Typography>
      )}
    </div>
  );
}
