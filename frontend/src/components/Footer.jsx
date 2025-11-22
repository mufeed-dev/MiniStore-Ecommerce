const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold">MiniStore</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your one-stop destination for quality products at unbeatable
              prices. We're committed to providing the best shopping experience
              with fast delivery and excellent customer service.
            </p>
            <div className="flex gap-4">
              <span className="text-gray-400">📘</span>
              <span className="text-gray-400">📷</span>
              <span className="text-gray-400">🐦</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Store</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>All Products</li>
                <li>Categories</li>
                <li>Best Sellers</li>
                <li>New Arrivals</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Shipping Info</li>
                <li>Returns</li>
                <li>Size Guide</li>
                <li>FAQs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center md:text-left mb-3 md:mb-0">
            Copyright 2025 © Mufeed Rahman PV. All Right Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <span>💳</span> Secure Payments
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <span>🚚</span> Fast Shipping
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
