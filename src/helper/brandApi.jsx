import axios from "axios";
let api_url = process.env.REACT_APP_APPSUITE_API_URL;

export async function getBrandURL(brand) {
  try {
    console.log("Brand of brand api is : ",brand);
    let res = await axios({
      url: api_url + "get/" + brand,
      method: "get"
    });
    if (res.status == 200) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
}