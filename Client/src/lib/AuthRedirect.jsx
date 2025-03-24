import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const AuthRedirect = ({ children }) => {
  const { isSignedIn, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <div>Loading...</div>;
  return isSignedIn ? <Navigate to="/" replace /> : children;
};