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
    <div className="p-3">
      <img
        src={getImageUrl(product.image)}
        alt={product.name}
        className="w-full h-48 object-contain rounded"
      />
      <HeartIcons product={product} />
      <div className="mt-3">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-white font-semibold">
            <span>{product.name}</span>
            <span className="bg-pink-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
