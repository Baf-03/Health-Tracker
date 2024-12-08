// hoc/ProtectedRoute.js

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // If not authenticated, redirect to login
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    // Optionally, render a loading spinner or placeholder
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
