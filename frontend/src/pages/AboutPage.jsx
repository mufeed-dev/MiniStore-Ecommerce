const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                About MiniStore
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your trusted destination for quality products and exceptional
                shopping experiences
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-gray-600 mb-4">
                  Founded with a passion for bringing quality products to
                  customers worldwide, MiniStore has been serving shoppers since
                  2025. We believe that everyone deserves access to great
                  products at affordable prices.
                </p>
                <p className="text-gray-600">
                  Our mission is to create a seamless shopping experience that
                  combines convenience, quality, and excellent customer service.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Why Choose Us?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">
                      Quality Guaranteed Products
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Fast & Free Shipping</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">24/7 Customer Support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">
                      Secure Payment Options
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">
                      Easy Returns & Refunds
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Our Values
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">🔒</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trust</h3>
                  <p className="text-gray-600 text-sm">
                    Building lasting relationships through transparency and
                    reliability
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">⭐</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quality</h3>
                  <p className="text-gray-600 text-sm">
                    Curating only the best products for our valued customers
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">🚀</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Innovation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Continuously improving our platform and services
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">❤️</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Care</h3>
                  <p className="text-gray-600 text-sm">
                    Putting our customers at the heart of everything we do
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-12 mt-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Get In Touch
                </h2>
                <p className="text-gray-600 mb-6">
                  Have questions? We'd love to hear from you!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📧</span>
                    <span>support@ministore.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📞</span>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📍</span>
                    <span>123 Commerce St, City, State</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
