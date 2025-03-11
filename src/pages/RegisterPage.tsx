const RegisterPage = () => {
    return (
      <div className="h-screen flex flex-col">
        {/* Navigation Bar */}
  
        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Sidebar */}
  
          {/* Homepage Content */}
          <main className="flex-1 p-8 bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Welcome to Our E-Commerce Store</h1>
            <p className="text-gray-600">
              Explore a wide range of products at the best prices!
            </p>
  
            {/* Example Featured Products Section */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 border rounded-lg bg-white shadow-md">Product 1</div>
              <div className="p-4 border rounded-lg bg-white shadow-md">Product 2</div>
              <div className="p-4 border rounded-lg bg-white shadow-md">Product 3</div>
            </div>
          </main>
        </div>
      </div>
    );
  };
  
  export default RegisterPage;