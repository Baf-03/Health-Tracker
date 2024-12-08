// components/ProtectedRoute.js
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner'; // Adjust the path accordingly

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access the dashboard.');
      router.push('/login');
    }
  }, [user, loading, router]);


// Inside ProtectedRoute component
if (loading) {
  return <LoadingSpinner />;
}


  if (!user) {
    // If not loading and no user, do not render children
    return null;
  }

  return children;
}
