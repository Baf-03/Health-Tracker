// pages/register.js

import { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PublicRoute from '../hoc/PublicRoute';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to the API route
      const res = await axios.post('/api/auth/register', form);

      // Optionally, log the user in immediately after registration
      const { email, password } = form;
      const loginRes = await axios.post('/api/auth/login', { email, password });

      // Extract token from response
      const token = loginRes.data.token;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Decode the token to get user information
      const decoded = jwt_decode(token);

      // Update user state in AuthContext
      setUser({ id: decoded.userId, email: decoded.email });

      // Show success toast
      toast.success('Registration successful!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      // Handle errors
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
      toast.error(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
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
          Register
        </button>
        <p className="mt-2 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

// Wrap the component with PublicRoute
RegisterPage.getLayout = function getLayout(page) {
  return <PublicRoute>{page}</PublicRoute>;
};
