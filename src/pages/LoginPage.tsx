import  { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../api/mutations';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/auth';
import { FaUser, FaLock } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      setAuthToken(data);
      navigate('/');
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    loginUser({ variables: { username, password } });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-4 shadow-2xl w-full max-w-4xl backdrop-blur-md bg-opacity-80 animate-fadeIn flex flex-col md:flex-row">
        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 md:p-6">
          <h2 className="text-3xl font-bold mb-4 text-[#FFE31A] text-center md:text-left">Welcome Back!</h2>
          <p className="text-sm text-gray-300 mb-6 text-center md:text-left">Login to explore amazing deals and offers!</p>
          {error && <p className="text-red-500 mb-4 text-center md:text-left">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-2 flex items-center">
                <FaUser className="mr-2 text-[#FFE31A]" /> Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#FFE31A]"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2 flex items-center">
                <FaLock className="mr-2 text-[#FFE31A]" /> Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#FFE31A]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFE31A] text-gray-900 py-2 hover:bg-[#FFD700] transition-colors font-semibold shadow-md"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-sm text-center text-gray-400 mt-4">
            Don't have an account? <a href="/register" className="text-[#FFE31A] hover:underline">Sign Up</a>
          </p>
        </div>
        
        {/* Right Section - Image and Description */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
          <img src="/images/hero-bg.jpg" alt="E-commerce Promotion" className="w-full h-64 mb-4 shadow-lg" />
          <h3 className="text-xl font-semibold text-[#FFE31A] text-center">Shop the Best Deals!</h3>
          <p className="text-sm text-gray-300 text-center mt-2">Discover high-quality products at unbeatable prices. Your one-stop online shop for all your needs!</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
