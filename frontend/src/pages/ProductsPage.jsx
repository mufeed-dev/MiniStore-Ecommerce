import { useEffect, useState } from "react";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductsPage = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "",
    page: 1,
  });
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({ ...prev, category: e.target.value, page: 1 }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      category: "all",
      sort: "",
      page: 1,
    });
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingSpinner size="large" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Discover Amazing Products
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect items at unbeatable prices. Shop with confidence
              and style.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>

              <div className="min-w-[180px]">
                <select
                  value={filters.category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sort By</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {(filters.search || filters.category !== "all" || filters.sort) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <span>🔄</span>
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
                <button
                  onClick={() => setSearchInput("")}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Category: {filters.category}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, category: "all" }))
                  }
                  className="ml-1 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.sort && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Sort:{" "}
                {filters.sort === "price_low"
                  ? "Price Low to High"
                  : filters.sort === "price_high"
                  ? "Price High to Low"
                  : "Name A to Z"}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, sort: "" }))}
                  className="ml-1 hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <span className="text-lg mr-2">⚠️</span>
            {error}
          </div>
        )}

        {products.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{products.length}</span>{" "}
              products
              {filters.search && ` for "${filters.search}"`}
              {filters.category !== "all" && ` in ${filters.category}`}
            </p>
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
                : "No products available yet. Be the first to add a product!"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {loading && (
              <div className="mt-8">
                <LoadingSpinner text="Loading more products..." />
              </div>
            )}

            {products.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold">
                    1
                  </button>
                  <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
