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
        limit = 6,
      } = filters;

      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { search, category, sort, page, limit },
      });

      setProducts(response.data.products);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch products");
      console.error("Error fetching products:", err);
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
      setError(err.response?.data?.error || "Failed to add product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    setError,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
