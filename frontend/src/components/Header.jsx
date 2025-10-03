import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import SmallProduct from "../pages/Products/SmallProduct";
import Loader from "./Loader";
import Message from "./Message";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Error loading top products</Message>;

  return (
    <div className="flex justify-around">
      <div className="xl:block lg:hidden md:hidden sm:hidden">
        <div className="grid grid-cols-2 gap-4">
          {products?.map((product) => (
            <div key={product._id}>
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>
      <ProductCarousel/>
    </div>
  );
};

export default Header;
