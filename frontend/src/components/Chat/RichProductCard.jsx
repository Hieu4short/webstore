import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaStar, FaEye } from "react-icons/fa";

const RichProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: quantity }));
    if (onAddToCart) {
      onAddToCart(product.name);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-sm mx-auto">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          ${product.price}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">{product.rating}/5</span>
          </div>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-600">{product.brand}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Stock Status */}
        <div className="mb-4">
          {product.countInStock > 0 ? (
            <span className="text-green-600 text-sm font-medium">
              ✅ {product.countInStock} in stock
            </span>
          ) : (
            <span className="text-red-600 text-sm font-medium">
              ❌ Out of stock
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Quantity Selector */}
          {product.countInStock > 0 && (
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  Qty: {x + 1}
                </option>
              ))}
            </select>
          )}

          {/* Add to Cart Button */}
          {product.countInStock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200 text-sm font-semibold"
            >
              <FaShoppingCart />
              Add
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>

        {/* View Details Link */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <Link
            to={`/product/${product._id}`}
            className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1 justify-center"
          >
            <FaEye />
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RichProductCard;