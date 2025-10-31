import { Navigate, useNavigate } from 'react-router-dom';
import { getAcessToken } from '../utils/TokenManager';
import { useEffect } from 'react';
import { useStateStore } from '../store/stateStore'
const ProtectedRoute = ({ children }) => {
  const onDashBoard = useStateStore((state) => state.onDashBoard)
  useEffect(
    () => {
      render()
    }, []
  )
  const navigate = useNavigate()
  const token = getAcessToken();

  if (!token) {
    console.log('No access token found, redirecting to login...');

    return <Navigate to="/" replace />;
  }
  const render = () => {

    // if(token && <Navigate to ="/"/>){
    //   return navigate("/layout");
    window.history.pushState(null, document.title, window.location.href);

    window.addEventListener('popstate', (event) => {
      window.history.pushState(null, document.title, window.location.href);
    })
    return navigate("/layout");

  }


  return children;
};

export default ProtectedRoute;