export const refreshTokensetup = (res) =>{
    //Time to renew Access Token 
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

    const refreshToken = async()=>{
        const newAuthRes = await res.reloadAuthResponse();
        refreshTiming = (newAuthRes.expires_in || 3600 -5 *60) * 1000;
        console.log('new AuthRes', newAuthRes);

        //save user token 
        console.log('new Auth Token', newAuthRes.id_token);

        //update local storage 
        localStorage.setItem("aop_token",newAuthRes.id_token);

        // set other time after the first one 
        setTimeout(refreshToken,refreshTiming);

    }
    setTimeout(refreshToken,refreshTiming);
}