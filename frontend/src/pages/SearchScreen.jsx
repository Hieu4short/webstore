import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";
import SearchBox from "../components/SearchBox";

const SearchScreen = () => {
  const { keyword } = useParams();
  const [searchKeyword, setSearchKeyword] = useState(keyword || "");
  
  const { data, isLoading, error } = useGetProductsQuery({
    keyword: searchKeyword
  });

  useEffect(() => {
    if (keyword) {
      setSearchKeyword(keyword);
    }
  }, [keyword]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      window.location.href = `/search/${searchKeyword}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto mb-6">
          <SearchBox />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
            {keyword ? `Search Results for "${keyword}"` : "Search Products"}
          </h1>
          {data?.products && (
            <span className="text-gray-300 text-sm sm:text-base">
              {data.products.length} products found
            </span>
          )}
        </div>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || "Error loading products"}
        </Message>
      ) : (
        <>
          {data?.products.length === 0 ? (
            <Message variant="info">
              No products found for "{keyword}". Try different keywords.
            </Message>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
              {data?.products.map((product) => (
                <div key={product._id} className="flex justify-center">
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchScreen;