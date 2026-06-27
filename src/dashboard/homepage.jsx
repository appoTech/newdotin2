import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "./routes";

// pages
import DashboardOverview from "./Dashboardoverview";


// components
import Sidebar from "./components/sidebar";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
// core styles
import "../scss/volt.scss";

// vendor styles
import "@fortawesome/fontawesome-free/css/all.css";
import "react-datetime/css/react-datetime.css";




const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => ( <> <Preloader show={loaded ? false : true} /> <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  const [sidebarclass,setsidebarclass] = useState("");



 
  const toggleSidebar=()=>{
    if(sidebarclass === ""){
      setsidebarclass("contracted")
    }
    else if(sidebarclass === "contracted"){
      setsidebarclass("")
    }
  }

  return (
    <Route {...rest} render={props => (
      <>
       
        <Sidebar hidesidebar={sidebarclass}/>
        {/* <Sidebar hidesidebar="contracted"/> */}

        <main className="content" style={{backgroundColor:"#f5f8fb"}}>
         <Navbar click={toggleSidebar}/>
          <Component {...props} />
         
        </main>
      </>
    )}
    />
  );
};

export default () => (
  <Switch>
   

    {/* pages */}
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />
    

    

    <Redirect to={Routes.NotFound.path} />
  </Switch>
);
