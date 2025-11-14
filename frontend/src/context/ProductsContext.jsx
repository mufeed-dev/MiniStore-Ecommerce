import { createContext, useState, useContext } from "react";
import axios from "axios";

const ProductsContext = createContext();

const API_BASE_URL = "http://localhost:5000/api";

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const {
        search = "",
        category = "",
        sort = "",
        page = 1,
        limit = 8,
      } = filters;

      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          search,
          category: category === "all" ? "" : category,
          sort,
          page,
          limit,
        },
      });

      setProducts(response.data.products);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to fetch products. Please try again.";
      setError(errorMessage);
      console.error("Error fetching products:", err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products`,
        productData
      );
      setProducts((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to add product. Please check your connection and try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    clearError,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
