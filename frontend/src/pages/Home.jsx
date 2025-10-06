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
    <div className="container mx-auto px-4 mt-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cột trái: danh sách sản phẩm */}
        <div className="lg:flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data?.products?.map((product) => (
              <SmallProduct key={product._id} product={product} />
            ))}
          </div>
        </div>

        {/* Cột phải: carousel */}
        <div className="lg:w-1/3 xl:w-1/4">
          <ProductCarousel />
        </div>
      </div>

      {/* Phần header Special Products */}
      <div className="flex justify-between items-center mt-8">
        <h1 className="ml-[2rem] text-[2rem]">Special Products</h1>
        <Link
          to="/shop"
          className="bg-pink-600 font-bold rounded-full py-2 px-6 mr-[2rem]"
        >
          Shop
        </Link>
      </div>

      {/* Danh sách Special Products */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex justify-center flex-wrap gap-6">
          {data?.products?.map((product) => (
            <div key={product._id}>
              <Product product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;