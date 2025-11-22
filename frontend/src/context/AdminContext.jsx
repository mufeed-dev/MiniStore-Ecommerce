import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AdminContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setAuthChecked(true);
      return;
    }

    try {
      setAdminLoading(true);
      const response = await axios.get(`${API_BASE_URL}/auth/verify`);

      if (response.data.valid) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem("adminToken");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("adminToken");
    } finally {
      setAdminLoading(false);
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (email, password) => {
    setAdminLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;

      localStorage.setItem("adminToken", token);
      setIsAdmin(true);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      return { success: false, error: errorMessage };
    } finally {
      setAdminLoading(false);
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("adminToken");
  };

  const value = {
    isAdmin,
    adminLoading,
    authChecked,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
