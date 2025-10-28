import { Navigate ,useNavigate} from 'react-router-dom';
import { getAcessToken } from '../utils/TokenManager';
import { useEffect } from 'react';
const ProtectedRoute = ({ children }) => {
  useEffect(  
      ()=> {render()
      } ,[]
  )
  const navigate = useNavigate()
  const token = getAcessToken();
  
  if (!token) {
    console.log('No access token found, redirecting to login...');

    return <Navigate to="/" replace />;
  }
  const render =() =>{
  if(token && <Navigate to ="/"/>){
    return navigate("/layout");


  }
  }
  
  return children;
};

export default ProtectedRoute;