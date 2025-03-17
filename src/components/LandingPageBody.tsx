import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const LandingPageBody = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Featured Products Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Floating PNG Images */}
        <motion.img
          src="/images/floating-1.png" // Replace with your image path
          alt="Floating Image 1"
          className="absolute top-20 left-0 w-24 h-24"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.img
          src="/images/floating-2.png" // Replace with your image path
          alt="Floating Image 2"
          className="absolute bottom-20 right-0 w-24 h-24"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />

        <div className="container z-10 mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold mb-8"
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: item * 0.2 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <img
                  src={`/images/product-${item}.jpg`} // Replace with your image path
                  alt={`Product ${item}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Product {item}</h3>
                <p className="text-gray-400 mb-4">$29.99</p>
                <Button href={`/products/${item}`} className="bg-[#FFE31A] z-50 text-gray-900 hover:bg-[#FFE31A]/90">
                  View Details
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner Section */}
      <section className="py-16 relative overflow-hidden text-gray-900">
        {/* Background with opacity using before pseudo-element */}
        <div className="absolute inset-0 bg-[#FFE31A] opacity-90"></div>

        {/* Floating Image */}
        <motion.img
            src="/images/floating-1.png"
            alt="Floating Image 3"
            className="absolute top-10 right-0 w-32 h-32"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Content (placed above the background) */}
        <div className="relative text-white container mx-auto text-center">
            <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold mb-4"
            >
            Exclusive Discounts!
            </motion.h2>
            <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg mb-8"
            >
            Get up to 50% off on selected products. Limited time only!
            </motion.p>
            <Button href="/products" className="bg-gray-900 text-[#FFE31A] hover:bg-gray-800">
            Shop Now
            </Button>
        </div>
        </section>


      {/* Categories Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold mb-8"
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Electronics', 'Clothing', 'Accessories'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <Button href={`/category/${category.toLowerCase()}`} className="bg-[#FFE31A] text-gray-900 hover:bg-[#FFE31A]/90">
                  Explore
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto text-center">
            {/* Section Title */}
            <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold mb-8 text-white"
            >
            What Our Customers Say
            </motion.h2>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
                <motion.div
                key={item}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.2 }}
                className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
                >
                {/* Testimonial Text */}
                <p className="text-gray-400 mb-4">
                    "This is the best e-commerce site I've ever used. Highly recommended!"
                </p>

                {/* User Profile */}
                <div className="flex flex-col items-center mt-4">
                    <img
                    src={`/images/user-${item}.jpg`} // Replace with actual user image paths
                    alt={`Customer ${item}`}
                    className="w-16 h-16 rounded-full border-2 border-[#FFE31A] shadow-lg"
                    />
                    <p className="text-[#FFE31A] mt-2 font-semibold">Customer {item}</p>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
        </section>

      {/* Newsletter Section */}
      <section className="py-16 relative overflow-hidden">
        <motion.img
          src="/images/floating-7.png" // Replace with your image path
          alt="Floating Image 4"
          className="absolute top-0 right-0 w-24 h-24"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="container mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold mb-4"
          >
            Subscribe to Our Newsletter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg mb-8"
          >
            Get the latest updates, discounts, and offers straight to your inbox.
          </motion.p>
          <form className="flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <Button type="submit" className="bg-[#FFE31A] text-gray-900 hover:bg-[#FFE31A]/90 rounded-l-none">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPageBody;