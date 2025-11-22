import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useProducts } from "../context/ProductsContext";
import AddProduct from "./AddProduct";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, authChecked } = useAdmin();
  const { products, loading, fetchProducts, deleteProduct } = useProducts();
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dashboardFetchParams = useMemo(() => ({ page: 1, limit: 50 }), []);

  useEffect(() => {
    if (authChecked) {
      if (isAdmin) {
        fetchProducts(dashboardFetchParams);
      } else {
        navigate("/admin-login");
      }
    }
  }, [isAdmin, authChecked, navigate, fetchProducts]);

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
        fetchProducts(dashboardFetchParams);
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Product Management</h2>
                  <button
                    onClick={handleAddNew}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 transition-colors"
                  >
                    + Add New Product
                  </button>
                </div>

                {loading ? (
                  <LoadingSpinner text="Loading products..." />
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <p>No products found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
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
                                <span className="font-medium">
                                  {product.name}
                                </span>
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
                )}
              </div>
            )}

            {activeTab === "add" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  {selectedProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <AddProduct
                  editProduct={selectedProduct}
                  onSuccess={() => {
                    setActiveTab("manage");
                    setSelectedProduct(null);
                    fetchProducts(dashboardFetchParams);
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
