import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    return `http://localhost:5050${imgPath}`;
};

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Message variant="danger">Error loading products</Message>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Admin Menu - Responsive */}
          <div className="lg:w-1/4 xl:w-1/5">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 xl:w-4/5">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-6 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                All Products ({products.length})
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Manage and update your product catalog
              </p>
            </div>

            {/* Products Grid */}
            <div className="space-y-4 sm:space-y-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="block"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-6 hover:border-pink-500 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full sm:w-32 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                          <h5 className="text-lg sm:text-xl font-semibold text-white line-clamp-2">
                            {product.name}
                          </h5>
                          <p className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">
                            {moment(product.createdAt).format("MMM Do YYYY")}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-2 sm:line-clamp-3">
                          {product.description?.substring(0, 120)}...
                        </p>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <Link
                            to={`/admin/product/update/${product._id}`}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-center text-white 
                            bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 
                            transition-colors duration-200 w-full sm:w-auto"
                          >
                            Update Product
                            <svg
                              className="w-3.5 h-3.5 ml-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </Link>
                          <p className="text-pink-500 font-bold text-lg sm:text-xl text-center sm:text-right">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-8 text-center">
                <div className="text-gray-500 text-4xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">No products found</h3>
                <p className="text-gray-500">Start by adding your first product.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;