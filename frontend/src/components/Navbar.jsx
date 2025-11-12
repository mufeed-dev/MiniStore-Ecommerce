import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 shadow-lg">
      <div
        className="text-xl font-bold cursor-pointer hover:text-blue-300 transition-colors"
        onClick={() => navigate("/")}
      >
        🛒 MiniStore
      </div>

      <div className="flex gap-4">
        {location.pathname === "/add-product" ? (
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors"
          >
            ← Back to Products
          </button>
        ) : (
          <button
            onClick={() => navigate("/add-product")}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Product
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
