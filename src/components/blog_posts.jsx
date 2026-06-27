import React, { useEffect, useState } from 'react'
import Blogs_header from '../components/blogs_header'
import BlogFooter from '../components/blogs_footer'
import Markdown from 'marked-react'
import image1 from '../assets/image1.jpg'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.jpg'
import image4 from '../assets/image4.jpg' // not used currently, but imported
import image5 from '../assets/pexels-stephan-seeber-1772971.jpg'

const BlogPosts = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    setData([
      {
        id: `1`,
        image: image1,
        story: `### The Pros and Cons of URL Shorteners: Navigating Challenges and Embracing Opportunities`,
        substory: `###### In this blog, we will explore the advantages and disadvantages of using URL shorteners, shedding light on the potential risks they pose, as well as the opportunities they present.`
      },
      {
        id: `2`,
        image: image2,
        story: `### Web 3 URL Shorteners and Privacy: All you need to know`,
        substory: `###### In this article, we delve into the realm of Web 3 URL shorteners, exploring their significance, features, and how they prioritize user privacy.`
      },
      {
        id: `3`,
        image: image3,
        story: `### Understanding the Economics of Web 3 URL Shorteners: Tokenomics and Business Models`,
        substory: `###### In this blog post, we will delve into the fascinating world of Web 3 URL shorteners, exploring their underlying tokenomics and business models, and understanding their potential implications for the future of online marketing and content distribution.`
      }
    ])
  }, [])

  return (
    <>
      <div className='relative'>
        <img className='h-[500px] w-full object-cover overflow-hidden' src={image5} />
        <div className='absolute inset-0 bg-black opacity-50'></div>
        <div className='absolute inset-0 flex mt-[230px] font-extrabold justify-center text-white text-5xl'>
          BLOGS
        </div>
        <div className='inset-0 absolute'>
          <Blogs_header />
        </div>
      </div>

      <div className='flex flex-col justify-center items-center py-5 gap-4'>
        {data.map((article) => (
          <div className='flex flex-col md:flex-row gap-4 items-center px-4' key={article.id}>
            <a href={`/blog/${article.id}`} className='w-full md:max-w-[720px] cursor-pointer'>
              <img src={article.image} />
            </a>
            <div className='w-full md:max-w-[360px] flex flex-col gap-2'>
              <a
                href={`/blog/${article.id}`}
                className='font-extrabold text-md sm:text-xl lg:text-3xl uppercase cursor-pointer no-underline text-black hover:underline'
              >
                <Markdown>{article.story}</Markdown>
              </a>
              {article.substory.length < 400 ? (
                <div className='font-semibold'>
                  <Markdown>{article.substory}</Markdown>
                </div>
              ) : (
                <div className='inline font-semibold relative'>
                  <div className='absolute w-full text-center border py-1 pt-2 text-sm border-black shadow-2xl bottom-0 z-10 bg-white opacity-90'>
                    Read more
                  </div>
                  <Markdown>{article.substory.slice(0, 400)}</Markdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <BlogFooter />
    </>
  )
}

export default BlogPosts
