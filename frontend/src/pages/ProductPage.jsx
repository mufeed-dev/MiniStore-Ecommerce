import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";
import { calculateProductRating } from "../utils/productUtils";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, fetchProductById } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productError, setProductError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const { rating, reviews } = useMemo(
    () => calculateProductRating(product?._id),
    [product?._id]
  );

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      const cachedProduct = products.find((p) => p._id === id);

      if (cachedProduct) {
        if (isMounted) {
          setProduct(cachedProduct);
          setProductError(null);
          setIsLoading(false);
          setImageError(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoading(true);
        setProductError(null);
        setImageError(false);
      }

      try {
        const fetchedProduct = await fetchProductById(id);
        if (isMounted) {
          setProduct(fetchedProduct);
        }
      } catch (error) {
        if (isMounted) {
          setProduct(null);
          setProductError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, products, fetchProductById]);

  useEffect(() => {
    if (product) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (product) {
      setIsAddingToCart(true);
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      setIsBuying(true);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const message = `I want to buy this product:\n\n🛍️ *${product.name}*\n💰 Price: $${product.price}\n📦 Category: ${product.category}\n\nPlease process my order!`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber =
        import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      setIsBuying(false);
    }
  };

  const handleBack = () => {
    const savedFilters = sessionStorage.getItem("productsFilters");
    const searchState = savedFilters
      ? JSON.parse(savedFilters).search || ""
      : "";

    navigate("/", {
      state: {
        ...(searchState ? { search: searchState } : {}),
        scrollToFilters: true,
      },
    });
  };

  const handleRelatedProductClick = (relatedProductId) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      navigate(`/product/${relatedProductId}`);
    }, 10);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <LoadingSpinner size="large" text="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-8xl mb-6">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {productError
              ? productError
              : "The product you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all duration-300 transform hover:translate-x-1 active:scale-95"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Back to Products</span>
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
              <div className="flex items-center justify-center lg:sticky lg:top-24 lg:self-start">
                <div className="w-full max-w-lg">
                  <img
                    src={
                      imageError
                        ? "https://via.placeholder.com/600x600?text=No+Image"
                        : product.image
                    }
                    alt={product.name}
                    className="w-full h-80 lg:h-96 object-cover rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>

              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                    {product.category}
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <span className="text-4xl lg:text-5xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <div className="flex items-center text-yellow-400 bg-yellow-50 px-4 py-2 rounded-full">
                      <span className="text-2xl">⭐</span>
                      <span className="text-gray-700 text-lg font-semibold ml-2">
                        {rating}{" "}
                        <span className="text-gray-500 font-normal">
                          ({reviews} reviews)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Product Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Premium quality {product.category.toLowerCase()} product
                    with excellent customer ratings. Fast shipping and reliable
                    service guaranteed. This product offers great value and is
                    backed by our satisfaction guarantee.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Key Features
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>High quality materials</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Fast and reliable shipping</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>30-day return policy</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span>Excellent customer support</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      isAddingToCart
                        ? "bg-gray-400 cursor-not-allowed transform scale-95"
                        : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-xl transform hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <svg
                          className="animate-spin h-6 w-6 text-white"
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
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🛒</span>
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isBuying}
                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      isBuying
                        ? "bg-gray-400 cursor-not-allowed transform scale-95"
                        : "bg-green-500 hover:bg-green-600 text-white hover:shadow-xl transform hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isBuying ? (
                      <>
                        <svg
                          className="animate-spin h-6 w-6 text-white"
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
                        Preparing...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">📱</span>
                        Buy Now
                      </>
                    )}
                  </button>
                </div>

                <div className="border-t pt-6 mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <div className="font-semibold">Free Shipping</div>
                        <div className="text-sm">On orders over $50</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-2xl">↩️</span>
                      <div>
                        <div className="font-semibold">Easy Returns</div>
                        <div className="text-sm">30-day return policy</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <div className="font-semibold">Secure Payment</div>
                        <div className="text-sm">Your data is protected</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-2xl">📞</span>
                      <div>
                        <div className="font-semibold">24/7 Support</div>
                        <div className="text-sm">We're here to help</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {products.filter(
            (p) => p._id !== product._id && p.category === product.category
          ).length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(
                    (p) =>
                      p._id !== product._id && p.category === product.category
                  )
                  .slice(0, 3)
                  .map((relatedProduct) => (
                    <div
                      key={relatedProduct._id}
                      className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                      onClick={() =>
                        handleRelatedProductClick(relatedProduct._id)
                      }
                    >
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-blue-600">
                          ${relatedProduct.price}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          {relatedProduct.category}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
