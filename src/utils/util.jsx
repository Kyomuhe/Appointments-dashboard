import { toast } from "sonner";
import { ServerUrl } from "../config/config";
import axios from "axios"
import { getAcessToken, isTokenExpired, refreshAccessToken } from "./TokenManager";


export const showToast = (message,type) =>{
    switch (type){
        case 'success':
            return toast.success(message,{
                duration: 4000,
                style: {background: 'green', color: 'white' }
            });
            case 'error':
                return toast.error(message,{
                    duration: 4000,
                    style: {background: 'red', color: 'white' }
                });
            default:
                return toast(message);
    }

}

export const makeRequest = async (ACTION, SERVICE, data) => {
    try{
    let url = ServerUrl
    console.log(url)
    // const requestData = JSON.stringify(data);
    const payload = {ACTION, SERVICE, ...data};
    console.log('request payload:', JSON.stringify(payload));

    let config ={
        headers:{"Content-Type": "application/json" }
    };

    const response = await axios.post(url, payload, config);
    return response.data;
    }catch(error){
        console.error("Error making request:", error);
        if(error.response){
            throw error.response.data|| error;
        }else{
            throw new Error(error.message)
        }
    }
}

export const makeAuthenticatedRequest = async (ACTION, SERVICE, data) => {
    let accessToken = getAcessToken();
    if(!accessToken || isTokenExpired(accessToken)){
        console.log('Access token is missing or expired, refreshing token...');
        accessToken = await refreshAccessToken();
        if(!accessToken){
            console.log("oops seems you are not logged in, and this is a protected route");
            return null;
        }
    }

    try{
        let url = ServerUrl

        const payload = {ACTION, SERVICE, ...data};

        let config ={
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`

            }
        };
        const response = await axios.post(url, payload, config);
        console.log("request was successful");
        return response.data;
    }catch(error){
        console.error("Error making authenticated request:", error);

        if(error.response){
            const errorMessage = error.response.data || error;
            showToast(`Error: ${errorMessage}`, 'error');
            throw errorMessage;
        }else{
            showToast(`Error: ${error.message}`, 'error');
            throw new Error(error.message)
        }

    }
}