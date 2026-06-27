
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faGlobeEurope, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FaCopy, FaGlobe, FaGlobeAsia, FaInstagram,FaRegCopy,FaYoutube } from 'react-icons/fa';
import { Col, Row, Nav, Card, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { faYoutube,faGoogle,faYahoo,faTwitter } from "@fortawesome/free-brands-svg-icons";
import Moment from 'react-moment';
import { CopyToClipboard } from "react-copy-to-clipboard";
import "../css/dash_home.css";



let table_data = [];

const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};



export const PageTrafficTable = (props) => {
 
  table_data = props.data;
  table_data = table_data.map((item, index) => ({index, ...item}));
  //console.log("hey");
  console.log(table_data);

  const youtube_thumbnail = (YoutubeURL)=>{
    const urlObject = new URL(YoutubeURL);
  
    let thumbnail_url;

    if(urlObject.hostname === "youtu.be"){
     
      let youtu_be_split = YoutubeURL.split('.');
      youtu_be_split = youtu_be_split[1].split('/');
      thumbnail_url = `https://img.youtube.com/vi/${youtu_be_split[1]}/0.jpg`;
    }
    if(urlObject.hostname === "www.youtube.com"){
     
    //https://img.youtube.com/vi/r5iFrxi9-hY/0.jpg
     let youtube_url_split = YoutubeURL.split('=');
     thumbnail_url = `https://img.youtube.com/vi/${youtube_url_split[1]}/0.jpg`;

    }

   
  
     
  
    return (
      <img className="yt_thumnbnail" src={thumbnail_url} width="50px"></img>
    )
    

  }


  const TableRow = (props) => {
    const { index,click_count,created_at,id,originalURL,tag } = props;
    

    return (
      <tr>
        <td >
          {index+1}
        </td>
       
        <td style={{fontSize:"13px"}}>{youtube_thumbnail(originalURL)}
          <span title={originalURL} style={{marginLeft:"5px",cursor:"pointer"}}>{(originalURL.length > 60)? `${originalURL.substring(0, 50)} ...`: originalURL}</span></td>
        <td className="fw-bold">
        <CopyToClipboard text={
          
            (tag === "Youtube")?`https://appopener.com/yt/${id}`: 
            (tag==="Instagram")?`https://appopener.com/ig/${id}`:
            (tag==="Other")?`https://appopener.com/web/${id}`:""
          }>
            <a title="copy link"><FaRegCopy size="18px" style={{color:"GrayText"}}/></a>
          </CopyToClipboard>   
          <a style={{textDecoration:"none", color:"#3366BB",marginLeft:"5px"}} href=
          {
          (tag === "Youtube")?`https://appopener.com/yt/${id}`: 
          (tag==="Instagram")?`https://appopener.com/ig/${id}`:
          (tag==="Other")?`https://appopener.com/web/${id}`:""
        }
          target="_blank">
            {
          (tag === "Youtube")?`https://appopener.com/yt/${id}`: 
          (tag==="Instagram")?`https://appopener.com/ig/${id}`:
          (tag==="Other")?`https://appopener.com/web/${id}`:""
          }
          </a>
         
         
        </td>
       
        <td> {(tag==="Youtube")? <FaYoutube size="24px" style={{"color":"red"}}/>:
             (tag==="Instagram")?<FaInstagram size="24px" style={{"color":"brown"}}/>:
             (tag==="Other")?<FaGlobeAsia size="24px" style={{"color":"#3588fc"}}/>:""
             }</td>
        <td>{click_count}</td>
       
        <td><Moment format="DD/MM/YYYY">{created_at}</Moment></td>

        
       
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">#</th>
              <th className="border-0 text-break">Original URL</th>
              <th className="border-0">Short URL</th>
              
              <th className="border-0">Platform</th>
              <th className="border-0">Clicks</th>
              <th className="border-0">Created on</th>
             
            </tr>
          </thead>
          <tbody>
            {table_data.map(pt => <TableRow {...pt} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
