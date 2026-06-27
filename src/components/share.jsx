import React from 'react'

import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon
} from 'react-share'

const ShareButtons = ({title, url, tags}) => {

    return(
        <div>
          <FacebookShareButton url={url} >
                <FacebookIcon  size={60} round={true}/>
         </FacebookShareButton>

          <TwitterShareButton url={url} title={title} hashtags={tags}>
                <TwitterIcon  size={60} round={true} />
          </TwitterShareButton>

          <LinkedinShareButton url={url} >
            <LinkedinIcon  size={60} round={true}/>
          </LinkedinShareButton>

          <RedditShareButton url={url} title={title} >
            <RedditIcon  size={60} round={true} />
          </RedditShareButton>

          <WhatsappShareButton url={url} title={title}>
               <WhatsappIcon  size={60} round={true}/>
           </WhatsappShareButton>
        </div>
      )

}
export default ShareButtons