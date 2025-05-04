import  { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../api/mutations';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      navigate('/login');
    },
    onError: (err) => {
      setError(err.message);
    },
  });


  const validatePassword = (password: string | any[], confirmPassword: string) => {
    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    
    if (!validatePassword(password, confirmPassword)) return;
    
    createUser({
      variables: { userData: { username, email, password, userType } },
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white md:p-4">
      <div className="bg-gray-800 p-4 shadow-2xl w-full max-w-4xl backdrop-blur-md bg-opacity-80 animate-fadeIn flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-bold mb-4 text-[#FFE31A] text-center md:text-left">Join Us Today!</h2>
          <p className="text-sm text-gray-300 mb-6 text-center md:text-left">Create an account and start shopping now!</p>
          {error && <p className="text-red-500 mb-4 text-center md:text-left">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FaUser className="mr-2 text-[#FFE31A]" /> Username
              </label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#FFE31A]" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FaEnvelope className="mr-2 text-[#FFE31A]" /> Email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#FFE31A]" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FaLock className="mr-2 text-[#FFE31A]" /> Password
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#FFE31A]" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FaLock className="mr-2 text-[#FFE31A]" /> Confirm Password
              </label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#FFE31A]" />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FaUserTag className="mr-2 text-[#FFE31A]" /> Select Account Type
              </label>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#FFE31A]">
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#FFE31A] text-gray-900 py-2 hover:bg-[#FFD700] transition-colors font-semibold shadow-md">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-sm text-center text-gray-400 mt-4">
            Already have an account? <a href="/login" className="text-[#FFE31A] hover:underline">Login</a>
          </p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
        <img src="/images/hero-bg.jpg" alt="E-commerce Promotion" className="w-full h-64 mb-4 shadow-lg" />
          <h3 className="text-xl font-semibold text-[#FFE31A] text-center">Join Our Shopping Community!</h3>
          <p className="text-sm text-gray-300 text-center mt-2">Sign up now and enjoy exclusive deals and discounts on your favorite products.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegisterPage;
