// src/App.js
import React, { useState } from "react";


const Popup = (props) => {
  return (
    <>
    {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[50%] sm:w-2/4 md:w-3/4 lg:w-2/3 xl:w-1/2 p-6 sm:p-32 md:p-12 lg:p-16 xl:p-20 rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-blue-900">
          Branded Links Coming Soon
        </h1>
      </div>
    </div> */}

    <div className="flex justify-center w-full h-max pt-40 md:pt-60">
      <div className="flex flex-col w-full  lg:w-[70%] xl:w-[60%] items-stretch   text-blue-600 px-24 text-xl md:text-2xl lg:text-4xl font-bold ">
        <div className="flex justify-center bg-white p-5 rounded-2xl">{props.text}</div>
        <div className="flex justify-end items-end h-full text-white pt-3 lg:pt-5 w-full">Coming Soon...</div>
      </div>

        
      </div>
    </>
  );
};

function Pop(props) {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div>
      {/* Your main content goes here */}
      {showPopup && <Popup text={props.text} />}
    </div>
  );
}

export default Pop;
