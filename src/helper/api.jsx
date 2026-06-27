import axios from "axios";
import InApp from "detect-inapp";
let api_url = process.env.REACT_APP_API_URL;
let blog_url = process.env.REACT_APP_BLOG_API_URL;

export async function getURLandredirect(tag, shorturl) {
  //check for USERAGENT Values
  const useragent = navigator.userAgent || navigator.vendor || window.opera;
  const inapp = new InApp(useragent);
  const value = [`${useragent}`];
  let device = inapp.device;
  let browser = inapp.browser;
  let os = getMobileOperatingSystem();
  let desktop = inapp.isDesktop;
  let mobile = inapp.isMobile;

  const devicetype = desktop ? "Desktop" : mobile ? "Mobile" : "none";
  const ostype = os;
  const BrowserType = browser;

  try {
    let res = await axios({
      url: api_url + "goto/" + tag + "/" + shorturl,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        DeviceType: devicetype,
        OsType: ostype,
        BrowserType: BrowserType,
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res);
      console.log(res.data);

      return res;
    }
    // Don't forget to return something
    //return res;
  } catch (err) {
    console.error(err);
  }
}

export async function redirectOpenLink(tag, shorturl) {
  //check for USERAGENT Values
  const useragent = navigator.userAgent || navigator.vendor || window.opera;
  const inapp = new InApp(useragent);
  const value = [`${useragent}`];
  let device = inapp.device;
  let browser = inapp.browser;
  let os = getMobileOperatingSystem();
  let desktop = inapp.isDesktop;
  let mobile = inapp.isMobile;

  const devicetype = desktop ? "Desktop" : mobile ? "Mobile" : "none";
  const ostype = os;
  const BrowserType = browser;

  try {
    // no need to send data; just to maintain axios format we can log or check route
    let res = await axios({
      url: api_url + "link/" + tag + "/" + shorturl,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      // we won’t send a body because this is a redirect route
      maxRedirects: 0, // axios won’t follow redirect (so browser can)
      validateStatus: (status) => status === 302 || status === 301, // only accept redirect
    });

    if (res.status === 302 || res.status === 301) {
      const redirectUrl = res.headers.location;

      console.log(
        "Redirecting user:",
        redirectUrl,
        "| Device:",
        devicetype,
        "| OS:",
        ostype,
        "| Browser:",
        BrowserType
      );

      // perform actual redirect via browser
      window.location.replace(redirectUrl);
    } else {
      // if backend doesn’t respond with redirect, manually try to open
      window.location.replace(api_url + "link/" + tag + "/" + shorturl);
    }
  } catch (err) {
    console.error("Error while redirecting:", err);

    // fallback: force navigation even if axios fails
    try {
      window.location.replace(api_url + "link/" + tag + "/" + shorturl);
    } catch (e) {
      console.error("Fallback redirect failed:", e);
    }
  }
}

export async function getSuggestions() {
  try {
    let res = await axios({
      url: api_url + "getSugLinks",
      method: "get",
    });
    if (res.status == 200) {
      // test for status you want, etc
      return res.data;
    }
    // Don't forget to return something
    //return res;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function generateOpenShortLink(tag, original_link, phoneNumber = null, linkType = null) {
  // console.log(tag);
  // console.log(original_link);
  try {
    let res = await axios({
      url: api_url + "createOpenURL",
      method: "post",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      data: {
        link: original_link,
        apptype: tag,
        phoneNumber,
        linkType,
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);
      console.log(res);
      return res;
    }
    // Don't forget to return something
    //return res;
  } catch (err) {
    console.error(err);
  }
}

export async function generateUserLink(tag, original_link, Auth_token, phoneNumber = null, linkType = null) {
  // console.log(tag);
  // console.log(original_link);
  try {
    let res = await axios({
      url: api_url + "createUserURL",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        link: original_link,
        apptype: tag,
        authtoken: Auth_token,
        phoneNumber,
        linkType,
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);

      return res;
    } else if (res.status == 401) {
      return "Invalid Token";
    }
    // Don't forget to return something
    //return res;
  } catch (err) {
    console.error(err);
  }
}

export async function getPaidLinksByPhone(phone) {
  try {
    let res = await axios({
      url: api_url + "payment/links/" + phone,
      method: "get",
    });
    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    console.error("Error retrieving paid links by phone:", err);
    return undefined;
  }
}

//check user exists
export async function checkIfUserExist(name, email, user_id, Auth_token) {
  try {
    let res = await axios({
      url: api_url + "checkUserExist",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: name,
        email: email,
        userid: user_id,
        authtoken: Auth_token,
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);

      return res;
    }
    // Don't forget to return something
    //return res;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserDashboard(Auth_token) {
  try {
    let res = await axios({
      url: api_url + "userdata",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        authtoken: Auth_token,
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);

      return res;
    } else if (res.status == 401) {
      return "Invalid Token";
    }
    // Don't forget to return something
    //return res;
  } catch (err) {
    console.error(err);
  }
}

export async function AddMeetRequest(
  Proposer,
  email,
  phoneNumber,
  purpose,
  message,
  organization,
  Creator,
  Budget,
  date
) {
  console.log(Creator);
  try {
    const response = await axios.post(
      api_url + "addmeet",
      {
        Proposer: Proposer,
        email: email,
        phoneNumber: phoneNumber,
        Purpose: purpose,
        Message: message,
        organization: organization,
        Creator: Creator,
        Budget: Budget,
        date: date,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      return {
        success: 1,
        status: 201,
        message: `Meet Request Successfully Added\nRequest ID: ${response.data.data._id}`,
        data: response.data,
      };
    } else {
      return {
        success: 2,
        status: response.status,
        message: `Error: ${response.status} - ${JSON.stringify(response.data)}`,
      };
    }
  } catch (err) {
    console.error(
      "Error adding meet request:",
      err.response ? err.response.data : err.message
    );
    return {
      success: 4,
      status: 500,
      message:
        "An error occurred while adding the meet request. Please try again.",
    };
  }
}

export async function GetBlogByID(slug) {
  try {
    let res = await axios({
      url: blog_url + "getBlogbyID",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        blogId: slug,
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);

      return res;
    } else if (res.status == 401) {
      return "this blog no longer exists !";
    }
  } catch (err) {
    console.error(err);
  }
}

export async function GetBlogList() {
  try {
    let res = await axios({
      url: blog_url + "getList",
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);

      return res;
    } else if (res.status == 401) {
      return "Invalid Token";
    }
    // Don't forget to return something
    //return res;
  } catch (err) {
    console.error(err);
  }
}

export async function GetLatestBlogs(limit) {
  try {
    let res = await axios({
      url: blog_url + "getLatestBlogs",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        limit: limit,
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);

      return res;
    } else if (res.status == 401) {
      return undefined;
    }
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function AddBlog(
  name,
  title,
  description,
  imageLink,
  content,
  category,
  authorizer,
  metaTags
) {
  try {
    const response = await axios.post(
      blog_url + "addBlog",
      {
        name: name,
        title: title,
        description: description,
        image: imageLink,
        content: content,
        category: category,
        metaTags: metaTags,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorizer}`, // Ensure the token is correctly formatted, e.g., "Bearer <token>"
        },
      }
    );

    if (response.status === 201) {
      return {
        success: 1,
        message: `Blog Successfully Added\nBlog ID: ${response.data.blog.id}`,
        data: response.data,
      };
    } else {
      return {
        success: 2,
        message: `Error: ${response.status} - ${JSON.stringify(response.data)}`,
      };
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return { success: 3, message: "Invalid token" };
    } else {
      console.error(
        "Error adding blog:",
        err.response ? err.response.data : err.message
      );
      return {
        success: 4,
        message: "An error occurred while adding the blog. Please try again.",
      };
    }
  }
}

export async function GetToken(name, email) {
  try {
    let res = await axios({
      url: blog_url + "addAuthorizor",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: name,
        email: email,
      },
    });
    if (res.status === 201 || res.status === 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);

      return res;
    } else if (res.status == 401) {
      return "Invalid Token";
    }
  } catch (err) {
    console.error(err);
  }
}

export async function ValidateToken(token) {
  try {
    let res = await axios({
      url: blog_url + "validateToken",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        token: token,
      },
    });
    if (res.status === 200) {
      // test for status you want, etc
      // console.log(res);
      // console.log(res.data);

      return { success: 1, message: "Token Validated" };
    }
  } catch (err) {
    if (err.response.status === 403) {
      return { success: 3, message: "Invalid token" };
    } else {
      console.error(
        "Error validating token:",
        err.response ? err.response.data : err.message
      );
      return {
        success: 4,
        message:
          "An error occurred while validating the token. Please try again.",
      };
    }
  }
}

export async function generateDescAndMetaTags(title) {
  try {
    const res = await axios.post(
      `${blog_url}generateDESC`,
      { title },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching descriptions:", error);
    return null;
  }
}
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "other";
}

export async function getStory() {
  try {
    let res = await axios.get(api_url + "getStories");
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    console.error("Error fetching story:", err);
    return err;
  }
}

export async function addStory(shortId, thumbnail) {
  console.log(
    "Adding story with videoId:",
    shortId,
    "and thumbnail:",
    thumbnail
  );
  return axios.post(api_url + "addStory", {
    shortId,
    thumbnail,
  });
}

export async function submitPromotion({ title, linkUrl, name, mobile, amount, imageFile }) {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("linkUrl", linkUrl);
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("amount", amount);
    formData.append("acceptPrivacy", "true");
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const res = await axios.post(api_url + "promote", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error submitting promotion:", err);
    throw err;
  }
}

export async function addPagerMessage({ text, source, name, amount }) {
  try {
    const res = await axios.post(
      api_url + "addMessage",
      { text, source, name, amount },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("Error adding pager message:", err);
    throw err;
  }
}

export async function recordClick(apptype, shorturl, source = "iframe_overlay") {
  try {
    let click_api_url = process.env.REACT_APP_CLICK_API_URL || api_url || "http://localhost:5001/";
    // Ensure trailing slash
    if (!click_api_url.endsWith("/")) {
      click_api_url += "/";
    }
    let res = await axios({
      url: click_api_url + "api/clicks",
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        "shortUrl": shorturl,
        "apptype": apptype,
        "source": source
      }
    });
    return res;
  } catch (err) {
    console.error("Failed to record click:", err);
  }
}


