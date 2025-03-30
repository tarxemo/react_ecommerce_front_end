import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen p-6">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-[#FFE31A] mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out to us.
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Email Card */}
          <div className="bg-gradient-to-br from-[#FFE31A] to-[#FFA41A] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4">
              <FaEnvelope className="text-[#FFA41A] text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email Us</h2>
            <p className="text-gray-800">support@zanzibarsafaris.com</p>
          </div>

          {/* Phone Card */}
          <div className="bg-gradient-to-br from-[#00C9FF] to-[#92FE9D] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4">
              <FaPhone className="text-[#00C9FF] text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Call Us</h2>
            <p className="text-gray-800">+255 123 456 789</p>
          </div>

          {/* Address Card */}
          <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FFE66D] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4">
              <FaMapMarkerAlt className="text-[#FF6B6B] text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h2>
            <p className="text-gray-800">Zanzibar, Tanzania</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#FFE31A] mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-400 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE31A]"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-full bg-[#FFE31A] text-gray-900 px-6 py-3 rounded-lg hover:bg-[#FFE31A]/90 transition-colors"
            >
              <FaPaperPlane className="mr-2" />
              Send Message
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ContactUsPage;