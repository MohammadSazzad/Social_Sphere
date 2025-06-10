import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <div>Loading...</div>;
  return isSignedIn ? children : <Navigate to="/login" replace />;
};