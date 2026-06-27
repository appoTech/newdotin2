import React, { Component } from "react";

class Ads extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
  render() {
    return (
      <>
        <div>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-5645705217995911"
            data-ad-slot="9492391764"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </>
    );
  }
}

export default Ads;
