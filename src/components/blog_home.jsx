import React, { useEffect, useState } from "react";
import Blogs_header from "../components/blogs_header";
import BlogFooter from "../components/blogs_footer";
import Markdown from "marked-react";
import ApOpnrImg from "../assets/AppOpener.png";
import DeetImg from "../assets/Deet.png";
import SpImg from "../assets/Spawnsers.png";
import image5 from "../assets/pexels-stephan-seeber-1772971.jpg";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import "../components/blog_styles.css";
const BlogHome = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    setBlogs([
      {
        id: "1",
        image: image1,
        story: `###### **The Pros and Cons of URL Shorteners: Navigating Challenges and Embracing Opportunities**`,
        date: `**31 Aug 2021**`,
        substory: `###### **In this blog, we will explore the advantages and disadvantages of using URL shorteners, shedding light on the potential risks they pose, as well as the opportunities they present.**`,
      },
      {
        id: "2",
        image: image2,
        story: `###### **Web 3 URL Shorteners and Privacy: All you need to know Web 3 URL Shorteners and Privacy: All you need to know**`,
        date: `**4 Jan 2022**`,
        substory: `###### **In this article, we delve into the realm of Web 3 URL shorteners, exploring their significance, features, and how they prioritize user privacy.**`,
      },
    ]);
  }, []);
  return (
    <>
      <div className="relative bg-black">
        <img
          className="h-[500px] w-full object-cover overflow-hidden"
          src={image5}
        />
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="absolute inset-0 flex lg:flex-row gap-4 items-center flex-col font-extrabold justify-center text-white text-5xl ">
          <div>WORDS</div>
          <div>CAN</div>
          <div>OVERPOWER</div>
        </div>
        <div className="inset-0 absolute">
          <Blogs_header />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="max-w-[1100px]">
          <div className="font-extrabold text-xl xs:text-2xl sm:text-3xl px-2 flex justify-center items-center py-2 flex-col mt-4 text-center">
            WE UNDERSTAND CONTENT TRENDS LIKE NOBODY ELSE IN THE
            <span className="market"> MARKET</span>
          </div>
          <div className="flex justify-center px-4">
            <hr className="w-full max-w-[800px] border-black border-4"></hr>
          </div>
          <div className="flex justify-center items-center px-4 text-blue-950">
            <div className="bg-gray-300 text-md text-center p-3 font-semibold w-full sm:w-3/5">
              Our range of tech products helps us understand how creators and
              their audience interact with content. Our blogs will make sure you
              receive the latest news and tricks to overpower your Web 3
              journey.
            </div>
          </div>
        </div>

        <div class="flex sm:flex-row flex-col justify-center items-center gap-4 sm:gap-0 sm:items-stretch w-full sm:max-w-[800px] mt-4">
          <div class="w-full sm:w-1/3 px-2 flex flex-col items-center gap-2">
            <img src={ApOpnrImg} alt="Image 1" class="h-72 sm:w-40 sm:h-40" />
            <div className="font-extrabold text-xl">APPOPENER</div>
            <div class="font-semibold text-center">
              India's first and official smart link generator to create links
              that take you from one app to another.
            </div>
          </div>

          <div class="w-full sm:w-1/3 px-2 flex flex-col items-center gap-2">
            <img src={DeetImg} alt="Image 2" class="h-72 sm:w-40 sm:h-40" />
            <div className="font-extrabold text-xl">DEET</div>
            <div class="font-semibold text-center">
              Devil is in the details! Your details are not yours anymore
            </div>
          </div>

          <div class="w-full sm:w-1/3 px-2 flex flex-col items-center gap-2">
            <img src={SpImg} alt="Image 3" class="h-72 sm:w-40 sm:h-40" />
            <div className="font-extrabold text-xl">SPAWNSERS</div>
            <div class="font-semibold text-center">
              Mixing bartering and luxury. Money and influence. Sponsor and
              Spawning. Get what you want by money or work. No talking, please!
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <hr className="max-w-[800px] w-full border-4 border-black"></hr>
        </div>
        <div className="flex flex-col ml:flex-row gap-8 max-w-[1100px] py-4">
          {blogs.map((blog, index) => {
            return (
              <>
                <div className="flex flex-row gap-4 px-4">
                  <a href={`/blog/${blog.id}`} className="cursor-pointer">
                    <img
                      className="max-w-[120px] max-h-[100px] object-cover overflow-hidden"
                      src={blog.image}
                    />
                  </a>
                  <div>
                    <a
                      href={`/blog/${blog.id}`}
                      className="cursor-pointer text-black underline hover:no-underline"
                    >
                      <Markdown>{blog.story}</Markdown>
                    </a>
                    <div className="opacity-50">
                      <Markdown>{blog.date}</Markdown>
                    </div>
                    <div>
                      {blog.substory.length > 300 ? (
                        <>
                          <div className="relative">
                            <a
                              href={`/blog/${blog.id}`}
                              className="absolute w-full text-sm text-center border  border-black shadow-2xl bottom-0 z-10 bg-white opacity-90"
                            >
                              Read more
                            </a>
                            <Markdown>{blog.substory.slice(0, 300)}</Markdown>
                          </div>
                        </>
                      ) : (
                        <>
                          <Markdown>{blog.substory}</Markdown>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div className="w-full flex justify-center px-4">
          <hr className="max-w-[800px] w-full border-4 border-black"></hr>
        </div>
        <div className="flex px-2 flex-col gap-[24px] sm:flex-row justify-center mt-4 w-full">
          <div class="card sm:max-w-[280px] ml:max-w-[320px] sm:w-full">
            <div class="card-header">
              <h2>Guest & Backlink Post</h2>
            </div>
            <div class="card-body">
              <h1>25</h1>
              <p>Get a HyperLinked Post</p>
              <p>High Domain Authority</p>
              <p>10M + Users Monthly</p>
              <p>For Students and Individuals</p>
            </div>
          </div>

          <div class="card sm:max-w-[280px] ml:max-w-[320px] sm:w-full">
            <div class="card-header">
              <h2>Brand & PR Post</h2>
            </div>
            <div class="card-body">
              <h1>99</h1>
              <p>Customized PR</p>
              <p>SEO Boost</p>
              <p>Website Traffic for Life</p>
              <p>For Corporates and Celebs</p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center px-3">
          <div className="pink-border sm:max-w-[610px] ml:max-w-[680px] mt-4 w-full">
            <h1>Fall in love with growth and success</h1>
          </div>
        </div>
      </div>
      <BlogFooter />
    </>
  );
};

export default BlogHome;
