import { Component } from "react";
import React from "react";
import classes from "../components/Styles.module.css";
import { getURLandredirect } from "../helper/api";
import "../css/splash.css";
import html2canvas from "html2canvas";

import DiwaliCard1 from "../assets/diwali_card.jpg";
import DiwaliCard2 from "../assets/diwali_card_2.jpg";
import DiwaliCard3 from "../assets/diwali_card_3.jpg";
import DiwaliCard4 from "../assets/diwali_card_4.jpg";

const imagesList = [
  { id: 1, imgUrl: DiwaliCard1 },
  { id: 2, imgUrl: DiwaliCard2 },
  { id: 3, imgUrl: DiwaliCard3 },
  // { id: 4, imgUrl: DiwaliCard4 },
];

class Diwali extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intentvalue: "",
      original_url: "",
      ostype: "",
      cardName: "",
      nameOncard: "Ram Krishna murti",
      selectedImg: imagesList[0],
    };
    this.handleCardCreation = this.handleCardCreation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCardDownload = this.handleCardDownload.bind(this);
    this.handleCardShare = this.handleCardShare.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    // this.userImage = this.userImage.bind(this);

    this.startX = null;
    this.currentX = null;
    this.activeSwipe = null;
  }

  componentDidMount() {
    let apptag = this.props.match.params.apptype;
    let shortstring = this.props.match.params.shorturl;
    getURLandredirect(apptag, shortstring).then((res) => {
      this.setState({ intentvalue: res.data.app_intend });
      this.setState({ original_url: res.data.originalURL });
      this.setState({ ostype: res.data.os_type });
      let app_intend = this.state.intentvalue;
      let originalURL = this.state.original_url;

      const click_link = document.getElementById("abcd");

      if (app_intend === "Desktop" || app_intend === "Mobile") {
        app_intend = originalURL;
      }

      if (this.state.ostype == "windows") {
        click_link.setAttribute("href", app_intend);
        click_link.click();
      } else {
        click_link.setAttribute("href", app_intend);
        window.location.assign(app_intend);
      }
    });
  }

  handleChange(e) {
    this.setState({ cardName: e.target.value });
  }

  handleCardCreation(e) {
    e.preventDefault();
    if (this.state.cardName.length) {
      this.setState({ nameOncard: this.state.cardName });
      this.setState({ cardName: "" });
    }
  }

  handlePrev() {
    if (this.state.selectedImg.id === 1) {
      this.setState({ selectedImg: imagesList[imagesList.length - 1] });
    } else {
      this.setState({ selectedImg: imagesList[this.state.selectedImg.id - 2] });
    }
  }

  handleNext() {
    if (this.state.selectedImg.id === imagesList.length) {
      this.setState({ selectedImg: imagesList[0] });
    } else {
      this.setState({ selectedImg: imagesList[this.state.selectedImg.id] });
    }
  }

  handleTouchStart = (e) => {
    this.startX = e.touches[0].clientX;
    this.activeSwipe = null;
  };

  handleTouchMove = (e) => {
    if (!this.startX) {
      return;
    }

    this.currentX = e.touches[0].clientX;
    const deltaX = this.currentX - this.startX;

    if (deltaX > 50) {
      this.activeSwipe = "right";
    } else if (deltaX < -50) {
      this.activeSwipe = "left";
    }
  };

  handleTouchEnd = () => {
    if (this.activeSwipe === "right") {
      this.handlePrev();
    } else if (this.activeSwipe === "left") {
      this.handleNext();
    }

    this.startX = null;
    this.currentX = null;
    this.activeSwipe = null;
  };

  async handleCardShare() {
    if (navigator.canShare) {
      await navigator.share({
        title: "Appopener",
        text: "Happy Diwali !",
        url: `${window.location.origin}/diwali/${this.state.selectedImg.id}/${this.state.nameOncard}`,
      });
    } else {
      alert("Web Share supported on this browser.");
      console.log("Web Share supported on this browser.");
    }
  }

  async handleCardDownload() {
    const element = document.getElementById("diwaliCard");
    const canvas = await html2canvas(element);
    const compressedCanvas = document.createElement("canvas");
    compressedCanvas.width = canvas.width;
    compressedCanvas.height = canvas.height;
    const ctx = compressedCanvas.getContext("2d");
    ctx.drawImage(canvas, 0, 0);
    const imgData = compressedCanvas.toDataURL("image/jpeg", 1);
    const downloadLink = document.createElement("a");
    downloadLink.href = imgData;
    downloadLink.download = `${this.state.nameOncard}.png`;
    downloadLink.click();
  }

  render() {
    return (
      <div
        className={classes.diwali_page}
        style={{ paddingBottom: "3rem" }}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        <div className={classes.redirect_box}>
          <p>If redirect dont't occur</p>
          <a id="abcd" target="_blank" style={{ cursor: "pointer" }}>
            Click here
          </a>
        </div>

        <div className={classes.card_form_container}>
          <div className={classes.card_form}>
            <h3>Generate Diwali Card</h3>
            <form onSubmit={this.handleCardCreation}>
              <input
                type="text"
                placeholder="Enter your name"
                value={this.state.cardName}
                onChange={this.handleChange}
              />
              <div className={classes.button_container}>
                <button>Generate</button>
              </div>
            </form>
          </div>
        </div>

        {this.state.nameOncard.length ? (
          <>
            <div className={classes.card_main}>
              <button
                className={classes.changeImageButton}
                onClick={this.handlePrev}
              >
                &#8249;
              </button>
              <div className={classes.diwali_card}>
                <div id="diwaliCard" className={classes.card_container}>
                  <img src={this.state.selectedImg.imgUrl} alt="" />
                  <div className={classes.card_content}>
                    <p className={classes.nameOnCard}>
                      {this.state.nameOncard}
                    </p>
                    <p className={classes.wishes}>Wishes you</p>
                    <p className={classes.happy}>HAPPY</p>
                    <p className={classes.diwali}>Diwali</p>
                    <p className={classes.message}>
                      With the shining of diyas and the echoes of the chants,
                      may prosperity and happiness of the festival of lights
                      fill our lives.
                    </p>
                  </div>
                </div>
              </div>
              <button
                className={classes.changeImageButton}
                onClick={this.handleNext}
              >
                &#8250;
              </button>
            </div>
            <div
              className={classes.button_container}
              style={{ marginTop: "10px" }}
            >
              <button onClick={this.handleCardShare}>Share</button>
              <button onClick={this.handleCardDownload}>Download</button>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

export default Diwali;
