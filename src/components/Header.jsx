import React, { useState, Component } from "react";
import classes from "./Styles.module.css";
import Login from "../components/login";
import Logout from "../components/logout";

import {
  Row,
  Col,
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

import Logo from "../assets/newlogo.png";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { click: false };
    this.state = { userLogin: false, userID: "" };
    this.getData = this.getData.bind(this);
    // const [click, setClick]=useState(false);
    //this.getData = this.getData.bind(this);
    // const handleCLick =() => {

    // };
    //   const getData=(val)=>{
    //     // do not forget to bind getData in constructor
    //     console.log(val);
    // };
  }

  handleCLick() {}

  getData(val) {
    // do not forget to bind getData in constructor
    //console.log("hello - ",val);
    //console.log("userID header - ",val.googleId);

    if (val.googleId) {
      this.setState({
        userLogin: true,
        userID: val.googleId,
      });
    } else {
      this.setState({ userLogin: false, userID: "" });
    }
  }
  render() {
    return (
      <>
        <div className="header">
          <Navbar
            collapseOnSelect
            expand="lg"
            className={this.state.click ? classes.active : "navbar-dark"}
          >
            <Container>
              <Navbar.Brand href="/home" className="navbar-logo">
                <img className={classes.logo} src= {Logo} alt="Logo" />
              </Navbar.Brand> 

               {/* <a
                className="navbar-brand"
                href="/"
                style={{
                  "font-family": "Roboto",
                  "font-weight": "900",
                  fontStyle: "italic",
                  "font-size": "20px",
                }}
              >
                 APPOPNER */}
            

              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                onClick={this.handleCLick}
              />

              {/* <div className="navbar-toggler">{click ? <FaTimes/> : <FaBars />}</div> */}

              {/* <Nav className="me-auto">
                <NavDropdown
                  title="Why Appopener"
                  id="collasible-nav-dropdown"
                  className={classes.navDrp}
                >
                  <NavDropdown.Item href="#" className={classes.navSubmenu}>
                    Features
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#" className={classes.navSubmenu}>
                    Mobile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#" className={classes.navSubmenu}>
                    Actions
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#" className={classes.navSubmenu}>
                    Customers Stories
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link className={classes.navLink} href="#">
                  Team
                </Nav.Link>
                <Nav.Link className={classes.navLink} href="#">
                  EnterPrise
                </Nav.Link>
               
                <Nav.Link className={classes.navLink} href="#">
                  Marketplace
                </Nav.Link>
              
              </Nav> */}
              <Nav className={classes.navRight}>
                <Form style={{ width: "100%" }}>
                  <Row>
                    <Col md={7} sm={12}></Col>
                    <Col md={5} sm={12}>
                      <div className={classes.btnSignGrp}>
                        {this.state.userLogin ? (
                          <Logout />
                        ) : (
                          <Login sendData={this.getData} />
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Nav>
            </Container>
          </Navbar>
        </div>
      </>
    );
  }
}

export default Header;
