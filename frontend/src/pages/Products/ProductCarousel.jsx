import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
          dots: true
        }
      },
      {
        breakpoint: 640,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="mb-4 w-full bg-gray-800 rounded-lg p-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="outline-none px-2">
                <div className="flex flex-col">
                  <img
                    src={image}
                    alt={name}
                    className="w-full rounded-lg object-cover h-48 sm:h-56 md:h-64 lg:h-72"
                  />

                  <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-white line-clamp-1">{name}</h2>
                      <p className="text-xl sm:text-2xl font-bold text-pink-600">${price}</p>
                    </div>

                    <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">
                      {description.substring(0, 120)}...
                    </p>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center">
                          <FaStore className="mr-2 text-white flex-shrink-0" size={14} />
                          <span className="truncate">Brand: {brand}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-white flex-shrink-0" size={14} />
                          <span>Added: {moment(createdAt).fromNow()}</span>
                        </div>
                        <div className="flex items-center">
                          <FaStar className="mr-2 text-white flex-shrink-0" size={14} />
                          <span>Reviews: {numReviews}</span>
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center">
                          <FaStar className="mr-2 text-white flex-shrink-0" size={14} />
                          <span>Ratings: {Math.round(rating)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaShoppingCart className="mr-2 text-white flex-shrink-0" size={14} />
                          <span>Quantity: {quantity}</span>
                        </div>
                        <div className="flex items-center">
                          <FaBox className="mr-2 text-white flex-shrink-0" size={14} />
                          <span>In Stock: {countInStock}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;