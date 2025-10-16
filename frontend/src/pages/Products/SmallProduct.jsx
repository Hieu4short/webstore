import { Link } from "react-router-dom";
import HeartIcons from "./HeartIcon";

// Helper build URL ảnh
const getImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http")) return imgPath;
  return `http://localhost:5050${imgPath}`;
};

const SmallProduct = ({ product }) => {
  return (
    <div className="p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
      <div className="relative">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-32 xs:h-36 sm:h-40 md:h-44 object-contain rounded"
        />
        <HeartIcons product={product} />
      </div>
      <div className="mt-2 sm:mt-3">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 text-white font-semibold">
            <span className="text-sm sm:text-base line-clamp-1 xs:line-clamp-2 flex-1">
              {product.name}
            </span>
            <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap self-start xs:self-auto">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;