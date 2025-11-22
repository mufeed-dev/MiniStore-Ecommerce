import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;

    const savedCartItems = localStorage.getItem("cartItems");

    if (savedCartItems) {
      try {
        const parsedItems = JSON.parse(savedCartItems);
        if (Array.isArray(parsedItems)) {
          setCartItems(parsedItems);
        }
      } catch (error) {
        console.error("Error parsing cart items:", error);
        localStorage.removeItem("cartItems");
      }
    }

    isInitializedRef.current = true;
  }, []);

  useEffect(() => {
    if (!isInitializedRef.current) return;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId, newQuantity) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    toggleCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
