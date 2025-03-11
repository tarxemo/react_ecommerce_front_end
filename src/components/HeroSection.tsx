import { motion } from 'framer-motion';
import Button from './Button';

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900 text-[#FFE31A] py-20"
    >
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to EcommerceApp</h1>
        <p className="text-lg mb-8">Discover the best products at unbeatable prices.</p>
        <Button href="/products" className="bg-[#FFE31A] text-gray-900 hover:bg-[#FFE31A]/90">
          Shop Now
        </Button>
      </div>
    </motion.section>
  );
};

export default HeroSection;