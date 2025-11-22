import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./components/Cart";
import AboutPage from "./pages/AboutPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <ProductsProvider>
        <CartProvider>
          <AdminProvider>
            <Router>
              <div>
                <Navbar />
                <Cart />
                <main>
                  <Routes>
                    <Route path="/" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </AdminProvider>
        </CartProvider>
      </ProductsProvider>
    </div>
  );
}

export default App;
