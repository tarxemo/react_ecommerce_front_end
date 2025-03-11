import { Link } from 'react-router-dom';  // Import Link from react-router-dom

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-[#FFE31A] p-8 mt-16">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold">EcommerceApp</h3>
          <p className="mt-2">Your one-stop shop for everything.</p>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/about" className="hover:text-[#FFE31A]/80 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-[#FFE31A]/80 transition-colors">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-[#FFE31A]/80 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="text-center mt-8 border-t border-[#FFE31A]/20 pt-4">
        <p>&copy; {new Date().getFullYear()} EcommerceApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;