import React, { useEffect, useState } from "react";
import Blogs_header from "../components/blogs_header";
import Footer from "../components/Footer";
import "../components/blog_styles.css";
import { GetBlogList } from "../helper/api";
/* import Float from "../components/side_button"; */
import Floattwo from "../components/side_button2";
import BottomNav from "../components/bottom";
// import G13Ads from "../components/g13ads";
import AdsterraAd from "../components/Adsterads";
import AnimatedTokens from "../components/AnimatedTokens";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const categories = {
  all: "All Topics",
  technology: "Technology",
  education: "Education",
  health: "Health",
  travel: "Travel",
  lifestyle: "lifestyle",
  latest: "Latest",
};

const BlogHome = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogs, setBlogs] = useState([]);
  const [latest, setLatest] = useState([]);
  useEffect(() => {
    GetBlogList().then((res) => {
      const allBlogs = res.data || [];
      console.log("All Blogs:", allBlogs);
      setBlogs(allBlogs);

      // sort by created_At in descending order (newest first)
      const sortedLatest = [...allBlogs].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      console.log("Sorted by Date:", new Date(sortedLatest[0]?.created_at));
      console.log("Sorted Latest Blogs:", sortedLatest);
      setLatest(sortedLatest);
    });
  }, []);

  const [visibleBlogs, setVisibleBlogs] = useState(4);

  const loadMoreBlogs = () => {
    setVisibleBlogs((prevCount) => prevCount + 4);
  };
  const filteredBlogs =
    selectedCategory === "latest"
      ? latest
      : selectedCategory === "all"
      ? blogs
      : blogs.filter(
          (article) =>
            article?.category &&
            article.category.toLowerCase() === selectedCategory.toLowerCase()
        );
  const displayedBlogs = filteredBlogs.slice(0, visibleBlogs);

  return (
    <>
      {/* <G13Ads /> */}
      <AdsterraAd />
      <AnimatedTokens />
      <Blogs_header />

      <div className="pt-[120px] font-rubik flex flex-col items-center justify-center">
        <div className="w-full max-w-[500px] md:max-w-[1050px] mx-auto px-4 text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center">
            <span className="text-red-500">Discover</span> Valuable{" "}
            <span className="text-yellow-500">Insights</span>
          </h2>

          <p className="text-base text-white sm:text-lg md:text-xl my-2 mx-2 sm:mx-4 px-2 sm:px-4 md:px-[50px] text-center">
            Explore our premium collection of research and analysis across
            various domains. Each card represents a unique insight crafted to
            provide value.
          </p>

          <div className="flex justify-center mt-4">
            <Button
              asChild
              variant="secondary"
              className="text-xs sm:text-sm text-black bg-gray-400 p-2 sm:p-3"
            >
              <a href="/writeblog" className="font-semibold no-underline">
                + Create Blog
              </a>
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center py-5 gap-4 mx-4 font-rubik">
          <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center my-4">
            <div className="flex gap-2 flex-wrap">
              <Tabs
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setVisibleBlogs(4); // Reset visible blogs count to 4 on tab change
                }}
                className="w-full"
              >
                <TabsList className="bg-background/50 p-1 h-auto flex text-white flex-wrap bg-gr">
                  {Object.entries(categories).map(([key, label]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="py-1 px-3 data-[state=active]:bg-gray-600 data-[state=active]:text-primary-foreground"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {displayedBlogs.map((article, index) => (
                <div
                  key={article._id || article.slug || index}
                  className="border border-solid border-gray-700 backdrop-blur-sm font-rubik rounded-2xl overflow-hidden flex flex-col items-center gap-4 p-4 group transition-transform duration-300 hover:scale-105"
                >
                  {/* Text Section */}
                  <div className="w-full flex-1 gap-2 px-2 text-center font-rubik">
                    <a
                      href={`/blog/${article.slug}`}
                      className="flex flex-col cursor-pointer no-underline text-white hover:underline"
                    >
                      <p className="font-extrabold text-lg text-white sm:text-xl uppercase">
                        {article.title}
                      </p>
                      <div className="font-semibold text-sm text-gray-200 line-clamp-3">
                        {article.description}
                      </div>
                    </a>
                  </div>

                  {/* Image Section */}
                  <div className="w-full flex items-center justify-center bg-none p-2 rounded-lg overflow-hidden h-[150px] transition-all duration-500 ease-in-out group-hover:[&>*]:h-[250px]">
                    <a
                      href={`/blog/${article.slug}`}
                      className="w-full max-w-[500px] flex justify-center items-center bg-none cursor-pointer h-full"
                    >
                      <img
                        src={article.image}
                        alt={`Thumbnail for ${article.title}`}
                        className="w-[75%] h-[75%] object-cover rounded-lg transform transition-transform duration-500 group-hover:translate-y-[0px]"
                      />
                    </a>
                  </div>
                </div>
              ))}
          </div>
          {visibleBlogs < filteredBlogs.length && (
            <button
              onClick={loadMoreBlogs}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load More
            </button>
          )}
        </div>
      </div>
      <BottomNav />
      <Footer />
      {/*{/*   <Float /> */}
      <Floattwo />
    </>
  );
};

export default BlogHome;
