import React, { useState, useEffect } from "react";
// import MyCart from "./cart";
// import OwnedLinks from "./owned";
// import {LinkCard} from "./owned";
// import Available_links from "./available_links";
// import Edit from "./edit_link";
// import Success from "./success_payment";
// import Branded_Selection from "./branded_selection";
import Dashboard from "./dashboard";
import Pop from "./pop_up";
import Login from "./login";



import "./styles.css";

import { CiHome } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5"; 
import { SlHome } from "react-icons/sl";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuPieChart } from "react-icons/lu";
import appIco from "../assets/favicon.ico";
import { FaSearch } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { IoCloseSharp } from "react-icons/io5";
import { Email } from "@mui/icons-material";





export default function MainPage() {
    const [myCart, setMyCart] = useState(false);
    const [oLinks, setOLinks] = useState(false);
    const [showDashboard, setShowDashboard] = useState(true);
    const [menuBar, setMenuBar] = useState(false);
    const [isLogin, setLogin ] = useState(false);
    const [googleAuthToken, setGoogleAuthToken] = useState('');
    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [userName, setUserName] = useState('');

    const getLoginDetails = (val) => {
        console.log('val:', val);
        console.log('googleId:', val.googleId);
        console.log('id_token:', val.tokenObj.id_token);
        console.log('email:', val.profileObj.email);
        console.log('name:', val.profileObj.name);
        console.log('imageUrl:', val.profileObj.imageUrl);
        if (val.googleId) {
            setGoogleAuthToken(val.tokenObj.id_token);
            setLogin(true);
            setEmail(val.profileObj.email);
            setUserName(val.profileObj.name);
            setImageUrl(val.profileObj.imageUrl)
        }
      }

      useEffect(() => {
        setGoogleAuthToken(localStorage.getItem("aop_token"));
        setEmail(localStorage.getItem("aop_email"));
        setImageUrl(localStorage.getItem("profile_url"));
      }, [])
    return (
        <>
            {/* NavBar */}
        <div className="flex w-full min-h-screen flex-col md:grid md:grid-cols-12 max-w-full">
            <div className="flex flex-1 items-center py-2 px-8 h-20 md:flex-col md:min-h-screen min-w-screen justify-between md:justify-start gap-20 md:pt-7 bg-blue-950  text-gray-500 
                " style={{gridColumn: 'span 1'}}>
                    <div className="text-2xl md:flex justify-center md:w-24"><a target="blank" href="https://www.appopener.ai/"><img className="w-10" src={appIco} alt="ICO Image"  /></a></div>
                        <div className={`text-2xl md:flex justify-center py-2 md:w-24 ${showDashboard ? `text-white`:``}  hidden cursor-pointer`} onClick={() => {setShowDashboard(true); setOLinks(false); setMyCart(false)}}>
                        <SlHome /></div>
                    <div className={`text-2xl hidden md:flex ${myCart ? `text-white`:``} justify-center py-2 cursor-pointer md:w-24`} onClick={() => {setMyCart(true); setOLinks(false); setShowDashboard(false)}}>
                        <FaArrowTrendUp  /></div>
                    <div className={`text-2xl hidden md:flex ${oLinks ? `text-white`:``} justify-center py-2 cursor-pointer md:w-24`} onClick={() => {setOLinks(true); setMyCart(false); setShowDashboard(false); }}>
                        <LuPieChart  /></div>
                    <div className="text-2xl border-2 p-2 md:hidden cursor-pointer"
                        onClick={() => {setMenuBar(true)}}>
                        <SlOptionsVertical/>
                    </div>
                {/* <div className="flex flex-col-reverse flex-1 mb-5 w-24 items-center">
                    <div className="text-2xl text-white"><IoSettingsOutline /></div>
                </div> */}
            </div>

            {/* mobile view menu */}
            {menuBar ?(<>
            <div className="absolute bg-blue-900 min-h-screen min-w-full md:hidden">
                <div className="h-28 flex items-center justify-end pr-4 text-white text-4xl border-b-[1px]"
                    onClick={() => {setMenuBar(false)}}>
                    <IoCloseSharp />
                </div>
                <div className="text-xl py-8 grid grid-cols-6 items-center text-white gap-4">
                    <div className="flex justify-center"><img  src={appIco} alt="ICO Image" onClick={() => setMyCart(false)}
                        style={{gridColumn: 'span 1'}} /></div>
                        <div style={{gridColumn: 'span 5'}} >APPOPENER</div>
                    </div>
                

                <div className="text-xl text-white grid grid-cols-6 items-center gap-4  py-2 focus:border-2 rounded-2xl mx-[3px] border-[1px] bg-blue-700 border-white"
                    onClick={() => {setShowDashboard(true); setOLinks(false); setMyCart(false); setMenuBar(false)}}>
                    <div className="flex justify-center">
                        <SlHome 
                        style={{gridColumn: 'span 1'}} /></div>
                    <div style={{gridColumn: 'span 5'}}>Dashboard</div>
                </div>

                <div className="text-xl text-white grid grid-cols-6 items-center gap-4 py-2 "
                    onClick={() => {setMyCart(true); setOLinks(false); setShowDashboard(false); setMenuBar(false)}}>
                    <div className="text-2xl flex justify-center">
                        <FaArrowTrendUp 
                            style={{gridColumn: 'span 1'}} /></div>
                    <div style={{gridColumn: 'span 5'}}>Market Place</div>
                </div>
                <div className="text-xl text-white grid grid-cols-6 items-center gap-4 py-2"
                    onClick={() => {setOLinks(true); setMyCart(false); setShowDashboard(false); setMenuBar(false) }}>
                <div className="text-xl flex justify-center">
                    <LuPieChart 
                        style={{gridColumn: 'span 1'}} /></div>
                    Analytics   
                </div>
            </div>
            </>):(<></>)}


            <div className="flex flex-col flex-2 md:max-h-screen overflow-auto flex-nowrap bg-blue-900 bg-gradient-to-br from-indigo-950 via-blue-700 to-blue-500 text-white w-full h-full"
                style={{gridColumn: 'span 11'}}>
                <div className="flex flex-row-reverse items-center justify-between">
                <div className="flex flex-row mr-10 mt-3">   
                { isLogin ? (<>
                    
                    <img src={appIco} className="rounded-full text-4xl object-cover"/>
                    <div className="flex flex-col justify-center ml-2">
                        <h2 className="text-lg font-bold text-white">{userName}</h2>
                        <p className="text-sm text-left text-gray-300">{Email}</p>
                    
                </div></>):(<>
                
                <div><Login sendData={getLoginDetails} /></div></>)}
                </div>
                
                
                </div>
                {myCart ? (
                <>
                    {/* <MyCart /> */}
                    <Pop />
                </>):(<></>)}


                {oLinks ? (
                <>
                {/* <Available_links /> */}
                <Pop />

                </>):(<></>)}

                
                {showDashboard ? (
                <>
                <div>
                
                <Dashboard />
                {/* <Edit />
                <Success />
                <Branded_Selection /> */}
                </div>

                </>):(<></>)}


                
                
            </div>
            </div>





        </>
    )
}