export const validURL = (str)=> {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  export const get_Tag = (url)=> {
    let tag ="";
    try {
     
      const urlObject = new URL(url);
     
      console.log("Hostname:", urlObject.hostname);
  
      if (urlObject.hostname.includes("youtube") || urlObject.hostname.includes("youtu.be")) {
        tag = "Youtube";
      } else if (urlObject.hostname.includes("instagram")) {
        tag = "Instagram";
      }else if (urlObject.hostname.includes("open.spotify.com") || urlObject.hostname.includes("spotify")) {
        tag = "Spotify";
      }
      else if (urlObject.hostname.includes("www.t.me") || urlObject.hostname.includes("telegram")) {
        tag = "Telegram";
      }else if (urlObject.hostname.includes("twitter.com") || urlObject.hostname.includes("twitter") ) {
        tag = "Twitter";
      }else if (urlObject.hostname.includes("www.linkedin.com") || urlObject.hostname.includes("linkedin") ) {
        tag = "Linkedin";
      }
      else if (urlObject.hostname.includes("play.google.com") || urlObject.hostname.includes("play.google") ) {
        tag = "Playstore";
      }else if(urlObject.hostname.includes("facebook.com")||urlObject.hostname.includes("facebook")){
        tag="Facebook"
      } else if(urlObject.hostname.includes("docs.google")){
        tag="Docs"
      } else if (urlObject.hostname.includes("openyt")) {
        tag = "";
      } else {
        tag = "Other";
      }
      return tag;
    } catch (error) {
      console.log("error: ", error.message);
      return tag;
    }
    
  }

  export function validateYouTubeUrl(check_url) {
    try {
      const urlObject = new URL(check_url);
      console.log("Hostname:", urlObject.hostname);
      return urlObject.hostname.includes("youtube") || urlObject.hostname.includes("youtu.be");
    } catch (error) {
      console.log("error: ", error.message);
    }
  }
  
  export function validateInstagramUrl(check_url) {
    try {
      const urlObject = new URL(check_url);
      console.log("Hostname:", urlObject.hostname);
      return urlObject.hostname.includes("instagram");
    } catch (error) {
      console.log("error: ", error.message);
    }
  }


  export const check_intend = async (mobile_os, platform, url) => {
    let intend_done;
  
    console.log("platform:", platform);
  
    switch (platform) {
        case "Youtube":
            intend_done = await youtube_intend(mobile_os, url, platform);
            break;
        case "Instagram":
            intend_done = await instagram_intend(mobile_os, url, platform);
            break;
        case "Other":
            intend_done = await Other_intend(mobile_os, url, platform);
            break;
  
        default:
            break;
    }
    return intend_done;
  };
  
  const youtube_intend = async (mobile_os, url, platform) => {
    let os_type;
  
    if (validateYouTubeUrl(url) == true) {
      const intend = url.split("//");
      const pure_intend = intend[1];
      //const YOUTUBE_INTENDS = await getIntend.get_intend(platform);
      const YOUTUBE_INTENDS = "";
  
      if (mobile_os.isAndroid) {
        const app_intend = YOUTUBE_INTENDS.intend_android_before + pure_intend + YOUTUBE_INTENDS.intend_android_after;
        os_type = "android";
        return { app_intend, os_type };
      } else if (mobile_os.isiPhone) {
        const app_intend = YOUTUBE_INTENDS.intend_ios_before + pure_intend + YOUTUBE_INTENDS.intend_ios_after;
        os_type = "ios";
        return { app_intend, os_type };
      } else if (mobile_os.isWindows || mobile_os.isDesktop) {
        os_type = "windows";
        const app_intend = url;
        return { app_intend, os_type };
      } else {
        os_type = "windows";
        const app_intend = url;
        return { app_intend, os_type };
      }
    } else {
      os_type = "windows";
      const app_intend = url;
      return { app_intend, os_type };
    }
  };
  
  const instagram_intend = async (mobile_os, url, platform) => {
    let os_type;
  
    if (validateInstagramUrl(url) === true) {
      const intend = url.split("//");
      const pure_intend = intend[1];
  
     // const Instagram_INTENDS = await getIntend.get_intend(platform);
      const Instagram_INTENDS = "";
  
      if (mobile_os.isAndroid) {
        const app_intend = Instagram_INTENDS.intend_android_before + pure_intend + Instagram_INTENDS.intend_android_after;
        os_type = "android";
        return { app_intend, os_type };
      } else if (mobile_os.isiPhone) {
        const more_split = pure_intend.split("/");
        const app_intend = Instagram_INTENDS.intend_ios_before + more_split[1] + Instagram_INTENDS.intend_ios_after;
        os_type = "ios";
        return { app_intend, os_type };
      } else if (mobile_os.isWindows || mobile_os.isDesktop) {
        os_type = "windows";
        const app_intend = url;
        return { app_intend, os_type };
      } else {
        os_type = "windows";
        const app_intend = url;
        return { app_intend, os_type };
      }
    } else {
      os_type = "windows";
      const app_intend = url;
      return { app_intend, os_type };
    }
  };
  
  const Other_intend = async (mobile_os, url, platform) => {
    let os_type;
    os_type = "windows";
    const app_intend = url;
    return { app_intend, os_type };
    // try {
    //   if (mobile_os.isDesktop || mobile_os.isWindows || mobile_os.isMac) {
    //     console.log("Desktop: " + mobile_os.isDesktop + mobile_os.isWindows + mobile_os.isMac);
  
    //     os_type = "windows";
    //     const app_intend = url;
    //     return { app_intend, os_type };
    //   }
  
    //   const intend = url.split("//");
    //   const pure_intend = intend[1];
  
    //   const loginskip_url = `intent://${pure_intend}/#Intent;scheme=https;end`;
    //   return loginskip_url;
    // } catch (error) {
    //   console.log(error);
    // }
  };
