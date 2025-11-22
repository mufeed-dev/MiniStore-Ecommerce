import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAdmin } from "../context/AdminContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleCart, getCartItemsCount } = useCart();
  const { isAdmin, logout } = useAdmin();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const isSyncingRef = useRef(false);
  const lastPathnameRef = useRef(location.pathname);
  const lastSyncedSearchRef = useRef("");

  const handleAdminLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (location.pathname !== "/") {
      lastPathnameRef.current = location.pathname;
      return;
    }

    const pathnameChanged = lastPathnameRef.current !== location.pathname;
    lastPathnameRef.current = location.pathname;

    const searchFromState =
      typeof location.state?.search === "string" ? location.state.search : "";

    const shouldSync =
      pathnameChanged ||
      (searchFromState !== lastSyncedSearchRef.current &&
        !isSyncingRef.current);

    if (shouldSync) {
      isSyncingRef.current = true;
      lastSyncedSearchRef.current = searchFromState;
      setSearchInput(searchFromState);
      setDebouncedSearch(searchFromState);
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [location.pathname, location.state?.search]);

  useEffect(() => {
    if (location.pathname !== "/" || isSyncingRef.current) {
      return;
    }

    const trimmedSearch = debouncedSearch.trim();
    const currentSearch =
      typeof location.state?.search === "string" ? location.state.search : "";

    if (trimmedSearch === currentSearch) {
      return;
    }

    lastSyncedSearchRef.current = trimmedSearch;
    navigate("/", {
      replace: true,
      state: { search: trimmedSearch },
    });
  }, [debouncedSearch, navigate, location.pathname, location.state?.search]);

  const handleClearSearch = () => {
    setSearchInput("");
    setDebouncedSearch("");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-gray-900 text-white px-4 sm:px-6 py-4 shadow-lg">
      <div
        className="text-[16px] sm:text-xl font-bold cursor-pointer hover:text-blue-300 transition-colors flex items-center gap-2"
        onClick={() => navigate("/")}
      >
        <span className="text-2xl">🛒</span>
        <span>MiniStore</span>
      </div>

      {location.pathname === "/" && (
        <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 sm:gap-4 items-center">
        {!isAdmin && (
          <button
            onClick={() => navigate("/about")}
            className="hidden lg:flex bg-transparent hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition-colors text-sm sm:text-base items-center gap-2"
          >
            About Us
          </button>
        )}
        {isAdmin && location.pathname !== "/admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base"
          >
            Admin Panel
          </button>
        )}

        {isAdmin && location.pathname === "/admin" && (
          <button
            onClick={handleAdminLogout}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        )}

        {location.pathname === "/admin-login" && (
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base"
          >
            ← Back to Store
          </button>
        )}

        <button
          onClick={toggleCart}
          className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="text-xl">🛒</span>
          {getCartItemsCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getCartItemsCount()}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
