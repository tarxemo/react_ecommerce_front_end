import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ButtonProps {
  href?: string; // Make href optional for buttons
  onClick?: () => void; // Allow onClick for buttons
  type?: "button" | "submit" | "reset"; // Support different button types
  children: React.ReactNode;
  className?: string;
}

const Button = ({ href, onClick, type = "button", children, className }: ButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {href ? (
        // Render a Link if href is provided
        <Link to={href} className={`inline-block px-6 py-3 rounded-lg font-semibold text-center transition-colors ${className}`}>
          {children}
        </Link>
      ) : (
        // Otherwise, render a button element
        <button
          type={type}
          onClick={onClick}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${className}`}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
};

export default Button;
