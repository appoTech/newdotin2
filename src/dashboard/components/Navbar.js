
import React, { useState } from "react";
import { Row, Col, Nav, Form, Image, Navbar, Dropdown, Container, ListGroup, InputGroup } from '@themesberg/react-bootstrap';
import { Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

// import NOTIFICATIONS_DATA from "../data/notifications";
//import Profile3 from "../../assets/users/bhuvan.avif";

const user_email = localStorage.getItem("aop_email");
  const profile_url = localStorage.getItem("profile_url");
export default (props) => {
  const clickMe = () => {
    props.click()
}
 
  

  //setuseremail(localStorage.getItem("aop_email"));


 


  const Notification = (props) => {
    const { link, sender, image, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image  className="user-avatar lg-avatar rounded-circle" />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{sender}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{time}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center ">
            <a className="btn d-none d-lg-block" style={{backgroundColor:"#262C3F"}} onClick={clickMe}><FaBars style={{color:"#EAEDF1"}}/></a>
            {/* <marquee>Due to some technical issues earlier clicks are not getting updated, its foxed now sorry for inconvinience</marquee> */}
            <Form className="navbar2-search">
              {/* <Form.Group id="topbarSearch">
                <InputGroup className="input-group-merge search-bar">
                  <InputGroup.Text> </InputGroup.Text>
                  <Form.Control type="text" placeholder="Search" />
                </InputGroup>
              </Form.Group> */}
            </Form>
          </div>
          <Nav className="align-items-center">
           

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={profile_url} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">{user_email}</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              {/* <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2" >
                <Dropdown.Item className="fw-bold" style={{fontSize:"14px"}}>
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                 Settings
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                Messages
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                 Support
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item className="fw-bold">
                Logout
                </Dropdown.Item>
              </Dropdown.Menu> */}
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
