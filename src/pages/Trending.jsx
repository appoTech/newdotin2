import React, { useEffect, useState, lazy, Suspense } from "react";
import { getSuggestions, GetLatestBlogs } from "../helper/api";
import BottomNav from "../components/bottom";
// import G13Ads from "../components/g13ads.jsx";
import AdsterraAd from "../components/Adsterads.jsx";
const HeaderTrending = lazy(() => import("../components/header_trending.jsx"));
const Suggest = lazy(() => import("../components/Splash/Suggest.jsx"));
const Blog = lazy(() => import("../components/Splash/Blog.jsx"));

const GenerateLinkButton = lazy(() => import("../components/SmartLink.jsx"));
const Float = lazy(() => import("../components/side_button.jsx"));
const Floattwo = lazy(() => import("../components/side_button2.jsx"));

const Trending = () => {
  const [state, setState] = useState({
    suggestions: { links: [] },
    blogs: { data: [] },
    loading: true,
  });

  useEffect(() => {
    const getSugBlog = async () => {
      
      try {
        let suggestionsData = await getSuggestions();
        let blogsData = await GetLatestBlogs(10);
        setState({
          suggestions: suggestionsData || { links: [] },
          blogs: blogsData || { data: [] },
          loading: false,
        });
      } catch (err) {
        console.log("Error fetching data:", err);
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };
    getSugBlog();
  }, []);

  return (
    <div className='flex flex-col justify-center items-center 
          bg-gradient-to-r from-[#00125b] to-[#000000]'>
        <HeaderTrending />   
        {/* <G13Ads/> */}
        <AdsterraAd/>
      <h3 
        className="mt-20 text-4xl text-white font-medium py-8" 
        style={{fontFamily: "Palatino"}}
        >
          Creator Cosmos
      </h3>
      <div className="px-8 sm:px-24 w-full mx-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.loading
          ? Array(8)
              .fill(0)
              .map((_, index) => <SkeletonSuggest key={index} />)
          : state.suggestions.links.map((item, index) => (
              <Suspense fallback={<SkeletonSuggest />} key={`suggest${index}`}>
                <Suggest data={item} />
              </Suspense>
            ))}
      </div>

      <div className="flex justify-center items-center text-white font-medium py-8">
        <h1 style={{ fontSize: "30px", fontFamily: "Palatino" }}>
          "Why AppOpener?"
        </h1>
      </div>
      <div className="px-8 sm:px-24 w-full mx-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.blogs.data &&
          state.blogs.data.map((item, index) => (
            <Blog data={item} key={`blog${index}`} />
          ))}
      </div>
      {/*  <GenerateLinkButton /> */}
      <BottomNav />
       <Float /> 
      <Floattwo />
    </div>
  );
};

const SkeletonSuggest = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="bg-black rounded-lg shadow-md backdrop-blur-sm border border-white border-opacity-30 overflow-y-auto flex flex-col items-baseline m-0 opacity-90 cursor-pointer mt-6 w-full">
        <div className="w-full aspect-video bg-slate-700 animate-pulse"></div>
        <div className="w-full">
          <div className="h-16 flex justify-start items-center text-white p-3 font-bold break-word">
            <div className="h-6 bg-slate-700 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Trending;
