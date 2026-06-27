import React, { Component } from "react";
import HeroSection from "../components/HeroSection";
import PageContent from "../components/PageContent";
import Footer from "../components/Footer";
// import Float from '../components/side_button';
import Floattwo from '../components/side_button2';
import BottomNav from "../components/bottom";
import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";
import GlobeEntry from "../components/jupiter";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
      <GlobeEntry />
      {/* <G13Ads /> */}
      {/* <AdsterraAd/> */}
        <HeroSection />
        {/* <Float/> */}
        {/* <Floattwo /> */}
        {/* <BottomNav /> */}
      </>
    );
  }
}

export default Home;
