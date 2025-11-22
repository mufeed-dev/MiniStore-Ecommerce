import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import BannerSlider from "../components/BannerSlider";
import Footer from "../components/Footer";
import { useScrollToFilters } from "../hooks/useScrollToFilters";
import { getSortDisplayText } from "../utils/sortUtils";

const ProductsPage = () => {
  const { products, loading, error, pagination, fetchProducts } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialFilters = () => {
    const savedFilters = sessionStorage.getItem("productsFilters");
    const searchFromState = location.state?.search || "";

    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      return {
        ...parsed,
        search: searchFromState || parsed.search,
      };
    }

    return {
      search: searchFromState,
      category: "all",
      sort: "",
      page: 1,
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const scrollToFilters = useScrollToFilters();

  useEffect(() => {
    sessionStorage.setItem("productsFilters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    const searchFromState =
      location.state && typeof location.state.search === "string"
        ? location.state.search
        : "";

    if (searchFromState === filters.search) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      search: searchFromState,
      page: 1,
    }));
  }, [location.state?.search, filters.search]);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  useEffect(() => {
    if (hasUserInteracted && filters.page === 1) {
      const timer = setTimeout(() => {
        scrollToFilters();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [
    filters.category,
    filters.sort,
    filters.search,
    scrollToFilters,
    hasUserInteracted,
  ]);

  const handleCategoryChange = (e) => {
    setHasUserInteracted(true);
    setFilters((prev) => ({ ...prev, category: e.target.value, page: 1 }));
  };

  const handleSortChange = (e) => {
    setHasUserInteracted(true);
    setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    scrollToFilters();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      sort: "",
      page: 1,
    });
    setHasUserInteracted(true);
    sessionStorage.removeItem("productsFilters");
    navigate("/", {
      replace: true,
      state: {},
    });
  };

  const handleProductClick = useCallback(
    (product) => {
      navigate(`/product/${product._id}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (location.state?.scrollToFilters) {
      const timer = setTimeout(() => {
        scrollToFilters();
        navigate("/", {
          replace: true,
          state: {
            ...(location.state?.search
              ? { search: location.state.search }
              : {}),
          },
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [
    location.state?.scrollToFilters,
    scrollToFilters,
    navigate,
    location.state?.search,
  ]);

  const shouldShowBanner =
    !filters.search && filters.category === "all" && !filters.sort;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {shouldShowBanner && <BannerSlider />}

      <div className={`flex-1 ${!shouldShowBanner ? "mt-12" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
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
                    <option value="Home & Kitchen">🏠 Home & Kitchen</option>
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
                        {getSortDisplayText(filters.sort)}
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <span className="text-lg mr-2">⚠️</span>
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {filters.search
                  ? `Search Results for "${filters.search}"`
                  : filters.category !== "all"
                  ? `${filters.category} Products`
                  : "All Products"}
              </h1>
              <p className="text-gray-600 mt-1">
                Showing {products.length} of {pagination.totalProducts} products
              </p>
            </div>

            {pagination.totalPages > 1 && (
              <p className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
            )}
          </div>

          {loading && products.length === 0 && (
            <div>
              <LoadingSpinner size="large" text="Loading products..." />
            </div>
          )}

          {products.length === 0 && !loading ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
              <div className="text-gray-400 text-8xl mb-6">📦</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                No products found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {filters.search || filters.category !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "No products available yet. Check back later!"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onProductClick={() => handleProductClick(product)}
                  />
                ))}
              </div>

              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
