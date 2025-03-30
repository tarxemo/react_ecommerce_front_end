import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen p-6">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-[#FFE31A] mb-4">About Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Welcome to <span className="text-[#FFE31A]">Zanzibar Safaris</span>, your one-stop destination for buying and selling unique products. We are committed to providing a seamless and enjoyable shopping experience for both buyers and sellers.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#FFE31A] mb-4">Our Mission</h2>
            <p className="text-gray-400">
              Our mission is to create a vibrant online marketplace where users can easily buy and sell products. We aim to empower sellers by providing them with the tools they need to reach a global audience, while offering buyers a wide range of high-quality products at competitive prices.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            {/* Image Placeholder */}
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Image Placeholder</p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            {/* Image Placeholder */}
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Image Placeholder</p>
            </div>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#FFE31A] mb-4">Our Vision</h2>
            <p className="text-gray-400">
              We envision a world where anyone, anywhere, can easily buy and sell products without barriers. By leveraging technology, we strive to make e-commerce accessible, secure, and enjoyable for everyone.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#FFE31A] mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-[#FFE31A] mb-4">Customer-Centric</h3>
              <p className="text-gray-400">
                Our customers are at the heart of everything we do. We strive to provide exceptional service and ensure a seamless shopping experience.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-[#FFE31A] mb-4">Innovation</h3>
              <p className="text-gray-400">
                We continuously innovate to improve our platform and offer new features that benefit both buyers and sellers.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-[#FFE31A] mb-4">Integrity</h3>
              <p className="text-gray-400">
                We operate with honesty and transparency, ensuring trust and fairness in all our interactions.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#FFE31A] mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-400">Team Member Image</p>
              </div>
              <h3 className="text-xl font-bold text-[#FFE31A] mb-2">John Doe</h3>
              <p className="text-gray-400">CEO & Founder</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-400">Team Member Image</p>
              </div>
              <h3 className="text-xl font-bold text-[#FFE31A] mb-2">Jane Smith</h3>
              <p className="text-gray-400">Head of Operations</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-400">Team Member Image</p>
              </div>
              <h3 className="text-xl font-bold text-[#FFE31A] mb-2">Mike Johnson</h3>
              <p className="text-gray-400">Lead Developer</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-[#FFE31A] mb-4">Join Our Community</h2>
          <p className="text-gray-400 mb-8">
            Whether you're a buyer or a seller, we invite you to join our growing community and experience the future of e-commerce.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-[#FFE31A] text-gray-900 px-6 py-2 rounded-lg hover:bg-[#FFE31A]/90 transition-colors">
              Start Shopping
            </button>
            <button className="bg-gray-800 text-[#FFE31A] px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Become a Seller
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;