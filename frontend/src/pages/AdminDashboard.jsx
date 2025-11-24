import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useProducts } from "../context/ProductsContext";
import AddProduct from "./AddProduct";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, authChecked } = useAdmin();
  const { products, loading, fetchProducts, deleteProduct, pagination } =
    useProducts();
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "",
    page: 1,
    limit: 10,
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    if (authChecked && isAdmin) {
      const fetchParams = {
        ...filters,
        search: debouncedSearch,
      };
      fetchProducts(fetchParams);
    }
  }, [
    debouncedSearch,
    filters.category,
    filters.sort,
    filters.page,
    filters.limit,
    isAdmin,
    authChecked,
    fetchProducts,
  ]);

  useEffect(() => {
    if (authChecked) {
      if (!isAdmin) {
        navigate("/admin-login");
      }
    }
  }, [isAdmin, authChecked, navigate]);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      category: e.target.value,
      page: 1,
    }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      sort: "",
      page: 1,
      limit: 10,
    });
    setDebouncedSearch("");
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
    setDebouncedSearch("");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner text="Verifying session..." />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner text="Redirecting..." />
      </div>
    );
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab("add");
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted successfully!");
        const fetchParams = {
          ...filters,
          search: debouncedSearch,
        };
        fetchProducts(fetchParams);
      } catch (error) {
        toast.error(`Error deleting product: ${error.message}`);
      }
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setActiveTab("add");
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your store products and inventory
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition-colors"
              >
                View Store
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === "manage"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📦 Manage Products
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === "add"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {selectedProduct ? "✏️ Edit Product" : "➕ Add Product"}
            </button>
          </div>

          <div className="p-6">
            {activeTab === "manage" && (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                      <div className="min-w-[250px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Search Products
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={filters.search}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">🔍</span>
                          </div>
                          {filters.search && (
                            <button
                              onClick={handleClearSearch}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={filters.category}
                          onChange={handleCategoryChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="all">All Categories</option>
                          <option value="Electronics">📱 Electronics</option>
                          <option value="Clothing">👕 Clothing</option>
                          <option value="Books">📚 Books</option>
                          <option value="Home & Kitchen">
                            🏠 Home & Kitchen
                          </option>
                          <option value="Sports">⚽ Sports</option>
                          <option value="Other">📦 Other</option>
                        </select>
                      </div>

                      <div className="min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sort By
                        </label>
                        <select
                          value={filters.sort}
                          onChange={handleSortChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">Default</option>
                          <option value="price_low">Price: Low to High</option>
                          <option value="price_high">Price: High to Low</option>
                          <option value="name">Name: A to Z</option>
                          <option value="name_desc">Name: Z to A</option>
                        </select>
                      </div>
                    </div>

                    {(filters.search ||
                      filters.category !== "all" ||
                      filters.sort) && (
                      <div className="flex items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                          {filters.search && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Search: "{filters.search}"
                            </span>
                          )}
                          {filters.category !== "all" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {filters.category}
                            </span>
                          )}
                          {filters.sort && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {filters.sort.replace("_", " ")}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 whitespace-nowrap border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <span>🔄</span>
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Product Management
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Showing {products.length} of {pagination.totalProducts}{" "}
                      products
                      {filters.search && (
                        <span className="text-blue-600 ml-1">
                          • Searching: "{filters.search}"
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex gap-3 items-center">
                    {pagination.totalPages > 1 && (
                      <p className="text-sm text-gray-500 mr-3">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </p>
                    )}
                  </div>
                </div>

                {loading ? (
                  <LoadingSpinner
                    text={
                      filters.search
                        ? `Searching for "${filters.search}"...`
                        : "Loading products..."
                    }
                  />
                ) : products.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {filters.search || filters.category !== "all"
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : "No products available yet. Add your first product!"}
                    </p>
                    {(filters.search || filters.category !== "all") && (
                      <button
                        onClick={clearFilters}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Product
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Price
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      product.image ||
                                      "https://placehold.co/300x300?text=No+Image"
                                    }
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <span className="font-medium block">
                                      {product.name}
                                    </span>
                                    <span className="text-sm text-gray-500 truncate max-w-xs">
                                      {product.description}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-blue-600">
                                ${product.price}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(product._id)
                                    }
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {pagination.totalPages > 1 && (
                      <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "add" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {selectedProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => setActiveTab("manage")}
                    className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors"
                  >
                    ← Back to Management
                  </button>
                </div>
                <AddProduct
                  editProduct={selectedProduct}
                  onSuccess={() => {
                    setActiveTab("manage");
                    setSelectedProduct(null);
                    const fetchParams = {
                      ...filters,
                      search: debouncedSearch,
                    };
                    fetchProducts(fetchParams);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
