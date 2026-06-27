import React, { useEffect, useState } from "react";
import Blogs_header from "../components/blogs_header";
import { GetBlogByID, GetLatestBlogs } from "../helper/api";
import { Helmet } from "react-helmet";
import AnimatedTokens from "../components/AnimatedTokens";
import MarkdownRenderer from "../components/markdownrenderer";
/* import Float from "../components/side_button"; */ 
import Floattwo from "../components/side_button2";
import BottomNav from "../components/bottom";
import Footer from "../components/Footer";
// import G13Ads from '../components/g13ads';
import AdsterraAd from "../components/Adsterads";


const BlogContent = (props) => {
  const slug = props.match.params.slug;
  const [data, setData] = useState({});
  const [latestStories, setLatestStories] = useState([]);
  useEffect(() => {
    GetBlogByID(slug).then((res) => {
      setData(res.data);
    });

    GetLatestBlogs(3).then((res) => {
      setLatestStories(res.data);
    });
  }, []);

  const schemaOrgData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    datePublished: data.created_at,
    author: {
      "@type": "Person",
      name: data.author || "Author",
    },
    publisher: {
      "@type": "Organization",
      name: "Spawnsers pvt ltd",
    },
  };

  return (
    <>
      <AdsterraAd/>
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={data.image} />
        <meta name="date" content={data.created_at} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.description} />
        <meta name="twitter:image" content={data.image} />
        <link rel="canonical" href={`https://appopener.com/blog/${slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgData)}
        </script>
      </Helmet>

      <AnimatedTokens />
      <div className="relative overflow-hidden font-rubik">
        <img
          className="w-full h-[50vh] sm:h-[70vh] md:h-screen object-cover"
          src={data.image}
          alt={`Thumbnail for ${data.title}`}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-4xl md:text-6xl xl:text-7xl font-serif font-extrabold uppercase">
              {data.title}
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm md:text-lg mt-4">
              <span>{data.time}</span>
              <span className="uppercase">WRITTEN BY: {data.author}</span>
            </div>
          </div>
        </div>
        <div className="inset-0 absolute">
          <Blogs_header />
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 md:mt-20 font-rubik">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-2/3 lg:w-3/4 font-semibold leading-relaxed text-sm sm:text-base lg:text-lg">  <MarkdownRenderer content={data.content} />
          </div>
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <div className="flex flex-col gap-6 p-5 bg-green-100 rounded-2xl shadow-lg md:sticky md:top-24">
            <div className="text-2xl font-bold text-green-800 border-b-2 border-green-400 pb-2">
              LATEST STORIES
            </div>

            {latestStories.map((story, index) => (
              <div
                className="flex flex-col gap-3 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                key={index}
              >
                <a
                  href={`/blog/${story.slug}`}
                  className="overflow-hidden rounded-lg"
                >
                  <img
                    className="object-cover w-full h-40 md:h-48 rounded-lg"
                    src={story.image}
                    alt={story.title}
                  />
                </a>

                <a
                  href={`/blog/${story.slug}`}
                  className="text-black no-underline hover:underline text-base sm:text-lg font-semibold uppercase"
                >
                  {story.title}
                </a>
              </div>
            ))}
          </div>
        </aside>
        </div>
      </div>
      {/* <div className='font-rubik flex justify-center items-center'>
            <div className='flex font-extrabold  p-4 max-w-[1100px] gap-3'>
            {latestStories.slice(0,2).map((story, index)=> {
                            return (
                                <div key={index}>
                                    <span className='inline'><a href={`/blog/${story.id}`} className='inline text-black underline hover:no-underline font-bold uppercase'><span className='text-3xl'>&#8592;</span><span className="inline">{story.title}</span></a></span>
                                </div>
                            )
                        })}
            </div>
        </div> */}

      <BottomNav />
      {/* <Footer /> */}
      {/*{/*   <Float /> */} 
      <Floattwo />
    </>
  );
};

export default BlogContent;
