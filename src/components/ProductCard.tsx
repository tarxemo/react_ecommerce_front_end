import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <Link to={`/products/${id}`}>
        <div className="relative">
          <img src={image} alt={name} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#FFE31A]">{name}</h3>
          <p className="text-gray-400">${price}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;