// pages/login.js

import { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log(err)
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
      toast.error(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
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
