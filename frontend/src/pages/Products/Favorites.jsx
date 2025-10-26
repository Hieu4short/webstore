import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectFavoriteProduct } from "../../redux/features/favorites/FavoriteSlice";
import Product from "./Product";
import { FaHeart, FaShoppingBag, FaArrowLeft } from "react-icons/fa";

const Favorites = () => {
    const favorites = useSelector(selectFavoriteProduct);
    const navigate = useNavigate();

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-pink-600 rounded-full">
                            <FaHeart className="text-white text-2xl" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            My Favorite Products
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
                    </p>
                </div>

                {/* Content */}
                {favorites.length === 0 ? (
                    // Empty State
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                                <FaHeart className="text-gray-600 text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">No favorites yet</h2>
                            <p className="text-gray-400 mb-8">
                                Start adding products to your favorites by clicking the heart icon on any product.
                            </p>
                            <button
                                onClick={() => navigate("/shop")}
                                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
                            >
                                Explore Products
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Products Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {favorites.map((product) => (
                                    <div 
                                        key={product._id} 
                                        className="transform transition duration-300 hover:scale-105"
                                    >
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Checkout Sidebar */}
                        <div className="lg:w-80 xl:w-96">
                            <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
                                <h2 className="text-xl font-semibold text-white mb-6 pb-4 border-b border-gray-600">
                                    Order Summary
                                </h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Items ({favorites.length}):</span>
                                        <span className="text-white font-semibold">
                                            ${favorites.reduce((total, item) => total + (item.price || 0), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Shipping:</span>
                                        <span className="text-white font-semibold">$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-600 pt-4">
                                        <span className="text-white font-bold text-lg">Total:</span>
                                        <span className="text-pink-500 font-bold text-xl">
                                            ${favorites.reduce((total, item) => total + (item.price || 0), 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={checkoutHandler}
                                    className="bg-pink-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-pink-700 transition duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={favorites.length === 0}
                                >
                                    <FaShoppingBag />
                                    Proceed To Checkout
                                </button>

                                <Link
                                    to="/shop"
                                    className="inline-flex items-center justify-center text-gray-300 hover:text-white mt-4 w-full text-center transition duration-200 py-2"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;