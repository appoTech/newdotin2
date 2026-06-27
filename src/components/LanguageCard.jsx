import React from "react";
import classes from "./Styles.module.css";
import { Link } from "react-router-dom";
import { Row, Col, Button, Container, Card } from "react-bootstrap";
import {FaMobileAlt,FaMusic,FaAndroid,FaShoppingCart,FaBasketballBall,FaCameraRetro,FaRss,
  FaApple,FaSistrix,FaBullhorn, FaYoutube} from "react-icons/fa";


const LanguageCard = () => {
  return <>
  
   <div className={classes.erlanguageContain}>
        <Container>
          <div className={classes.languageInner}>
            
            <div className={classes.cards}>  
            <FaMobileAlt size="40px" />            
             
            </div>
            <div className={classes.cards}>
              <FaMusic size="40px"/>
            </div>
            <div className={classes.cards}>
              <FaAndroid size="40px"/>
            </div>
            <div className={classes.cards}>
          <FaShoppingCart size="40px"/>
            </div>
            <div className={classes.cards}>
            <FaBasketballBall size="40px"/>
            </div>
            <div className={classes.cards}>
           <FaCameraRetro size="40px"/>
            </div>
            <div className={classes.cards}>
          <FaRss size="40px"/>
            </div>
            <div className={classes.cards}>
          <FaApple size="40px" />
            </div>
           
           
          
          </div>
        </Container>
      </div>
   
  </>;
};
export default LanguageCard;
