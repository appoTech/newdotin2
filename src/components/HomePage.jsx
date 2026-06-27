import React from 'react'
import Footer from './Footer';
import PageContent from './PageContent';
import classes from './Styles.module.css'


function HomePage(props) {
    
    return(
      <>
        <div className="flex flex-col gap-5 md:gap-5 mx-5 lg:mx-20 mt-2">
          <div className="text-2xl lg:text-4xl font-bold">
              <h1>Welcome Back!</h1>
          </div>
          <div>
            <div className={`${classes.smartLinkTab} bg-blue-950 px-3 py-4 flex items-center flex-col rounded-2xl`}>
              <div>
              <div className='text-xl xxs:text-xl xs:text-2xl md:text-3xl lg:text-4xl font-bold text-center'>Create a smart link with the help of a  </div>
              <div className='text-xl xxs:text-xl xs:text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold text-center'>single click</div>
              </div>
              <div className='text-md lg:text-xl overscroll-auto text-center'>Stop questioning your content by taking advantage of amazing platform</div>
              <div className={`${classes.smartLinkContainer} w-full flex justify-center items-center lg:items-stretch flex-col lg:flex-row`}>
                <input className='text-black h-12 w-[90%] md:w-[80%] lg:w-[50%] rounded-2xl lg:rounded-l-2xl lg:rounded-r-none pl-5 focus:outline-none' 
                type='text' 
                placeholder='Enter your URL here'
                onChange={props.handleChange}>
                </input>
                {/* <button className='lg:bg-white px-3'>
                  <div className='text-black border-black bg-white border-2 px-5 font-bold rounded-lg py-1'>Smart Links</div>
                  </button>
                <button className='lg:bg-white px-3 rounded-r-2xl'>
                  <div className='text- border-2 border-blue-950 px-5 py-1 font-bold rounded-lg bg-blue-500' >Branded Links</div>
                  </button> */}
                <div className='flex items-center gap-2 lg:bg-white rounded-r-2xl px-2'>
                  <button onClick={(e) => props.handleSubmit(e)} className='text-white font-bold  bg-blue-700  lg:text-white border-black border-2 py-1 px-4 rounded-2xl'>
                    Smart Link</button>
                  {/* <button className='border-black border-2 py-1 px-4 rounded-2xl bg-blue-500 text-white font-bold'>Branded Link</button> */}
                </div>
              </div>
              <div className='flex gap-1 text-xs xs:text-sm text-center'>
                <div className=''>Also become part of our ever-growing community. <a className='font-bold'>Join us now.</a></div>
                
              </div>
            </div>
          </div>
          

</div>



</>
);

};
export default HomePage;
