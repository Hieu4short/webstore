import { Link } from "react-router-dom";
import HeartIcons from "./HeartIcon";
import { getImageUrl } from "../../Utils/getImageUrl";

const Product = ({ product }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xs 2xl:max-w-sm p-2 sm:p-3 relative bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
      <div className="relative">
        <img 
          src={getImageUrl(product.image)}  
          alt={product.name} 
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-48 2xl:h-56 object-cover rounded"
        />
        <HeartIcons product={product} />
      </div>

      <div className="p-2 sm:p-3 md:p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div className="text-base sm:text-lg font-medium text-white line-clamp-2 flex-1">
              {product.name}
            </div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300 whitespace-nowrap self-start sm:self-auto">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;