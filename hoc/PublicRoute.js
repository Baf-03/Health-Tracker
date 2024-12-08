// hoc/PublicRoute.js

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // If user is authenticated, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    // Optionally, render a loading spinner or placeholder
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
};

export default PublicRoute;
