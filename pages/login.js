// pages/login.js

import { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import PublicRoute from '../hoc/PublicRoute';

export default function LoginPage() {
  // State for form inputs
  const [form, setForm] = useState({ email: '', password: '' });
  
  // State for error messages
  const [error, setError] = useState('');
  
  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      // Send POST request to the API route
      const res = await axios.post('/api/auth/login', form);

      // Extract token from response
      const token = res.data.token;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Decode the token to get user information
      const decoded = jwt_decode(token);

      // Update user state in AuthContext
      setUser({ id: decoded.userId, email: decoded.email });

      // Show success toast
      toast.success('Login successful!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      // Handle errors
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-4">Login</h2>
        
        {/* Display error message if any */}
        {error && (
          <p className="text-red-500 mb-2" aria-live="polite">
            {error}
          </p>
        )}
        
        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        
        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        
        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            // Display spinner and "Loading..." text when loading
            <div className="flex items-center justify-center">
              {/* Spinner Icon */}
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true" // Accessibility: Hide spinner from screen readers
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : (
            'Login' // Display "Login" when not loading
          )}
        </button>
        
        {/* Link to Register Page */}
        <p className="mt-2 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

// Wrap the component with PublicRoute to handle redirection
LoginPage.getLayout = function getLayout(page) {
  return <PublicRoute>{page}</PublicRoute>;
};
