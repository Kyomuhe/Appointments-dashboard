import { Navigate } from 'react-router-dom';
import { getAcessToken } from '../utils/TokenManager';
const ProtectedRoute = ({ children }) => {
  const token = getAcessToken();
  
  if (!token) {
    console.log('No access token found, redirecting to login...');

    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;