import React from "react";
import "../../css/splash.css";

const Blog = ({ data }) => {
  const blogLink = `/blog/${data["slug"]}`;
  return (
    <div>
      {/* card  */}
      <a href={blogLink} className=" flex flex-col  items-center px-3 py-10">
        <div className="bg-black rounded-lg shadow-md backdrop-blur-sm border border-white border-opacity-30 overflow-y-auto flex flex-col items-baseline m-0  opacity-90 cursor-pointer mt-6 max-w-[450px]">
          <div className="w-400px overflow-hidden">
            <img src={data.image} />
          </div>
          <div className="flex ">
            <div className="text-white p-[10px]  font-Roboto font-semibold break-words max-w-[500px]">
              {data.title}
            </div>
            {/* <div className="text-yellow p-[15px] font-bold break-words max-w-[500px]">
                    {data.metadata.username}
                </div> */}
          </div>
        </div>
      </a>
    </div>
  );
};

export default Blog;
