import React, { useEffect, useState }  from 'react';
import Markdown from 'marked-react';
import Blogs_header from '../components/blogs_header';
import image1 from '../assets/image1.jpg'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.jpg'
import image4 from '../assets/image4.jpg'
import BlogFooter from '../components/blogs_footer';
import { FaArrowLeftLong } from "react-icons/fa6";


const BlogContent = (props) =>{ 
    const [data, setData] = useState({})
    const [blogContent, setMarkdownContent] = useState([]);
    const [latestStories, setLatestStories] = useState([]);
    const text = `# **URL Shorteners: Challenges and Opportunities**
    ###### **URL shorteners have become an integral part of our online experience, offering convenience and brevity when sharing lengthy web addresses. These tools condense URLs into compact links that are easier to share via social media, email, and other platforms. However, like any technology, URL shorteners come with their own set of challenges and opportunities.**
    
    ### **Challenges of URL Shorteners**
    
    #### Link Trustworthiness
    
    ###### One of the primary concerns associated with URL shorteners is the erosion of trust. Since shortened links obfuscate the destination URL, users might hesitate to click on them due to the potential risk of encountering malicious or spammy content. As a result, marketers and businesses face a significant challenge in convincing users to trust the shortened links they share.
    
    ### Link Longevity
    
    ###### URL shortening services are subject to a variety of factors that can affect the longevity of shortened links. If the service provider shuts down or discontinues its services, all associated shortened links become obsolete. Additionally, some platforms may impose limitations on the lifespan of these shortened URLs, potentially leading to broken links in the future.
    
    ### Analytics Limitations
    
    ###### URL shorteners can hinder comprehensive website analytics. Since these services act as intermediaries between users and the destination website, they can obscure referral information. This lack of data may limit marketers’ ability to accurately track the source of traffic and measure the success of their campaigns.
    
    ### Branding and Customization
    
    ###### Maintaining a consistent brand image can be a challenge when using URL shorteners. Generic short URLs may not reflect a company’s brand identity or be memorable to users. Customization options provided by some URL shorteners mitigate this issue to an extent, allowing users to incorporate their brand name or keywords into the shortened link.
    
    ### Opportunities of URL Shorteners
    
    ### Improved User Experience
    
    ###### The primary advantage of URL shorteners lies in their ability to enhance user experience. By condensing lengthy URLs into shorter, more manageable links, they make sharing content across platforms easier and more convenient. This, in turn, encourages users to engage with shared links, promoting traffic and content visibility.
    
    ### Tracking and Analytics
    
    ###### URL shorteners provide valuable tracking and analytics capabilities. They offer insights into the number of clicks, geographical location of users, and other relevant data, allowing businesses and marketers to gauge the success of their campaigns and make data-driven decisions. These insights empower them to refine their marketing strategies and optimize future campaigns.
    
    ### Customization and Branding
    
    ###### **While customization can be a challenge, URL shorteners also present an opportunity to reinforce a brand’s identity. Some services allow users to customize the shortened URLs with branded or relevant keywords, increasing brand visibility and recognition. Customization options enable companies to maintain consistency in their online presence, even when sharing condensed links.
    
    ### **Aesthetics and User-Friendly Sharing**
    
    ###### **Long, cumbersome URLs can be visually unappealing and cumbersome to share. URL shorteners offer a streamlined and aesthetically pleasing alternative, improving the overall user experience. Additionally, these shortened links are easier to remember and share verbally, making them ideal for offline promotion and word-of-mouth marketing.**
    
    ### **Is Web 3.0 URL Shortener Worth It?**
    
    ###### **Web 3 URL shorteners offer a unique set of features and benefits compared to traditional URL shorteners. However, whether they are worth it depends on your specific needs and goals. Here are some factors to consider when evaluating the value of Web 3 URL shorteners:**
    
    ###### **Decentralization:** Web 3 URL shorteners operate on decentralized networks, utilizing blockchain technology. This decentralization ensures that links cannot be censored or manipulated by a central authority. If maintaining control and avoiding censorship is a priority for you, a Web 3 URL shortener may be worth considering.**
    ###### **Data Ownership and Privacy:** Web 3 URL shorteners prioritize data ownership and privacy. They typically do not collect or sell user data, offering increased privacy protection compared to traditional URL shorteners. If protecting user privacy is important to you or your organization, a Web 3 URL shortener might be a suitable choice.**
    ###### **Transparency and Trust:** With Web 3 URL shorteners, the destination URL is typically visible to users before they click on the shortened link. This transparency can help build trust and mitigate concerns about malicious or spammy content. If establishing trust with your audience is a key objective, a Web 3 URL shortener can support this goal.**
    ###### **Community Engagement:** Web 3 URL shorteners often have an active community of users who are passionate about decentralized technologies. This community engagement can provide networking opportunities, knowledge sharing, and potential collaborations. If you value community involvement and want to be part of the Web 3 ecosystem, a Web 3 URL shortener can offer these benefits.**
    ###### **Learning Curve and Adoption:** It’s important to consider that Web 3 technologies are still in their early stages, and the adoption of Web 3 URL shorteners might be relatively low compared to traditional options. Using Web 3 URL shorteners may require a learning curve and technical understanding of blockchain technology. If you are willing to invest time and effort into understanding and adopting these technologies, it may be worth exploring Web 3 URL shorteners.**
    
    ###### **Speaking about the advantages of Web 3 URL shorteners, you should definitely choose web 3 smart links for your business. But make sure you choose a professional and tech-efficient web 3.0 URL shortener like Opnr App to grow your business.
    
    ### **Conclusion**
    
    ###### **URL shorteners have revolutionized the way we share web addresses, bringing both challenges and opportunities. While concerns such as link trustworthiness and analytics limitations persist, the advantages of improved user experience, tracking capabilities, customization, and enhanced sharing outweigh these challenges**.
    
    ###### **By leveraging URL shorteners effectively, businesses can amplify their online presence, boost engagement, and establish a stronger brand identity. To navigate the challenges, it is crucial for marketers and users alike to exercise caution, choose reputable URL shortening services, and ensure transparency when sharing condensed links**.
    
    ###### **With careful consideration and strategic implementation, URL shorteners can be valuable tools for driving traffic, enhancing user experience, and achieving marketing objectives in the digital landscape**.
    `;    
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    useEffect(()=> {
        setMarkdownContent(lines);
        setData(
            {id: '1', content: text, image :image1, story: "**The Pros and Cons of URL Shorteners: Navigating Challenges and Embracing Opportunities**", 
                   substory: "###### **In this blog, we will explore the advantages and disadvantages of using URL shorteners, shedding light on the potential risks they pose, as well as the opportunities they present.** ",
                date: '31 MAY 2023', written_by: 'Arihara Nias'}             
        );
        setLatestStories([
            {id: '1', image :image1, story: `###### **The Pros and Cons of URL Shorteners: Navigating Challenges and Embracing Opportunities**`, 
                   substory: `###### **In this blog, we will explore the advantages and disadvantages of using URL shorteners, shedding light on the potential risks they pose, as well as the opportunities they present.**`}
            ,{id: '2', image:image2, story: `###### **Web 3 URL Shorteners and Privacy: All you need to know Web 3 URL Shorteners and Privacy: All you need to know**`,
                    substory: `###### **In this article, we delve into the realm of Web 3 URL shorteners, exploring their significance, features, and how they prioritize user privacy.**`}
            ,{id: '3', image: image3, story: `###### **Understanding the Economics of Web 3 URL Shorteners: Tokenomics and Business Models**`,
                    substory: `###### **In this blog post, we will delve into the fascinating world of Web 3 URL shorteners, exploring their underlying tokenomics and business models, and understanding their potential implications for the future of online marketing and content distribution.**`}               
        ])


    }, []);
    
    return(
        <>
        
        <div class="relative overflow-hidden">
            <img className='scale-110 h-screen object-cover' src={image1} />
            
            <div class="absolute inset-0 bg-black opacity-50"></div>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white mt-12 md:mt-20">
                <div class="max-w-[1100px] px-6">
                    <h2 class=" text-3xl md:text-6xl xl:text-7xl font-serif font-extrabold text-center">
                        <div class="uppercase"><Markdown>{data.story}</Markdown></div>
                        <div class="flex flex-row justify-center items-center gap-4 text-[10px] sm:text-lg mt-4">
                            <div>{data.date}</div>
                            <div class="uppercase">WRITTEN BY: {data.written_by}</div>
                        </div>
                    </h2>
                </div>
            </div>
            <div className='inset-0 absolute'><Blogs_header /></div>
        </div>

        <div className='flex justify-center items-center mt-20'>
            <div className='flex md:flex-row flex-col justify-center gap-10 px-4'>
                <div className='max-w-[700px] font-semibold'>
                <div className=''>
                {blogContent.map((line, index) => (
                    <div className='py-2'>
                    <Markdown key={index}>{line}</Markdown>
                    </div>
                ))}
                </div>

                </div>
                <div className='w-full md:max-w-[300px] flex flex-col gap-5 p-4 bg-green-200 h-fit'>
                    <div className='font-semibold'>LATEST STORIES</div>
                    {latestStories.map((story, index)=> {
                        return (
                            <>
                        
                        <div className='flex flex-col gap-2'>
                            <a href={`/blog/${story.id}`}><img className='object-cover w-full h-[150px] md:h-full md:w-auto' src={story.image} /></a>
                            <a href={`/blog/${story.id}`} className=' text-black no-underline hover:underline font-bold text-xl uppercase'><Markdown>{story.story}</Markdown></a>
                        </div>


                            </>
                        )
                    })}
                </div>
            </div>
        </div>
        <div className='flex justify-center items-center'>
        <div className='flex font-extrabold  p-4 max-w-[1100px] gap-3'>
        {latestStories.slice(0,2).map((story, index)=> {
                        return (
                            <>
                            <div>
                            
                            <span className='inline'><a href={`/blog/${story.id}`} className='inline text-black underline hover:no-underline font-bold uppercase'><span className='text-3xl'>&#8592;</span><Markdown className='inline'>{story.story}</Markdown></a></span>
                            </div>

                            </>
                        )
                    })}
           

        </div>
        </div>
        <BlogFooter />
                    

           
        </>
    )

}

export default BlogContent;