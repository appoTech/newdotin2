import React from "react";

import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const BlogFooter = () => {
    return (
        <>
            <div className="bg-black flex justify-center px-4 items-center text-white mt-4">
                <div className="max-w-[1100px] w-full flex flex-col py-20 gap-5">
                    <div className="font-extrabold text-xl">
                        OPNR.BLOG
                    </div>  
                    <div>
                        Words can OverPower
                    </div>
                    <div className="flex justify-between text-2xl sm:justify-center sm:gap-32  ">
                        <FaYoutube />
                        <FaInstagram />
                        <FaFacebook />
                        <FaLinkedin />
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogFooter;