import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SmallProduct from "./Products/SmallProduct";
import ProductCarousel from "./Products/ProductCarousel";
import Product from "./Products/Product";
import { Link } from "react-router-dom";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Error loading products</Message>;

  return (
    <div className="container mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
      {/* Main Content - Layout cột trái/phải */}
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
        {/* Cột trái: Danh sách sản phẩm chính */}
        <div className="xl:flex-[3] lg:flex-[2] order-2 xl:order-1">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {data?.products?.map((product) => (
              <div key={product._id} className="flex justify-center">
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Carousel */}
        <div className="xl:flex-1 lg:flex-none xl:w-80 2xl:w-96 order-1 xl:order-2">
          <div className="sticky top-4">
            <ProductCarousel />
          </div>
        </div>
      </div>

      {/* Special Products Section */}
      <div className="mt-8 sm:mt-12 lg:mt-16">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center sm:text-left">
            Special Products
          </h1>
          <Link
            to="/shop"
            className="bg-pink-600 text-white font-bold rounded-full py-2 px-4 sm:px-6 text-sm sm:text-base hover:bg-pink-700 transition-colors duration-300 whitespace-nowrap"
          >
            View All Products
          </Link>
        </div>

        {/* Special Products Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {data?.products?.slice(0, 12)?.map((product) => (
            <div key={product._id} className="flex justify-center">
              <Product product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;