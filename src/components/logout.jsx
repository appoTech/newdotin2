import React, { Component } from 'react';
import {GoogleLogout} from 'react-google-login';
import { FaSignOutAlt } from 'react-icons/fa';

const clientID = "69320367329-6k1p17bfh8looe2j57nqt2ftuq5fel6p.apps.googleusercontent.com";

function Logout() {
    const onSuccess=(res)=>{
        //alert("Logout Successfully")
        //remove token from local storage
        localStorage.removeItem("aop_token");
        localStorage.removeItem("aop_email");
        localStorage.removeItem("profile_url");
        window.location.reload();

    }

    return(
        <div>
             <GoogleLogout 
                        clientId={clientID}
                        render={renderProps => (
                            <button className="btn btn-danger" onClick={renderProps.onClick} disabled={renderProps.disabled}><FaSignOutAlt/></button>
                          )}
                        buttonText="Logout"
                        onLogoutSuccess={onSuccess}
                        />
        </div>
    )
    
}

export default Logout;