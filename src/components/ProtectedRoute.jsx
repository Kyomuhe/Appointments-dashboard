import { Navigate, useLocation } from 'react-router-dom';
import { getAcessToken } from '../utils/TokenManager';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const token = getAcessToken();
  const location = useLocation();

  useEffect(() => {
    // Prevent back button navigation
    window.history.pushState(null, document.title, window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, document.title, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!token) {
    console.log('No access token found, redirecting to login...');
    return <Navigate to="/" replace />;
  }

  if (location.pathname === '/layout' || location.pathname === '/layout/') {
    const savedPage = localStorage.getItem('lastVisitedPage') || 'dashboard';
    console.log('At /layout root, redirecting to:', savedPage);
    return <Navigate to={`/layout/${savedPage}`} replace />;
  }

  return children;
};

export default ProtectedRoute;