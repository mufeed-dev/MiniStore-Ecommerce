import { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";

const ProductsContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProducts = useCallback(
    async (filters = {}) => {
      setLoading(true);
      clearError();
      try {
        const {
          search = "",
          category = "",
          sort = "",
          page = 1,
          limit = 12,
        } = filters;

        const response = await axios.get(`${API_BASE_URL}/products`, {
          params: {
            search: search.trim(),
            category: category === "all" ? "" : category,
            sort,
            page,
            limit,
          },
        });

        setProducts(response.data.products);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalProducts: response.data.totalProducts,
          hasNext: response.data.hasNext,
          hasPrev: response.data.hasPrev,
        });
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
    },
    [clearError]
  );

  const addProduct = async (productData) => {
    clearError();
    try {
      await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to add product. Please check your connection and try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (id, productData) => {
    clearError();
    try {
      await axios.put(`${API_BASE_URL}/products/${id}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to update product. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProduct = async (id) => {
    clearError();
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to delete product. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const fetchProductById = useCallback(
    async (id) => {
      try {
        const cachedProduct = products.find((product) => product._id === id);
        if (cachedProduct) {
          return cachedProduct;
        }

        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.error ||
          "Failed to fetch product. Please try again.";
        console.error("Error fetching product by id:", err);
        throw new Error(errorMessage);
      }
    },
    [products]
  );

  const value = {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    clearError,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
