import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import moment from "moment";

const ProductTabs = ({
    loadingProductReview, 
    userInfo,
    submitHandler,
    rating,
    setRating,
    comment,
    setComment,
    product
}) => {
    const { data, isLoading } = useGetTopProductsQuery();

    const [activeTab, setActiveTab] = useState(1);

    if (isLoading) {
        return <Loader />;
    }

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Tabs Navigation - Now horizontal on mobile, vertical on desktop */}
            <section className="lg:w-1/4 xl:w-1/5">
                <div className="flex lg:flex-col gap-2 sm:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                    <div 
                        className={`flex-shrink-0 p-3 sm:p-4 cursor-pointer rounded-lg transition-colors ${
                            activeTab === 1 
                                ? "bg-pink-600 text-white font-bold" 
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`} 
                        onClick={() => handleTabClick(1)}
                    >
                        <span className="text-sm sm:text-base whitespace-nowrap">Write Your Review</span>
                    </div>

                    <div 
                        className={`flex-shrink-0 p-3 sm:p-4 cursor-pointer rounded-lg transition-colors ${
                            activeTab === 2 
                                ? "bg-pink-600 text-white font-bold" 
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`} 
                        onClick={() => handleTabClick(2)}
                    >
                        <span className="text-sm sm:text-base whitespace-nowrap">All Reviews</span>
                    </div>

                    <div 
                        className={`flex-shrink-0 p-3 sm:p-4 cursor-pointer rounded-lg transition-colors ${
                            activeTab === 3 
                                ? "bg-pink-600 text-white font-bold" 
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`} 
                        onClick={() => handleTabClick(3)}
                    >
                        <span className="text-sm sm:text-base whitespace-nowrap">Related Products</span>
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="lg:flex-1">
                {/* Write Review Tab */}
                {activeTab === 1 && (
                    <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                        {userInfo ? (
                            <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label htmlFor="rating" className="block text-lg sm:text-xl mb-2 sm:mb-3 text-white">
                                        Rating
                                    </label>
                                    <select 
                                        id="rating" 
                                        required 
                                        value={rating} 
                                        onChange={(e) => setRating(e.target.value)} 
                                        className="p-3 border rounded-lg w-full max-w-md text-black bg-white"
                                    >
                                        <option value="">Select a rating</option>
                                        <option value="1">⭐ - Inferior</option>
                                        <option value="2">⭐⭐ - Decent</option>
                                        <option value="3">⭐⭐⭐ - Great</option>
                                        <option value="4">⭐⭐⭐⭐ - Excellent</option>
                                        <option value="5">⭐⭐⭐⭐⭐ - Exceptional</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="comment" className="block text-lg sm:text-xl mb-2 sm:mb-3 text-white">
                                        Comment
                                    </label>
                                    <textarea 
                                        id="comment" 
                                        rows="4" 
                                        required 
                                        value={comment} 
                                        onChange={e => setComment(e.target.value)} 
                                        className="p-3 border rounded-lg w-full text-black bg-white resize-vertical"
                                        placeholder="Share your experience with this product..."
                                    ></textarea>
                                </div>

                                <button 
                                    className="bg-pink-600 text-white py-3 px-6 rounded-lg text-base sm:text-lg font-semibold hover:bg-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit" 
                                    disabled={loadingProductReview}
                                >
                                    {loadingProductReview ? "Submitting..." : "Submit Review"}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-300 text-lg mb-4">
                                    Please <Link to="/login" className="text-pink-500 hover:text-pink-400 font-semibold">sign in</Link> to write a review
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* All Reviews Tab */}
                {activeTab === 2 && (
                    <div className="space-y-4">
                        {product.reviews.length === 0 ? (
                            <Message>No Reviews</Message>
                        ) : (
                            <div className="space-y-4">
                                {product.reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="bg-gray-800 p-4 sm:p-6 rounded-lg"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                                            <p className="font-semibold text-white text-lg">{review.name}</p>
                                            <p className="text-gray-400 text-sm">
                                                {moment(review.createdAt).fromNow()}
                                            </p>
                                        </div>
                                        <div className="mb-3">
                                            <Ratings value={review.rating} />
                                        </div>
                                        <p className="text-gray-300 mt-2 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Related Products Tab */}
                {activeTab === 3 && (
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Related Products</h1>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {data?.map((product) => (
                                <div key={product._id} className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-700 transition duration-200">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-32 xs:h-36 sm:h-40 object-contain rounded mb-3"
                                        />
                                        <h3 className="text-white font-semibold text-center mb-2 line-clamp-2 text-sm sm:text-base">
                                            {product.name}
                                        </h3>
                                        <p className="text-pink-600 font-bold text-base sm:text-lg">$ {product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProductTabs;