import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaSadTear, FaShoppingBag } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated 404 Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <FaSadTear className="text-5xl text-[#FFE31A]" />
              </div>
              <span className="absolute -top-4 -right-4 bg-red-500 text-white text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center">
                404
              </span>
            </div>
          </div>

          {/* Friendly Message */}
          <h1 className="text-4xl font-bold text-[#FFE31A] mb-4">Oops! We can't find that page</h1>
          
          <p className="text-xl mb-6">
            The page you're looking for might have been moved, renamed, or doesn't exist anymore.
          </p>

          {/* Helpful Suggestions */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-[#FFE31A] mb-3">Let's get you back on track:</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaHome className="text-[#FFE31A] mt-1 mr-3 flex-shrink-0" />
                <div>
                  <Link to="/" className="hover:underline font-medium">Return to our homepage</Link>
                  <p className="text-gray-400 text-sm">Start fresh from our main page</p>
                </div>
              </li>
              <li className="flex items-start">
                <FaSearch className="text-[#FFE31A] mt-1 mr-3 flex-shrink-0" />
                <div>
                  <Link to="/products" className="hover:underline font-medium">Browse our products</Link>
                  <p className="text-gray-400 text-sm">Discover amazing items you might love</p>
                </div>
              </li>
              <li className="flex items-start">
                <FaShoppingBag className="text-[#FFE31A] mt-1 mr-3 flex-shrink-0" />
                <div>
                  <Link to="/contact-us" className="hover:underline font-medium">Contact our support team</Link>
                  <p className="text-gray-400 text-sm">We're happy to help with any questions</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Encouraging Message */}
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-[#FFE31A]">
            <p className="italic">
              "While you're here, why not check out our <Link to="/featured" className="text-[#FFE31A] hover:underline">featured products</Link>? 
              We're constantly adding new items you might love!"
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;