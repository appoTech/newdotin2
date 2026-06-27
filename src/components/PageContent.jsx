import React from "react";
import classes from "./Styles.module.css";
import { Link } from "react-router-dom";
import { Row, Col, Button, Container, Card } from "react-bootstrap";
import LanguageCard from "./LanguageCard";
import MultiImgSlider from "./MultiImgSlider";
import Marquee from "react-fast-marquee";
import {
  FaAmazonPay,
  FaDollarSign,
  FaMailBulk,
  FaWhatsapp,
} from "react-icons/fa";

import SmartLinkLogo from "../assets/icons/Smart-link.avif";
import ProfileLogo from "../assets/icons/Profile.avif";
import ChoiceLogo from "../assets/icons/Choice.avif";
import SecureLogo from "../assets/icons/Secure.avif";
import qrCodeLogo from "../assets/icons/qr-code.avif";
import RocketLogo from "../assets/services/Rocket.avif";
import MoneyLogo from "../assets/services/money.avif";
import DealLogo from "../assets/services/Deal.avif";
import ServiceLogo from "../assets/services/service.avif";
import AnalyticsLogo from "../assets/services/Analytics.avif";
import MerchandiseLogo from "../assets/services/Merchandise.avif";
import CommunityLogo from "../assets/services/Community.avif";
import PatternLogo from "../assets/pattern.png";

const PageContent = () => {
  return (
    <>
      {/* Grid Column*/}
      <div className={classes.overflowHidden}>
        <div className={classes.gridContainer}>
          <Container>
            <Row>
              <Col>
                <div
                  className={classes.sectionHeader + " " + classes.darkColor}
                >
                  <h2>It's time! We evolve</h2>
                  <p>
                    Boost your reach and revenue through various other ways that
                    convert!
                  </p>{" "}
                </div>
              </Col>
            </Row>

            <div className={classes.cardInner}>
              <Card className={classes.cards}>
                <Card.Body>
                  <div className={classes.cardIcon}>
                    <img src={SmartLinkLogo} alt="Logo" />
                  </div>
                  <Card.Title className={classes.head}>Smart Links</Card.Title>
                  <Card.Text>
                    Improve your user's experience and engagement by links that
                    open directly in app.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card className={classes.cards}>
                <Card.Body>
                  <div className={classes.cardIcon}>
                    <img src={ProfileLogo} alt="Logo" />
                  </div>
                  <Card.Title className={classes.head}>
                    Branded Link{" "}
                  </Card.Title>
                  <Card.Text>
                    Customized web page linked subdomains to give your brand an
                    edge over others. Bonus - Can take your PR to the next{" "}
                    <i>meta</i> level.
                  </Card.Text>
                </Card.Body>
              </Card>{" "}
              <Card className={classes.cards}>
                <Card.Body>
                  <div className={classes.cardIcon}>
                    <img src={ChoiceLogo} alt="Logo" />
                  </div>
                  <Card.Title className={classes.head}>Deet Links </Card.Title>
                  <Card.Text>
                    Imagine having your own web space to showcase your online
                    presence without the hustle of web development.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card className={classes.cards}>
                <Card.Body>
                  <div className={classes.cardIcon}>
                    <img src={SecureLogo} alt="Logo" />
                  </div>
                  <Card.Title className={classes.head}>
                    Choice Links{" "}
                  </Card.Title>
                  <Card.Text>
                    Every user has a different choice and not respecting it is a
                    crime. Give them the luxury to <i>choose</i>.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card className={classes.cards}>
                <Card.Body>
                  <div className={classes.cardIcon}>
                    <img src={qrCodeLogo} alt="Logo" />
                  </div>
                  <Card.Title className={classes.head}>Form Links</Card.Title>
                  <Card.Text>
                    One Link, Multiple Destinations. Based on user's inputs,
                    he/she will be taken to the webpage best suited for him/her.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card className={classes.cards}>
                <Card.Body>
                  <div className={classes.cardIcon}>
                    <img src={qrCodeLogo} alt="Logo" />
                  </div>
                  <Card.Title className={classes.head}>
                    Other services
                  </Card.Title>
                  <Card.Text>
                    Pay to Proceed Link, Password Protected Link, QR codes and
                    much more...
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Container>
        </div>
      </div>
      {/* Developer Section*/}
      {/* <div className={classes.developerContainer}>
        <Container>
          <Row>
            <Col>
              <div className={classes.sectionHeader}>
                <h2 className="mt-4 mb-4" >Dive in deeper...</h2>
              </div>
            </Col>
          </Row>

          <div className={classes.intigratePassword}>
            <Card className={classes.cardBox}>
              <Card.Body>
                <Row>
                  <Col md={5} sm={6} xs={12}>
                    <Card.Title className={classes.head}>
                      <h4> OPNR Blog</h4>
                    </Card.Title>
                    <Card.Text>
                      <p>
                      Subscribe to our weekly newsletter to recieve updates on trends, tutorials, tips and tricks.
                      </p>
                      <a href="http://creators.college/" target="_blank" style={{color:"white",textDecoration:"none"}} className={classes.btnStyleOne}>Learn more</a>
                    </Card.Text>
                  </Col>
                  <Col md={7} sm={6} xs={12}>
                    <div className={classes.imgCardStyle1}>
                      <img
                        src={require("../assets/docs.png").default}
                        alt="Logo"
                      />
                    </div>
                  </Col>
                </Row> */}
      {/* </Card.Body>
            </Card>
           
          </div>
        </Container>
      </div> */}
      {/* Programming Slanguages section */}
      {/* <div className="d-none d-lg-block">
     <LanguageCard />
     </div> */}

      {/* <div className={classes.securityContainer}>
        <Container>
          <Row>
            <Col md={6} sm={6} xs={12}>
              <div className={classes.sectionHeader}> */}

      {/* <h2 className="mb-3">Join our Fleet   
                  <a href="https://pages.razorpay.com/appopener" target="_blank" className="btn btn-warning btn-lg" style={{marginTop:"0px",marginLeft:"60px",marginBottom:"10px", "box-shadow":"0 0 0 1px #f0ad4e inset, 0 0 0 2px rgba(255,255,255,0.15) inset, 0 8px 0 0 #eea236, 0 8px 0 1px rgba(0,0,0,0.4), 0 8px 8px 1px rgba(0,0,0,0.5)"}}> <FaDollarSign/> Invest in us </a>
                </h2>
                
                <p style={{fontSize: "18.5px"}}>
                  Fund and join this project as an exclusive member to fuel this rocket
                </p> */}

      {/* </div>
            </Col>
            
          </Row>
          <div className={classes.securityGrid}> */}
      {/* <Card className={classes.securityCards}>
              <Card.Body className={classes.securityCardsinner}>
                <div className={classes.cardIcon}>
                  <img
                    src={require("../assets/icons/globalIcon01.svg").default}
                    alt="Logo"
                  />
                </div>
                <Card.Title className={classes.head}>
                  <h4 style={{color:'#fff'}}>Transparent</h4>
                </Card.Title>
                <Card.Text>
                  <p>
                  Believe the intention, not the road. Invest your time, not just fork. Please feel free to pitch in your ideas and collab with us.
                  
                  </p>
                </Card.Text>
              </Card.Body>
            </Card> */}
      {/* <Card className={classes.securityCards}>
              <Card.Body className={classes.securityCardsinner}>
                <div className={classes.cardIcon}>
                  <img
                    src={require("../assets/icons/globalIcon02.svg").default}
                    alt="Logo"
                  />
                </div>
                <Card.Title className={classes.head}>
                  <h4 style={{color:'#fff'}}>Ethics </h4>
                </Card.Title>
                <Card.Text>
                  <p>
                  Without greed and corruption, we can help the start of a new online economy called 'creator economy' where you can even monetise your online presence.
                  </p>
                </Card.Text>
              </Card.Body>
            </Card> */}
      {/* <Card className={classes.securityCards}>
              <Card.Body className={classes.securityCardsinner}>
                <div className={classes.cardIcon}>
                  <img
                    src={require("../assets/icons/globalIcon03.svg").default}
                    alt="Logo"
                  />
                </div>
                <Card.Title className={classes.head}>
                  <h4 style={{color:'#fff'}}>Intentions</h4>
                </Card.Title>
                <Card.Text>
                  <p>
                  Choosing creativity is not an easy road to walk upon. We intend to support the creators as we strongly believe that evolution is directly linked to Creation.
                  </p>
                </Card.Text>
              </Card.Body>
            </Card> */}
      {/* <Card className={classes.securityCards}>
              <Card.Body className={classes.securityCardsinner}>
                <div className={classes.cardIcon}>
                  <img
                    src={require("../assets/icons/globalIcon04.svg").default}
                    alt="Logo"
                  />
                </div>
                <Card.Title className={classes.head}>
                  <h4 style={{color:'#fff'}}>Gratitude</h4>
                </Card.Title>
                <Card.Text>
                  <p>
                  We are very thankful for our early supporters who helped us reach here. As a token of thanks, we would like to offer them double their invested amount if they choose to exit our membership program. 
                  Please contact at <a href="mailto:support@appopener.com" target="_top">
                  support@opnr.app</a>
                  </p>
                </Card.Text>
              </Card.Body>
            </Card> */}
      {/* </div>
        </Container>
      </div> 
    */}
      {/* Onboarding section */}
      {/* <GoogleAd slot="9492391764" googleAdId="ca-pub-5645705217995911" /> */}
      <div className={classes.OnboardingContainer}>
        <Container>
          <div className={[classes.features, "mt-5"].join(" ")}>
            <div className={[classes.featuresContent, "mb-3"].join(" ")}>
              <Col md={6} sm={6} xs={12}>
                <div className={classes.securityImg}>
                  <img
                    className="d-none d-lg-block"
                    style={{ marginLeft: "800px", width: "300px" }}
                    src={RocketLogo}
                    alt="Security"
                  />
                </div>
              </Col>
              <Row>
                <Col>
                  <div className={classes.sectionHeader}>
                    <h2>
                      {" "}
                      Monetize <br /> your Online Presence
                    </h2>
                  </div>
                </Col>
              </Row>

              <div className={classes.featuresGrid}>
                <Card className={classes.boardingCards}>
                  <Card.Body className={classes.boardingCardsinner}>
                    <div className={classes.cardIcon}>
                      <img src={MoneyLogo} alt="Logo" />
                    </div>
                    <Card.Title className={classes.head}>
                      <h4>Sales</h4>
                    </Card.Title>
                    <Card.Text>
                      <p>
                        {" "}
                        Partner with brands you love and generate revenue through 
                        {" "}affiliate sales of your favourite products and services.{" "}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card className={classes.boardingCards}>
                  <Card.Body className={classes.boardingCardsinner}>
                    <div className={classes.cardIcon}>
                      <img src={AnalyticsLogo} alt="Icon" />
                    </div>
                    <Card.Title className={classes.head}>
                      <h4>Analytics</h4>
                    </Card.Title>
                    <Card.Text>
                      <p>
                        {" "}
                        Our analytics tool empowers you to make informed decisions {" "}
                        and enhance your online performance.{" "}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card className={classes.boardingCards}>
                  <Card.Body className={classes.boardingCardsinner}>
                    <div className={classes.cardIcon}>
                      <img src={ServiceLogo} alt="Logo" />
                    </div>
                    <Card.Title className={classes.head}>
                      <h4>Services</h4>
                    </Card.Title>
                    <Card.Text>
                      <p>
                        {" "}
                        Share your expertise and help others through online consultations.{" "}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card className={classes.boardingCards}>
                  <Card.Body className={classes.boardingCardsinner}>
                    <div className={classes.cardIcon}>
                      <img src={DealLogo} alt="Logo" />
                    </div>
                    <Card.Title className={classes.head}>
                      <h4>Promotional Deals</h4>
                    </Card.Title>
                    <Card.Text>
                      <p>
                      Tackle distribution challenges for businesses by connecting audiences {" "}
                      with exceptional deals and promoting them through our platform.{" "}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card className={classes.boardingCards}>
                  <Card.Body className={classes.boardingCardsinner}>
                    <div className={classes.cardIcon}>
                      <img src={MerchandiseLogo} alt="Logo" />
                    </div>
                    <Card.Title className={classes.head}>
                      <h4>Merchandises</h4>
                    </Card.Title>
                    <Card.Text>
                      <p>
                        {" "}
                        Showcase your products and creations with a personalized brand touch. {" "}
                        Reach a wider audience through our merchandising platform.{" "}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card className={classes.boardingCards}>
                  <Card.Body className={classes.boardingCardsinner}>
                    <div className={classes.cardIcon}>
                      <img src={CommunityLogo} alt="Icon" />
                    </div>
                    <Card.Title className={classes.head}>
                      <h4>Community</h4>
                    </Card.Title>
                    <Card.Text>
                      <p>
                        {" "}
                        Expand your network, share insights, collaborate, grow, and discover new opportunities for online success.{" "}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* Prrof Security Section*/}

      {/* Autoscroll slider */}
      {/* <Marquee pauseOnHover={true} speed={50} loop={0}>
      <MultiImgSlider />
      </Marquee> */}

      {/* Stories section */}
      {/* <GoogleAd slot="9492391764" googleAdId="ca-pub-5645705217995911" /> */}
      <div className={classes.demoContainer}>
        <Row className="justify-content-center">
          <Col>
            <div className={classes.sectionHeader}>
              <div className={classes.gradientText}>
                <p> For Marketing &</p>
                <p> Business queries </p>
              </div>
              <div className={classes.btnGrps}>
                <a
                  href="mailto:contactus@appopener.com"
                  target="_blank"
                  className="btn btn-outline-primary"
                  style={{ width: "300px", borderRadius: "15px" }}
                >
                  <FaMailBulk /> Get in Touch
                </a>
              </div>
            </div>

            <div className={classes.patternImg} style={{ background: "black" }}>
              {/* <marquee behavior="scroll" direction="up" scrollamount="1"> */}
              <img src={PatternLogo} alt="pattern" />

              {/* </marquee> */}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PageContent;
