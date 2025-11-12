import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProductsProvider } from "./context/ProductsContext";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <ProductsProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/add-product" element={<AddProduct />} />
          </Routes>
        </div>
      </Router>
    </ProductsProvider>
  );
}

export default App;
