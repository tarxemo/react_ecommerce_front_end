import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-[#FFE31A] p-4 fixed w-full top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-[#FFE31A]/80 transition-colors">
          EcommerceApp
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-[#FFE31A]/80 transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-[#FFE31A]/80 transition-colors">
            Products
          </Link>
          <Link to="/cart" className="hover:text-[#FFE31A]/80 transition-colors">
            Cart
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
