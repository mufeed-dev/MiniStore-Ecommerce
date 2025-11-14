const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price}
          </span>
          <div className="flex items-center text-yellow-400">
            <span>⭐</span>
            <span className="text-gray-600 text-sm ml-1">
              {(Math.random() * 2 + 3).toFixed(1)}
            </span>
          </div>
        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
          <span className="mr-2">🛒</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
