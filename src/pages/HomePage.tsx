import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import LandingPageBody from '../components/LandingPageBody';
const HomePage = () => {

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <HeroSection />
      <LandingPageBody/>
      {/* <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-[#FFE31A] mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div> */}
      <Footer />
    </div>
  );
};

export default HomePage;