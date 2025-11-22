import { useState, memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { calculateProductRating } from "../utils/productUtils";
import toast from "react-hot-toast";

const ProductCard = memo(({ product, onProductClick }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const { rating } = useMemo(
    () => calculateProductRating(product._id),
    [product._id]
  );

  const handleAddToCart = useCallback(
    async (e) => {
      e.stopPropagation();
      setIsAdding(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
      setIsAdding(false);
    },
    [addToCart, product]
  );

  const handleCardClick = useCallback(() => {
    if (onProductClick) {
      onProductClick();
    } else {
      navigate(`/product/${product._id}`);
    }
  }, [navigate, product._id, onProductClick]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group mx-auto w-full max-w-sm cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={
            imageError
              ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGM0Y0RjYiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"
              : product.image
          }
          alt={product.name}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl sm:text-2xl font-bold text-blue-600">
            ${product.price}
          </span>
          <div className="flex items-center text-yellow-400">
            <span className="text-sm">⭐</span>
            <span className="text-gray-600 text-xs sm:text-sm ml-1">
              {rating}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full font-semibold py-2 px-3 sm:py-2 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm sm:text-base ${
            isAdding
              ? "bg-gray-400 cursor-not-allowed transform scale-95"
              : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md"
          }`}
        >
          {isAdding ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <span className="mr-2">🛒</span>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
