import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    isCartOpen,
    closeCart,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    let message = "🛒 *ORDER SUMMARY*\n\n";

    cartItems.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      message += `   Price: $${item.price} x ${item.quantity} = $${(
        item.price * item.quantity
      ).toFixed(2)}\n\n`;
    });

    message += `💰 *TOTAL: $${getCartTotal().toFixed(2)}*\n\n`;
    message += "Please process my order! I want to buy these products.";

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    clearCart();
    toast.success("Order prepared! Redirecting to WhatsApp...");
    setTimeout(() => window.open(whatsappUrl, "_blank"), 1000);
    closeCart();
  };

  return (
    <div
      className="fixed inset-0 flex justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50 }}
      onClick={closeCart}
    >
      <div
        className="bg-white w-full max-w-md h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={closeCart}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3 border rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <span>📱</span>
                  Checkout via WhatsApp
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                You'll be redirected to WhatsApp to complete your order. Cart
                will be cleared after checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
