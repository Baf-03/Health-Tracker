// components/Navbar.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FaHeart } from 'react-icons/fa';

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <FaHeart className="mr-2" />
        <a href="/dashboard" className="font-bold text-xl">
          Health Tracker
        </a>
      </div>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <a href="/login" className="mr-4 hover:underline">
              Login
            </a>
            <a href="/register" className="hover:underline">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
