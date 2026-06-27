import React, { useEffect, useState } from 'react';
import classes from './Styles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { LiaAngleDownSolid } from "react-icons/lia";
import { IoIosCheckbox } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { LuFacebook } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { getUserDashboard } from '../helper/api';
import { FaYoutube } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { BsSpotify } from "react-icons/bs";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { TbWorldWww } from "react-icons/tb";



function Dash_links(props) {
    let auth_token = localStorage.getItem('aop_token');
    // console.log(auth_token);
    const [userData, setUserData] = useState([]);
    const [loadingData, setloading] = useState(false)
    const url = process.env.REACT_APP_SMART_LINK_PREFIX;
    const newLink = props.newLink;
    const handleDelete = (linkId) => {
        
    };


    useEffect(() => {
        if (newLink) {
            console.log('new link',newLink); 
            const currentDate = new Date();
            const timestamp = currentDate.getTime();
            const newLinkModified = {originalURL: newLink.originalURL, id: newLink.shortid, click_count: 0, tag: newLink.tag, created_at: timestamp};
            setUserData(prevUserData => [newLinkModified, ...prevUserData, ]);
        };
        setloading(true);
        const fetchData = async () => {
            try {
                const res = await getUserDashboard(auth_token);
                if (res) {
                    // console.log('links', res.data);
                    let user_array = res.data.user_arr
                    let reverseMappedArray = [];
                    for (let i = user_array.length - 1; i >= 0; i--) {
                        reverseMappedArray.push(user_array[i]);
                    }
                    setUserData(reverseMappedArray);
                    setloading(false);
                } else {
                    // console.log('no response');
                }
            } catch (err) {
                // console.log(err);
            }
        };
        if (auth_token) {
            fetchData();
        }
        

    }, [auth_token, newLink]);

    


    return(
        
        <>
        
        {auth_token ? (<>
        {loadingData ? (
        <>
        <div className='text-2xl md:text-3xl p-12 border-2 text-center bg-blue-950 rounded-2xl mt-2'>Loading your dashboard... </div>

        </>):(<>
        <div className={`${classes.userLinks} flex flex-row justify-between  items-center flex-nowrap text-center w-full mb-10`}>
            <div className='flex flex-col flex-nowrap overflow-auto min-w-[1280px] xl:w-full gap-2'>
        
            

        {userData.length > 0? (
            <>

            <div className='flex justify-between items-center text-xl py-2 rounded-2xl xl:grid xl:grid-cols-12'>
                <div className='text-left pl-3 w-[500px] ' style={{gridColumn: 'span 4'}}>
                    OriginalURL
                </div>
                <div className='w-[380px]' style={{gridColumn: 'span 3'}}>
                    <div>Short URL</div>
                </div>
                <div className='w-[100px] ' style={{gridColumn: 'span 1'}}>
                    Clicks
                </div>
                <div className='w-[150px]  ' style={{gridColumn: 'span 2'}}>
                    Created on
                </div>
                <div className='w-[100px] ' style={{gridColumn: 'span 1'}}>
                    Platform
                </div>
                <div className='w-[80px]  pr-3' style={{gridColumn: 'span 1'}}>
                    Edit
                </div>
            
        
            </div>
            
            
            
        
            
                {userData.reverse().map((link, index)=> {
                    const reversedIndex = userData.length - 1 - index;
                    const createdDate = new Date(link.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    });
                    return (
                    <>
                    <div key={reversedIndex} className={`${classes.allLinks} flex justify-between bg-blue-950 items-center text-md py-3 rounded-2xl xl:grid xl:grid-cols-12`}>
                      
                    <div className='text-left pl-3 w-[400px]' style={{gridColumn: 'span 4'}}>
                    {link.originalURL.length >  100 ? (<>
                        {`${link.originalURL.slice(0,80)}. . . . .`}
                    </>):(<> 
                        {link.originalURL}
                        </>)}
                    </div>
                    <div className='w-[380px] no-underline' style={{gridColumn: 'span 3'}}>
                        {link.tag === 'Youtube' ? (<><a target='blank' href={`${url}yt/${link.id}`}>{`${url}yt/${link.id}`}</a></>):(<></>)}
                        {link.tag === 'Instagram' ? (<><a target='blank' href={`${url}ig/${link.id}`}>{`${url}ig/${link.id}`}</a></>):(<></>)}
                        {link.tag === 'Spotify' ? (<><a target='blank' href={`${url}sp/${link.id}`}>{`${url}sp/${link.id}`}</a></>):(<></>)}
                        {link.tag === 'Linkedin' ? (<><a target='blank' href={`${url}lk/${link.id}`}>{`${url}lk/${link.id}`}</a></>):(<></>)}
                        {link.tag === 'Playstore' ? (<><a target='blank' href={`${url}ps/${link.id}`}>{`${url}ps/${link.id}`}</a></>):(<></>)}
                        {link.tag === 'Telegram' ? (<><a target='blank' href={`${url}tg/${link.id}`}>{`${url}tg/${link.id}`}</a></>):(<></>)}
                        {link.tag === 'Twitter' ? (<><a target='blank' href={`${url}tw/${link.id}`}>{`${url}tw/${link.id}`}</a></>):(<></>)}
                        {/* {link.tag === 'Other' ? (<><a target='blank' href={`${url}web/${link.id}`}>{`${url}web/${link.id}`}</a></>):(<></>)} */}

                    </div>
                    <div className='w-[100px] ' style={{gridColumn: 'span 1'}}>
                        {link.click_count}
                    </div>
                    <div className='w-[150px] ' style={{gridColumn: 'span 2'}}>
                        {createdDate    }
                    </div>
                    <div className='w-[100px]  text-2xl flex justify-center' style={{gridColumn: 'span 1'}}>
                        {link.tag === 'Youtube' ? (<>
                            <FaYoutube /></>):(<></>)}
                        {link.tag === 'Instagram' ? (<>
                            <GrInstagram /></>):(<></>)}
                        {link.tag === 'Spotify' ? (<>
                            <BsSpotify /></>):(<></>)}
                        {link.tag === 'Linkedin' ? (<>
                            <FaLinkedin /></>):(<></>)}
                        {link.tag === 'Playstore' ? (<>
                            <IoLogoGooglePlaystore /></>):(<></>)}
                        {link.tag === 'Other' ? (<>
                            <TbWorldWww /></>):(<></>)}
                    </div>
                    <div className='w-[80px] pr-3 text-2xl flex justify-center' style={{gridColumn: 'span 1'}}
                    onClick={handleDelete(link._id)}>
                    <MdDelete /> 
                    </div>
                
            
                </div>
                    </>
)})}
                
                
                </>
            ):(
            <>

                <div className='text-2xl md:text-3xl p-12 border-2 text-center bg-blue-950 rounded-2xl mt-2'> No any link created yet. </div>
            </>)}
            </div>
            </div>

        

            
            </>)}
            </>):(<>
                <div className='text-2xl md:text-3xl p-12 border-2 text-center bg-blue-950 rounded-2xl mt-2'>Login to get your Dashboard </div>
            </>)}
            {/* loadingData */}
            </>
        
        
        );
        
    }

export default Dash_links;
