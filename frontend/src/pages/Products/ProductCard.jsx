import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeartIcon from "./HeartIcon";
import CompareButton from "../../components/CompareButton";
import { getImageUrl } from "../../Utils/getImageUrl";


const ProductCard = ({ p }) => {
    const dispatch = useDispatch();
  
    const addToCartHandler = (product, qty) => {
      dispatch(addToCart({ ...product, qty }));
      toast.success("Item added successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    };
  
    return (
      <>
        <div className="w-full max-w-xs sm:max-w-sm bg-[#1A1A1A] rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          {/* Image Section */}
          <section className="relative">
            <Link to={`/product/${p._id}`} className="block">
              <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300 z-10">
                {p?.brand}
              </span>
              <img 
                className="cursor-pointer w-full rounded-t-lg" 
                src={getImageUrl(p.image)} // SỬA: dùng getImageUrl
                alt={p.name}
                style={{ 
                  height: "200px", 
                  objectFit: "contain",
                  backgroundColor: "#2A2A2A"
                }}
              />
            </Link>
            <HeartIcon product={p} />
          </section>
  
          {/* Content Section */}
          <div className="p-3 sm:p-4">
            {/* Product Name and Price */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h5 className="text-base sm:text-lg font-semibold text-white dark:text-white line-clamp-2 flex-1">
                {p?.name}
              </h5>
              <p className="text-pink-500 font-bold text-lg sm:text-xl whitespace-nowrap">
                {p?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
  
            {/* Product Description */}
            <p className="mb-3 font-normal text-[#CFCFCF] text-sm sm:text-base line-clamp-2">
              {p?.description?.substring(0, 80)}...
            </p>
  
            {/* Action Buttons */}
            <section className="flex justify-between items-center gap-2 sm:gap-3">
              {/* Read More Button */}
              <Link
                to={`/product/${p._id}`}
                className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-center text-white 
                bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 
                dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800 transition-colors duration-200 flex-1 sm:flex-none justify-center"
              >
                Read More
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2} d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </Link>

              {/* Compare Button */}
              <div className="flex-shrink-0">
                <CompareButton product={p} />
              </div>
  
              {/* Add to Cart Button */}
              <button 
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200 flex-shrink-0" 
                onClick={() => addToCartHandler(p, 1)}
                aria-label="Add to cart"
              >
                <AiOutlineShoppingCart size={20} className="sm:w-5 sm:h-5" />
              </button>
            </section>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  };
  
  export default ProductCard;