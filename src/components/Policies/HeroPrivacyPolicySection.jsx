import React, { useState } from "react";
import classes from "../Styles.module.css";
import {
  Row,
  Col,
  Navbar,
  Container,
} from "react-bootstrap";

import "../../css/profile.css";

import helmetLogo from "../../assets/helmet.avif";
import Logo from "../../assets/logo.avif";

const HeroPrivacyPolicySection = () => {
  const [click, setClick] = useState();
  return (
    <>
      <div className={classes.heroBanner} style={{ minHeight: "110vh" }}>
        <div className={classes.overflowHidden}>
          <div className={classes.topHeader}>
            <div className="header">
              <Navbar
                expand="lg"
                //   className={this.state.click ? classes.active : "navbar-dark"}

                className={"navbar-dark"}
              >
                <Container>
                  <div className="d-flex justify-content-start">
                    <Navbar.Brand href="/" className="navbar-logo">
                      <img className={classes.logo} src={Logo} alt="Logo" />
                    </Navbar.Brand>

                    <a
                      className="navbar-brand d-none d-lg-block"
                      href="/"
                      style={{
                        "font-family": "Roboto",
                        "font-weight": "900",
                        marginTop: "10px",
                        "font-size": "20px",
                      }}
                    >
                      APPOPENER
                    </a>
                  </div>
                </Container>
              </Navbar>
            </div>
          </div>
          <div>
            <div className={classes.stars}></div>
            <div className={classes.stars2}></div>
            <div className={classes.stars3}></div>
          </div>

          <div className={classes.innerContent}>
            <Container>
              <Row>
                <Col
                  xs={12}
                  md={12}
                  lg={6}
                  style={{ alignSelf: "center", alignItems: "center" }}
                >
                  <h1 className={classes.title}>
                    {" "}
                    APPOPENER's <br />
                    Privacy <br />
                    Policy{" "}
                  </h1>
                  <br />
                  <p className={classes.subTitle}>
                    Know the manner of information we collect
                  </p>
                </Col>
                <Col xs={12} md={12} lg={6} className="d-none d-lg-block">
                  <img
                    className={classes.helmetanimate}
                    style={{
                      width: "350px",
                      right: "-24%",
                      bottom: "-12%",
                      position: "relative",
                    }}
                    src={helmetLogo}
                    alt="company Logo"
                  />
                </Col>
              </Row>
            </Container>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1680 40"
            className="position-absolute width-full z-1"
          >
            <path d="M0 40h1680V30S1340 0 840 0 0 30 0 30z" fill="#000"></path>
          </svg>
        </div>
      </div>
      <div></div>
      {/* --------Calling Login component just to get state value google obj.profile----------- */}
      <div style={{ display: "none" }}></div>
    </>
  );
};

export default HeroPrivacyPolicySection;
