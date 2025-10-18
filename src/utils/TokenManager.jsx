import { makeRequest, showToast } from "./util";

export const getAcessToken = () =>{
    return localStorage.getItem('accessToken');
}

export const getRefreshToken =() =>{
    return localStorage.getItem('refreshToken');
}

export const setTokens =(token, refreshToken) =>{
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshTOken', refreshToken)
}
export const clearTokens = () =>{
    localStorage.clear('accessToken');
    localStorage.clear('refreshToken');
    localStorage.clear('user');

}

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; 
    return expiryTime < Date.now();
  } catch (e) {
    console.error('Error checking token expiry:', e);
    return true; 
  }
};

export const refreshAccessToken = async () =>{
    try{
        const refreshToken = getRefreshToken();

        if(!refreshToken){
            clearTokens();
            window.location.href ='/';
            return null;
        }
        const response = makeRequest('Auth', 'refresh', refreshToken);

        if(response?.return === 0){
            const {token, refreshToken, user} = response?.returnObject || {};

            if(!token || !refreshToken){
                throw new Error ('invalid response from refresh end point');
            }
            setTokens(token, refreshToken);

            return token;

        }
        if(response?.error){
            const errorMessage = response?.returnMessage || 'failed to refresh end point';
            clearTokens();
            showToast('session expired, please login again', 'error');
            window.location.href = '/';
            return null;
        }

        
    }catch(error){
    console.error('Token refresh error:', error);
    clearTokens();
    showToast('Session expired. Please login again.', 'error');
    window.location.href = '/';
    return null;


    }
};