import React, { Component } from "react";
import HeroSection from "../components/HeroSection";
import PageContent from "../components/PageContent";
import Footer from "../components/Footer";
import Float from "../components/floatingButton";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="bg-black text-white min-h-screen">
        <HeroSection />
        <Float />
        <PageContent />
        <Footer />
      </div>
    );
  }
}

export default Home;
