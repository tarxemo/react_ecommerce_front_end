const Sidebar = () => {
    return (
      <aside className="w-64 bg-gray-100 h-screen p-4">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          <li className="hover:bg-gray-200 p-2 rounded">Electronics</li>
          <li className="hover:bg-gray-200 p-2 rounded">Fashion</li>
          <li className="hover:bg-gray-200 p-2 rounded">Home & Kitchen</li>
          <li className="hover:bg-gray-200 p-2 rounded">Sports</li>
        </ul>
      </aside>
    );
  };
  
  export default Sidebar;
  