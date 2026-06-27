
import {React,useEffect,useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faExternalLinkAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap';
import { CounterWidget, CircleChartWidget} from "./components/Widgets";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { PageTrafficTable, RankingTable } from "./components/Tables";
import {getUserDashboard} from "../helper/api";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";



export default (props) => {
    let auth_token = localStorage.getItem("aop_token");
  
    const [total_link, settotal_link] = useState(0);
    const [total_youtube, settotal_youtube] = useState(0);
    const [total_insta, settotal_insta] = useState(0);
    const [data_array, setdata_array] = useState([]);
    const [loading,setloading] = useState(false);

    const apicall = ()=>{
        getUserDashboard(auth_token).then((res) => {
          if(res){
           if(res === "Invalid Token"){
               alert ("Invalid request please login again ");

           }
           else{
            //console.log(res.data);
           
            setdata_array(res.data.user_arr);
            settotal_link(res.data.user_arr.length);
            calculate_total(res.data.user_arr);
            setloading(true);

           }}
           else{
             alert("Dashboard in maintenance mode, Plz try after sometime");
             props.history.push("/");
           }
        });

    }
    const calculate_total =(data)=>{
         let total_count_yt = 0;
         let total_count_insta = 0;
        for (let i = 0; i < data.length; i++) {
            if(data[i].tag === "Youtube"){
                total_count_yt = total_count_yt+1;
            }
            if(data[i].tag === "Instagram"){
                total_count_insta = total_count_insta+1;
            }
            
            
        }
        settotal_youtube(total_count_yt);
        settotal_insta(total_count_insta);

        const sortedActivities = data.sort((a, b) => b.created_at - a.created_at);
        //console.log(sortedActivities);

    }
    
      
    useEffect(() => {
        apicall();
      },[]);
  return (
   
    <> 
    
    <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faRocket} /></Breadcrumb.Item>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Analytics</h4>
         
        </div>
      </div>
     <Row className="justify-content-md-center">
       
       
        <Col xs={12} sm={6} xl={4} className="mb-4">
        {(loading)? 
       <CounterWidget
       category="Total Links"
       title={total_link}
       icon={faExternalLinkAlt}
       iconColor="green"
     /> : 

       <> <center><Loader type="Puff" color="skyblue" height={50} width={50}/>  </center> </>}
          
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
        {(loading)? 
          <CounterWidget
            category="Youtube"
            title={total_youtube}
            icon={faYoutube}
            iconColor="red"
          />
          : <> <center><Loader type="Puff" color="skyblue" height={50} width={50} />  </center> </>}
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
        {(loading)? 
        <CounterWidget
            category="Instagram"
            title={total_insta}
            icon={faInstagram}
            iconColor="maroon"
          />
          : <> <center><Loader type="Puff" color="skyblue" height={50} width={50} />  </center> </>}
        </Col>
      </Row>
      {(loading)? 
      <PageTrafficTable data={data_array}/>
      : <> <center ><Loader type="ThreeDots" color="skyblue" height={50} width={50} />  </center> </>}
    </>
  
  );
};
