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
    <div className="p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-transform duration-300 transform hover:scale-105 flex flex-col justify-between">
      {/* ẢNH SẢN PHẨM */}
      <div className="relative flex justify-center items-center aspect-[1/1] overflow-hidden rounded-md bg-[#0f0f0f]">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="object-contain w-full h-full p-2"
        />
        {/* Icon yêu thích đặt tuyệt đối */}
        <div className="absolute top-2 right-2 z-10">
          <HeartIcons product={product} />
        </div>
      </div>

      {/* THÔNG TIN */}
      <div className="mt-3 text-center">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
            {product.name}
          </h2>
          <p className="text-pink-500 font-bold mt-1">${product.price}</p>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
